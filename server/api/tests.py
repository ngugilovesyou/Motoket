from decimal import Decimal
from unittest.mock import patch

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import FavouritedVehicle, Payment, User, Vehicle, VehicleImage


def make_user(**kwargs):
    defaults = dict(
        first_name="Jane", last_name="Doe",
        email="jane@example.com", password="plain",
    )
    defaults.update(kwargs)
    user = User(
        first_name=defaults["first_name"],
        last_name=defaults["last_name"],
        email=defaults["email"],
        role=defaults.get("role", "Buyer"),
    )
    user.set_password(defaults["password"])
    user.save()
    for k, v in defaults.items():
        if k not in ("first_name", "last_name", "email", "password", "role"):
            setattr(user, k, v)
    if any(k not in ("first_name", "last_name", "email", "password", "role") for k in defaults):
        user.save()
    return user


_vehicle_counter = 0

def make_vehicle(user, **kwargs):
   
    global _vehicle_counter
    _vehicle_counter += 1

    defaults = dict(
        make="Toyota", model="Corolla", year=2020,
        fuel_type="Gasoline", transmission="Automatic",
        body_type="Sedan", price=Decimal("1500000"),
        description="A reliable car.", region="Nairobi, Kenya",
    )
    defaults.update(kwargs)

    
    v = Vehicle(user=user, **defaults)
    
    v.save()
    return v



# MODEL: User


class UserModelTest(TestCase):

    def setUp(self):
        self.user = make_user()

    def test_str(self):
        self.assertEqual(str(self.user), "Jane Doe")

    def test_default_role_is_buyer(self):
        u = make_user(email="other@x.com")
        self.assertEqual(u.role, "Buyer")

    def test_password_is_hashed(self):
        self.assertIn("$", self.user.password)
        self.assertNotEqual(self.user.password, "plain")

    def test_check_password_correct(self):
        self.assertTrue(self.user.check_password("plain"))

    def test_check_password_wrong(self):
        self.assertFalse(self.user.check_password("wrong"))

    def test_email_unique(self):
        from django.db import IntegrityError
        with self.assertRaises(IntegrityError):
            User.objects.create(
                first_name="A", last_name="B",
                email="jane@example.com", password="x",
            )

    def test_firebase_uid_nullable(self):
        self.assertIsNone(self.user.firebase_uid)

    def test_image_url_nullable(self):
        self.assertIsNone(self.user.image_url)

    def test_created_at_set(self):
        self.assertIsNotNone(self.user.created_at)



# MODEL: Vehicle


class VehicleModelTest(TestCase):

    def setUp(self):
        self.user = make_user()
        self.vehicle = make_vehicle(self.user)

    def test_str(self):
        self.assertEqual(str(self.vehicle), "2020 Toyota Corolla")

    def test_slug_auto_generated(self):
        self.assertIsNotNone(self.vehicle.slug)
        self.assertIn("toyota", self.vehicle.slug)

    def test_meta_title_auto_generated(self):
        self.assertIn("Toyota", self.vehicle.meta_title)
        self.assertIn("for Sale", self.vehicle.meta_title)

    def test_meta_description_auto_generated(self):
        self.assertIn("Nairobi", self.vehicle.meta_description)

    def test_has_discount_true(self):
        self.vehicle.original_price = Decimal("2000000")
        self.vehicle.save()
        self.assertTrue(self.vehicle.has_discount)

    def test_has_discount_false_when_no_original_price(self):
        self.assertFalse(self.vehicle.has_discount)

    def test_discount_percentage_calculated(self):
        self.vehicle.original_price = Decimal("2000000")
        self.vehicle.save()
        self.assertAlmostEqual(self.vehicle.discount_percentage, 25.0)

    def test_discount_percentage_zero_when_no_discount(self):
        self.assertEqual(self.vehicle.discount_percentage, 0)

    def test_is_new_for_fresh_listing(self):
        self.assertTrue(self.vehicle.is_new)

    def test_increment_view_count(self):
        self.vehicle.increment_view_count()
        self.assertEqual(self.vehicle.view_count, 1)

    def test_increment_save_count(self):
        self.vehicle.increment_save_count()
        self.assertEqual(self.vehicle.save_count, 1)

    def test_decrement_save_count(self):
        self.vehicle.save_count = 3
        self.vehicle.save()
        self.vehicle.decrement_save_count()
        self.assertEqual(self.vehicle.save_count, 2)

    def test_decrement_save_count_no_underflow(self):
        self.vehicle.save_count = 0
        self.vehicle.save()
        self.vehicle.decrement_save_count()
        self.assertEqual(self.vehicle.save_count, 0)

    def test_default_flags(self):
        self.assertFalse(self.vehicle.is_featured)
        self.assertFalse(self.vehicle.is_sold)
        self.assertTrue(self.vehicle.is_active)

    def test_cascade_delete_with_user(self):
        vid = self.vehicle.id
        self.user.delete()
        self.assertFalse(Vehicle.objects.filter(id=vid).exists())



# MODEL: VehicleImage


class VehicleImageModelTest(TestCase):

    def setUp(self):
        self.user = make_user()
        self.vehicle = make_vehicle(self.user)

    def test_alt_text_auto_generated(self):
        img = VehicleImage.objects.create(vehicle=self.vehicle, image="path/img.jpg")
        self.assertIn("Toyota", img.alt_text)

    def test_str_contains_vehicle(self):
        img = VehicleImage.objects.create(vehicle=self.vehicle, image="x.jpg")
        self.assertIn("Toyota", str(img))

    def test_cascade_delete_with_vehicle(self):
        VehicleImage.objects.create(vehicle=self.vehicle, image="x.jpg")
        self.vehicle.delete()
        self.assertEqual(VehicleImage.objects.count(), 0)



# MODEL: FavouritedVehicle


class FavouritedVehicleModelTest(TestCase):

    def setUp(self):
        self.user = make_user()
        self.vehicle = make_vehicle(self.user)

    def test_create_favourite(self):
        fav = FavouritedVehicle.objects.create(user=self.user, vehicle=self.vehicle)
        self.assertEqual(fav.user, self.user)

    def test_cascade_on_user_delete(self):
        FavouritedVehicle.objects.create(user=self.user, vehicle=self.vehicle)
        self.user.delete()
        self.assertEqual(FavouritedVehicle.objects.count(), 0)



# MODEL: Payment


class PaymentModelTest(TestCase):

    def setUp(self):
        self.user = make_user()
        self.payment = Payment.objects.create(
            user=self.user, amount=Decimal("500"),
            payment_method="Mpesa", transaction_id="TXN001",
        )

    def test_default_status_is_pending(self):
        self.assertEqual(self.payment.status, "Pending")

    def test_transaction_id_unique(self):
        from django.db import IntegrityError
        with self.assertRaises(IntegrityError):
            Payment.objects.create(
                user=self.user, amount=1,
                payment_method="Mpesa", transaction_id="TXN001",
            )

    def test_cascade_on_user_delete(self):
        self.user.delete()
        self.assertEqual(Payment.objects.count(), 0)



# AUTH VIEWS


class RegisterUserViewTest(APITestCase):

    url = reverse("register_user")

    def _post(self, **kwargs):
        data = dict(
            first_name="Ali", last_name="Hassan",
            email="ali@example.com", password="Secure1!",
            confirm_password="Secure1!", role="Buyer",
        )
        data.update(kwargs)
        return self.client.post(self.url, data, format="json")

    def test_successful_registration(self):
        r = self._post()
        self.assertEqual(r.status_code, 201)
        self.assertTrue(User.objects.filter(email="ali@example.com").exists())

    def test_passwords_mismatch(self):
        r = self._post(confirm_password="Different1!")
        self.assertEqual(r.status_code, 400)
        self.assertIn("match", r.data["error"])

    def test_password_too_short(self):
        r = self._post(password="Ab1!", confirm_password="Ab1!")
        self.assertEqual(r.status_code, 400)

    def test_duplicate_email(self):
        self._post()
        r = self._post()
        self.assertEqual(r.status_code, 400)
        self.assertIn("already exists", r.data["error"])

    def test_missing_first_name(self):
        r = self._post(first_name="")
        self.assertEqual(r.status_code, 400)


class LoginUserViewTest(APITestCase):

    url = reverse("login_user")

    def setUp(self):
        self.user = make_user(email="login@example.com", password="pass1234")

    def test_successful_login_returns_token(self):
        r = self.client.post(self.url, {"email": "login@example.com", "password": "pass1234"}, format="json")
        self.assertEqual(r.status_code, 200)
        self.assertIn("token", r.data)
        self.assertEqual(r.data["user"]["email"], "login@example.com")

    def test_wrong_password_returns_401(self):
        r = self.client.post(self.url, {"email": "login@example.com", "password": "wrong"}, format="json")
        self.assertEqual(r.status_code, 401)

    def test_nonexistent_email_returns_401(self):
        r = self.client.post(self.url, {"email": "nobody@x.com", "password": "pass"}, format="json")
        self.assertEqual(r.status_code, 401)

    def test_missing_fields_returns_400(self):
        r = self.client.post(self.url, {}, format="json")
        self.assertEqual(r.status_code, 400)


class LoginAdminViewTest(APITestCase):

    url = reverse("login_admin")

    def setUp(self):
        self.admin = make_user(email="admin@example.com", password="Admin123!")
        self.admin.is_admin = True
        self.admin.save()
        self.buyer = make_user(email="buyer@example.com", password="Buyer123!")

    def test_admin_login_success(self):
        r = self.client.post(self.url, {"email": "admin@example.com", "password": "Admin123!"}, format="json")
        self.assertEqual(r.status_code, 200)
        self.assertIn("token", r.data)

    def test_non_admin_gets_403(self):
        r = self.client.post(self.url, {"email": "buyer@example.com", "password": "Buyer123!"}, format="json")
        self.assertEqual(r.status_code, 403)

    def test_wrong_password_returns_401(self):
        r = self.client.post(self.url, {"email": "admin@example.com", "password": "wrong"}, format="json")
        self.assertEqual(r.status_code, 401)

    def test_missing_fields_returns_400(self):
        r = self.client.post(self.url, {}, format="json")
        self.assertEqual(r.status_code, 400)



# USER VIEWS


class GetUserViewTest(APITestCase):

    def setUp(self):
        self.user = make_user()

    def test_existing_user_returns_200(self):
        r = self.client.get(reverse("get_user", args=[self.user.id]))
        self.assertEqual(r.status_code, 200)

    def test_nonexistent_user_returns_400(self):
        r = self.client.get(reverse("get_user", args=[99999]))
        self.assertEqual(r.status_code, 400)


class GetAdminViewTest(APITestCase):

    def setUp(self):
        self.user = make_user()

    def test_returns_200_with_id_and_email(self):
        r = self.client.get(reverse("get_admin", args=[self.user.id]))
        self.assertEqual(r.status_code, 200)
        self.assertIn("email", r.data)
        self.assertIn("id", r.data)

    def test_nonexistent_user_returns_400(self):
        # get_admin view catches DoesNotExist and returns 400
        r = self.client.get(reverse("get_admin", args=[99999]))
        self.assertEqual(r.status_code, 400)


class CheckEmailViewTest(APITestCase):

    def setUp(self):
        self.user = make_user()
        self.url = reverse("check_email")

    def test_existing_email_exists_true(self):
        r = self.client.get(self.url, {"email": "jane@example.com"})
        self.assertEqual(r.status_code, 200)
        self.assertTrue(r.data["exists"])
        self.assertIsNotNone(r.data["user"])

    def test_nonexistent_email_exists_false(self):
        r = self.client.get(self.url, {"email": "ghost@x.com"})
        self.assertEqual(r.status_code, 200)
        self.assertFalse(r.data["exists"])
        self.assertIsNone(r.data["user"])


class UpdateFirebaseUidViewTest(APITestCase):

    url = reverse("update-firebase")

    def setUp(self):
        self.user = make_user()

    def test_update_success(self):
        r = self.client.patch(self.url, {"email": "jane@example.com", "firebase_uid": "uid123"}, format="json")
        self.assertEqual(r.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.firebase_uid, "uid123")

    def test_missing_email_returns_400(self):
        r = self.client.patch(self.url, {"firebase_uid": "uid123"}, format="json")
        self.assertEqual(r.status_code, 400)

    def test_missing_uid_returns_400(self):
        r = self.client.patch(self.url, {"email": "jane@example.com"}, format="json")
        self.assertEqual(r.status_code, 400)

    def test_user_not_found_returns_404(self):
        r = self.client.patch(self.url, {"email": "no@one.com", "firebase_uid": "uid"}, format="json")
        self.assertEqual(r.status_code, 404)


class DeleteUserViewTest(APITestCase):

    def setUp(self):
        self.user = make_user()

    def test_delete_success(self):
        r = self.client.delete(reverse("delete_user", args=[self.user.id]))
        self.assertEqual(r.status_code, 200)
        self.assertFalse(User.objects.filter(id=self.user.id).exists())

    def test_delete_nonexistent_returns_404(self):
        r = self.client.delete(reverse("delete_user", args=[99999]))
        self.assertEqual(r.status_code, 404)



# VEHICLE VIEWS


class GetUserVehiclesTest(APITestCase):

    def setUp(self):
        self.user = make_user()
        make_vehicle(self.user)
        make_vehicle(self.user, make="Honda", model="Civic")

    def test_returns_user_vehicles(self):
        r = self.client.get(reverse("get_user_vehicles", args=[self.user.id]))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(r.data), 2)

    def test_nonexistent_user_returns_404(self):
        r = self.client.get(reverse("get_user_vehicles", args=[99999]))
        self.assertEqual(r.status_code, 404)


class UpdateVehicleTest(APITestCase):

    def setUp(self):
        self.user = make_user()
        self.vehicle = make_vehicle(self.user)
        self.url = reverse("update_vehicle", args=[self.user.id, self.vehicle.id])

    def test_update_description(self):
        r = self.client.patch(self.url, {"description": "Updated"}, format="json")
        self.assertEqual(r.status_code, 200)
        self.vehicle.refresh_from_db()
        self.assertEqual(self.vehicle.description, "Updated")

    def test_update_price(self):
        r = self.client.patch(self.url, {"price": "999999"}, format="json")
        self.assertEqual(r.status_code, 200)
        self.vehicle.refresh_from_db()
        self.assertEqual(self.vehicle.price, Decimal("999999"))

    def test_update_is_featured(self):
        r = self.client.patch(self.url, {"is_featured": "true"}, format="json")
        self.assertEqual(r.status_code, 200)
        self.vehicle.refresh_from_db()
        self.assertTrue(self.vehicle.is_featured)

    def test_vehicle_not_found_returns_404(self):
        r = self.client.patch(reverse("update_vehicle", args=[self.user.id, 99999]), {"price": "1"}, format="json")
        self.assertEqual(r.status_code, 404)

    def test_user_not_found_returns_404(self):
        r = self.client.patch(reverse("update_vehicle", args=[99999, self.vehicle.id]), {"price": "1"}, format="json")
        self.assertEqual(r.status_code, 404)


class DeleteVehicleTest(APITestCase):

    def setUp(self):
        self.user = make_user()
        self.vehicle = make_vehicle(self.user)

    def test_delete_success(self):
        r = self.client.delete(reverse("delete_vehicle", args=[self.user.id, self.vehicle.id]))
        self.assertEqual(r.status_code, 200)
        self.assertFalse(Vehicle.objects.filter(id=self.vehicle.id).exists())

    def test_nonexistent_vehicle_returns_404(self):
        r = self.client.delete(reverse("delete_vehicle", args=[self.user.id, 99999]))
        self.assertEqual(r.status_code, 404)

    def test_nonexistent_user_returns_404(self):
        r = self.client.delete(reverse("delete_vehicle", args=[99999, self.vehicle.id]))
        self.assertEqual(r.status_code, 404)


class GetAllVehiclesTest(APITestCase):

    url = reverse("get_all_vehicles")

    def setUp(self):
        self.user = make_user()
        make_vehicle(self.user, make="Toyota", price=Decimal("1000000"), year=2018, mileage=50000)
        make_vehicle(self.user, make="BMW", price=Decimal("5000000"), year=2022,
                     mileage=10000, is_featured=True)
        make_vehicle(self.user, make="Honda", fuel_type="Electric",
                     price=Decimal("2000000"), year=2021)

    def test_returns_all_vehicles(self):
        r = self.client.get(self.url)
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["count"], 3)

    def test_filter_by_make(self):
        r = self.client.get(self.url, {"make": "BMW"})
        self.assertEqual(r.data["count"], 1)

    def test_filter_by_price_range(self):
        r = self.client.get(self.url, {"priceMin": "900000", "priceMax": "1100000"})
        self.assertEqual(r.data["count"], 1)

    def test_filter_by_fuel_type(self):
        r = self.client.get(self.url, {"fuelType": "Electric"})
        self.assertEqual(r.data["count"], 1)

    def test_filter_is_featured(self):
        r = self.client.get(self.url, {"is_featured": "true"})
        self.assertEqual(r.data["count"], 1)

    def test_search_by_make(self):
        r = self.client.get(self.url, {"search": "BMW"})
        self.assertEqual(r.data["count"], 1)

    def test_sort_price_asc(self):
        r = self.client.get(self.url, {"sort": "price_asc"})
        prices = [float(v["price"]) for v in r.data["vehicles"]]
        self.assertEqual(prices, sorted(prices))

    def test_sort_price_desc(self):
        r = self.client.get(self.url, {"sort": "price_desc"})
        prices = [float(v["price"]) for v in r.data["vehicles"]]
        self.assertEqual(prices, sorted(prices, reverse=True))

    def test_pagination_structure(self):
        r = self.client.get(self.url, {"page": 1, "limit": 2})
        self.assertIn("total_pages", r.data)
        self.assertIn("has_next", r.data)
        self.assertIn("has_previous", r.data)
        self.assertEqual(len(r.data["vehicles"]), 2)

    def test_invalid_price_min_does_not_crash(self):
        r = self.client.get(self.url, {"priceMin": "not_a_number"})
        self.assertEqual(r.status_code, 200)


class GetFeaturedVehiclesTest(APITestCase):

    url = reverse("featured_vehicles")

    def setUp(self):
        self.user = make_user()
        make_vehicle(self.user)
        make_vehicle(self.user, make="BMW", is_featured=True)
        make_vehicle(self.user, make="Mercedes", is_featured=True)

    def test_only_featured_returned(self):
        r = self.client.get(self.url)
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["count"], 2)

    def test_pagination_fields_present(self):
        r = self.client.get(self.url)
        self.assertIn("total_pages", r.data)
        self.assertIn("has_next", r.data)


class GetVehicleDetailsTest(APITestCase):

    def setUp(self):
        self.user = make_user()
        self.vehicle = make_vehicle(self.user)

    def test_returns_vehicle_by_slug(self):
        r = self.client.get(reverse("get_vehicle_details", args=[self.vehicle.slug]))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["slug"], self.vehicle.slug)

    def test_nonexistent_slug_returns_404(self):
        r = self.client.get(reverse("get_vehicle_details", args=["no-such-slug"]))
        self.assertEqual(r.status_code, 404)



# FAVOURITE VIEWS


class FavouriteVehicleViewTest(APITestCase):

    def setUp(self):
        self.user = make_user()
        self.vehicle = make_vehicle(self.user)

    def test_favourite_creates_record(self):
        r = self.client.post(reverse("favourite_vehicle", args=[self.user.id, self.vehicle.id]))
        self.assertEqual(r.status_code, 201)
        self.assertTrue(FavouritedVehicle.objects.filter(user=self.user, vehicle=self.vehicle).exists())

    def test_duplicate_favourite_returns_200(self):
        FavouritedVehicle.objects.create(user=self.user, vehicle=self.vehicle)
        r = self.client.post(reverse("favourite_vehicle", args=[self.user.id, self.vehicle.id]))
        self.assertEqual(r.status_code, 200)


class UserFavouriteViewTest(APITestCase):

    def setUp(self):
        self.user = make_user()
        self.vehicle = make_vehicle(self.user)
        FavouritedVehicle.objects.create(user=self.user, vehicle=self.vehicle)

    def test_returns_favourites_with_count(self):
        r = self.client.get(reverse("user_favourite", args=[self.user.id]))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["count"], 1)

    def test_nonexistent_user_returns_404(self):
        r = self.client.get(reverse("user_favourite", args=[99999]))
        self.assertEqual(r.status_code, 404)


class UnfavouriteVehicleViewTest(APITestCase):

    def setUp(self):
        self.user = make_user()
        self.vehicle = make_vehicle(self.user)
        FavouritedVehicle.objects.create(user=self.user, vehicle=self.vehicle)

    def test_unfavourite_success(self):
        r = self.client.delete(reverse("unfavourite_vehicle", args=[self.user.id, self.vehicle.id]))
        self.assertEqual(r.status_code, 200)
        self.assertFalse(FavouritedVehicle.objects.filter(user=self.user, vehicle=self.vehicle).exists())

    def test_unfavourite_nonexistent_returns_404(self):
        r = self.client.delete(reverse("unfavourite_vehicle", args=[self.user.id, 99999]))
        self.assertEqual(r.status_code, 404)


class IsFavoritedViewTest(APITestCase):

    def setUp(self):
        self.user = make_user()
        self.vehicle = make_vehicle(self.user)

    def test_is_favorited_true(self):
        FavouritedVehicle.objects.create(user=self.user, vehicle=self.vehicle)
        r = self.client.get(reverse("is_favorited", args=[self.user.id, self.vehicle.id]))
        self.assertTrue(r.data["is_favorited"])

    def test_is_favorited_false(self):
        r = self.client.get(reverse("is_favorited", args=[self.user.id, self.vehicle.id]))
        self.assertFalse(r.data["is_favorited"])



# MPESA PAYMENT VIEWS


class MakePaymentViewTest(APITestCase):

    url = reverse("make_payment")

    def setUp(self):
        self.user = make_user()

    @patch("api.views.mpesa_payment_views.fetch_access_token")
    @patch("api.views.mpesa_payment_views.requests.post")
    def test_successful_payment_creates_record(self, mock_post, mock_token):
        mock_token.return_value = "tok"
        mock_post.return_value.json.return_value = {"CheckoutRequestID": "ws_CO_001"}
        r = self.client.post(self.url, {"phone_number": "0712345678", "user_id": self.user.id}, format="json")
        self.assertEqual(r.status_code, 200)
        self.assertTrue(Payment.objects.filter(transaction_id="ws_CO_001").exists())

    @patch("api.views.mpesa_payment_views.fetch_access_token")
    def test_no_token_returns_500(self, mock_token):
        mock_token.return_value = None
        r = self.client.post(self.url, {"phone_number": "0712345678", "user_id": self.user.id}, format="json")
        self.assertEqual(r.status_code, 500)

    @patch("api.views.mpesa_payment_views.fetch_access_token")
    def test_missing_phone_returns_400(self, mock_token):
        mock_token.return_value = "tok"
        r = self.client.post(self.url, {"user_id": self.user.id}, format="json")
        self.assertEqual(r.status_code, 400)

    @patch("api.views.mpesa_payment_views.fetch_access_token")
    def test_missing_user_id_returns_400(self, mock_token):
        mock_token.return_value = "tok"
        r = self.client.post(self.url, {"phone_number": "0712345678"}, format="json")
        self.assertEqual(r.status_code, 400)

    @patch("api.views.mpesa_payment_views.fetch_access_token")
    def test_nonexistent_user_returns_404(self, mock_token):
        mock_token.return_value = "tok"
        r = self.client.post(self.url, {"phone_number": "0712345678", "user_id": 99999}, format="json")
        self.assertEqual(r.status_code, 404)

    @patch("api.views.mpesa_payment_views.fetch_access_token")
    @patch("api.views.mpesa_payment_views.requests.post")
    def test_missing_checkout_id_returns_500(self, mock_post, mock_token):
        mock_token.return_value = "tok"
        mock_post.return_value.json.return_value = {}
        r = self.client.post(self.url, {"phone_number": "0712345678", "user_id": self.user.id}, format="json")
        self.assertEqual(r.status_code, 500)


class CallbackPaymentViewTest(APITestCase):

    url = reverse("callback_payment")

    def setUp(self):
        self.user = make_user()
        self.payment = Payment.objects.create(
            user=self.user, amount=Decimal("1"), status="Pending",
            payment_method="Mpesa", transaction_id="ws_CO_CB",
        )

    def _payload(self, result_code, txn_id="ws_CO_CB"):
        # Use a timezone-aware datetime string to avoid naive datetime warnings
        return {"Body": {"stkCallback": {
            "ResultCode": result_code,
            "CheckoutRequestID": txn_id,
            "CallbackMetadata": {"Item": [
                {"Name": "Amount", "Value": 500},
                {"Name": "TransactionDate", "Value": 20240101120000},
            ]},
        }}}

    def test_result_code_0_sets_completed(self):
        self.client.post(self.url, self._payload(0), format="json")
        self.payment.refresh_from_db()
        self.assertEqual(self.payment.status, "Completed")

    def test_result_code_0_updates_amount(self):
        self.client.post(self.url, self._payload(0), format="json")
        self.payment.refresh_from_db()
        self.assertEqual(self.payment.amount, 500)

    def test_result_code_1_sets_canceled(self):
        self.client.post(self.url, self._payload(1), format="json")
        self.payment.refresh_from_db()
        self.assertEqual(self.payment.status, "Canceled")

    def test_unknown_transaction_returns_404(self):
        r = self.client.post(self.url, self._payload(0, txn_id="UNKNOWN"), format="json")
        self.assertEqual(r.status_code, 404)

    def test_response_contains_message(self):
        r = self.client.post(self.url, self._payload(0), format="json")
        self.assertIn("message", r.data)


class PaymentStatusViewTest(APITestCase):

    url = reverse("payment_status")

    def setUp(self):
        self.user = make_user()
        self.payment = Payment.objects.create(
            user=self.user, amount=Decimal("250"), status="Completed",
            payment_method="Mpesa", transaction_id="TXN_S001",
        )

    def test_valid_transaction_returns_200(self):
        r = self.client.post(self.url, {"transaction_id": "TXN_S001"}, format="json")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["status"], "Completed")
        self.assertEqual(r.data["currency"], "KES")
        self.assertEqual(r.data["transaction_id"], "TXN_S001")
        self.assertIn("payment_date", r.data)

    def test_missing_transaction_id_returns_400(self):
        r = self.client.post(self.url, {}, format="json")
        self.assertEqual(r.status_code, 400)

    def test_nonexistent_transaction_returns_404(self):
        r = self.client.post(self.url, {"transaction_id": "NOPE"}, format="json")
        self.assertEqual(r.status_code, 404)



# FETCH ACCESS TOKEN


class FetchAccessTokenTest(TestCase):

    @patch("api.views.mpesa_payment_views.requests.get")
    def test_returns_token_on_200(self, mock_get):
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {"access_token": "abc"}
        from .views.mpesa_payment_views import fetch_access_token
        self.assertEqual(fetch_access_token(), "abc")

    @patch("api.views.mpesa_payment_views.requests.get")
    def test_returns_none_on_non_200(self, mock_get):
        mock_get.return_value.status_code = 401
        from .views.mpesa_payment_views import fetch_access_token
        self.assertIsNone(fetch_access_token())

    @patch("api.views.mpesa_payment_views.requests.get")
    def test_returns_none_on_network_error(self, mock_get):
        import requests as req
        mock_get.side_effect = req.exceptions.RequestException("down")
        from .views.mpesa_payment_views import fetch_access_token
        self.assertIsNone(fetch_access_token())

    @patch("api.views.mpesa_payment_views.requests.get")
    def test_returns_none_on_bad_json(self, mock_get):
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.side_effect = ValueError("bad json")
        mock_get.return_value.text = "not json"
        from .views.mpesa_payment_views import fetch_access_token
        self.assertIsNone(fetch_access_token())




class VehicleFilterHelperTest(TestCase):

    def setUp(self):
        self.user = make_user()
        make_vehicle(self.user, make="Toyota", price=Decimal("1000000"), year=2018, mileage=50000)
        make_vehicle(self.user, make="BMW", price=Decimal("5000000"), year=2022,
                     mileage=10000, fuel_type="Diesel", transmission="Manual",
                     body_type="SUV", color="Black", condition="Used")

    def _qs(self):
        return Vehicle.objects.all()

    def test_filter_make(self):
        from .views.vehicle_views import _apply_vehicle_filters
        self.assertEqual(_apply_vehicle_filters(self._qs(), {"make": "BMW"}).count(), 1)

    def test_filter_price_min(self):
        from .views.vehicle_views import _apply_vehicle_filters
        self.assertEqual(_apply_vehicle_filters(self._qs(), {"priceMin": "2000000"}).count(), 1)

    def test_filter_price_max(self):
        from .views.vehicle_views import _apply_vehicle_filters
        self.assertEqual(_apply_vehicle_filters(self._qs(), {"priceMax": "1100000"}).count(), 1)

    def test_filter_year_min(self):
        from .views.vehicle_views import _apply_vehicle_filters
        self.assertEqual(_apply_vehicle_filters(self._qs(), {"yearMin": "2020"}).count(), 1)

    def test_filter_year_max(self):
        from .views.vehicle_views import _apply_vehicle_filters
        self.assertEqual(_apply_vehicle_filters(self._qs(), {"yearMax": "2019"}).count(), 1)

    def test_filter_mileage_max(self):
        from .views.vehicle_views import _apply_vehicle_filters
        self.assertEqual(_apply_vehicle_filters(self._qs(), {"mileageMax": "20000"}).count(), 1)

    def test_filter_fuel_type(self):
        from .views.vehicle_views import _apply_vehicle_filters
        self.assertEqual(_apply_vehicle_filters(self._qs(), {"fuelType": "Diesel"}).count(), 1)

    def test_filter_transmission(self):
        from .views.vehicle_views import _apply_vehicle_filters
        self.assertEqual(_apply_vehicle_filters(self._qs(), {"transmission": "Manual"}).count(), 1)

    def test_filter_body_type(self):
        from .views.vehicle_views import _apply_vehicle_filters
        self.assertEqual(_apply_vehicle_filters(self._qs(), {"bodyType": "SUV"}).count(), 1)

    def test_filter_color(self):
        from .views.vehicle_views import _apply_vehicle_filters
        self.assertEqual(_apply_vehicle_filters(self._qs(), {"color": "Black"}).count(), 1)

    def test_filter_search(self):
        from .views.vehicle_views import _apply_vehicle_filters
        self.assertEqual(_apply_vehicle_filters(self._qs(), {"search": "BMW"}).count(), 1)

    def test_invalid_price_min_ignored(self):
        from .views.vehicle_views import _apply_vehicle_filters
        # Should not crash; returns all records unfiltered
        self.assertEqual(_apply_vehicle_filters(self._qs(), {"priceMin": "abc"}).count(), 2)


class VehicleSortHelperTest(TestCase):

    def setUp(self):
        self.user = make_user()
        make_vehicle(self.user, price=Decimal("1000000"), year=2018)
        make_vehicle(self.user, make="BMW", price=Decimal("5000000"), year=2022)

    def _qs(self):
        return Vehicle.objects.all()

    def test_sort_price_asc(self):
        from .views.vehicle_views import _apply_vehicle_sort
        prices = list(_apply_vehicle_sort(self._qs(), "price_asc").values_list("price", flat=True))
        self.assertEqual(prices, sorted(prices))

    def test_sort_price_desc(self):
        from .views.vehicle_views import _apply_vehicle_sort
        prices = list(_apply_vehicle_sort(self._qs(), "price_desc").values_list("price", flat=True))
        self.assertEqual(prices, sorted(prices, reverse=True))

    def test_sort_year_desc(self):
        from .views.vehicle_views import _apply_vehicle_sort
        years = list(_apply_vehicle_sort(self._qs(), "year_desc").values_list("year", flat=True))
        self.assertEqual(years, sorted(years, reverse=True))

    def test_sort_newest(self):
        from .views.vehicle_views import _apply_vehicle_sort
        result = _apply_vehicle_sort(self._qs(), "newest")
        self.assertIsNotNone(result)


class VehiclePaginationHelperTest(TestCase):

    def setUp(self):
        self.user = make_user()
        for i in range(5):
            make_vehicle(self.user, make=f"Make{i}", model=f"Model{i}")

    def test_first_page(self):
        from .views.vehicle_views import _paginate_vehicles
        page, limit, total, qs = _paginate_vehicles(Vehicle.objects.all(), {"page": "1", "limit": "2"})
        self.assertEqual(page, 1)
        self.assertEqual(limit, 2)
        self.assertEqual(total, 5)
        self.assertEqual(len(list(qs)), 2)

    def test_last_page(self):
        from .views.vehicle_views import _paginate_vehicles
        _, _, _, qs = _paginate_vehicles(Vehicle.objects.all(), {"page": "3", "limit": "2"})
        self.assertEqual(len(list(qs)), 1)

    def test_invalid_page_defaults_to_1(self):
        from .views.vehicle_views import _paginate_vehicles
        page, _, _, _ = _paginate_vehicles(Vehicle.objects.all(), {"page": "abc"})
        self.assertEqual(page, 1)

    def test_limit_capped_at_100(self):
        from .views.vehicle_views import _paginate_vehicles
        _, limit, _, _ = _paginate_vehicles(Vehicle.objects.all(), {"limit": "999"})
        self.assertEqual(limit, 100)


class ParseBoolHelperTest(TestCase):

    def test_true_values(self):
        from .views.vehicle_views import parse_bool
        for v in [True, "true", "1", "yes"]:
            self.assertTrue(parse_bool(v), msg=f"Expected True for {v!r}")

    def test_false_values(self):
        from .views.vehicle_views import parse_bool
        for v in [False, "false", "0", "no", None]:
            self.assertFalse(parse_bool(v), msg=f"Expected False for {v!r}")