import random
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from api.models import User, Vehicle, VehicleImage, FavouritedVehicle


class Command(BaseCommand):
    help = "Seed the database with sample users, vehicles, images, and favourites"
    User.objects.all().delete()
    Vehicle.objects.all().delete()
    VehicleImage.objects.all().delete()
    FavouritedVehicle.objects.all().delete()

    # ---------- HELPERS ----------
    def create_users(self): 
        users = [] 

        data = [ 
            { 
                "first_name": "Samuel", 
                "last_name": "Ngugi", 
                "email": "samuel@example.com", 
                "password": "password123", 
                "role": "Seller", 
                "is_admin": True, 
            }, 
            { 
                "first_name": "James", 
                "last_name": "Karanja", 
                "email": "james@example.com", 
                "password": "password123", 
                "role": "Seller", 
            }, 
            { 
                "first_name": "Jane", 
                "last_name": "Doe", 
                "email": "jane@example.com", 
                "password": "password123", 
                "role": "Buyer", 
            }, 
        ] 

        for item in data: 
            user, created = User.objects.get_or_create(
                email=item["email"], 
                defaults=item
            ) 
            users.append(user) 

        print(f"✅ Created {len(users)} users") 
        return users


    def create_vehicles(self, users):
        vehicles = []

        makes = [
            ("Toyota", "Corolla"),
            ("Mazda", "CX-5"),
            ("Subaru", "Forester"),
            ("BMW", "X5"),
            ("Mercedes", "C200"),
        ]

        defaults = {
            "year": 2020,
            "fuel_type": "Petrol",
            "transmission": "Automatic",
            "body_type": "SUV",
            "price": Decimal("15000.00"),
            "description": "A well-maintained vehicle.",
            "region": "Nairobi, Kenya",
            "mileage": 50000,
            "condition": "Used",
            "color": "Black",
            "features": ["Air Conditioning", "GPS", "Bluetooth"],
            "contact_name": "Motoket Dealer",
            "contact_phone": "+254700000000",
            "contact_email": "dealer@motoket.com",
        }

        for make, model in makes:
            for user in users:
                slug = slugify(f"{defaults['year']}-{make}-{model}-{defaults['color']}-{defaults['region']}-{user.id}-{random.randint(1,9999)}")
                
                vehicle, created = Vehicle.objects.get_or_create(
                    slug=slug,
                    defaults={
                        "make": make,
                        "model": model,
                        "user": user,
                        **defaults,
                        "slug": slug
                    }
                )
                vehicles.append(vehicle)

        self.stdout.write(self.style.SUCCESS(f"✅ Created {len(vehicles)} vehicles"))
        return vehicles

    def create_vehicle_images(self, vehicles):
        placeholder_url = "https://res.cloudinary.com/dxwzdftzm/image/upload/v1767445714/vehicles/1/lylrasrgwnlxkuwpip5h.jpg"  

        for vehicle in vehicles:
            VehicleImage.objects.get_or_create(
                vehicle=vehicle,
                image=placeholder_url
            )

        self.stdout.write(self.style.SUCCESS("✅ Created placeholder vehicle images"))

    def create_favourites(self, users, vehicles):
        for user in users:
            favs = random.sample(vehicles, k=min(2, len(vehicles)))
            for vehicle in favs:
                FavouritedVehicle.objects.get_or_create(
                    user=user,
                    vehicle=vehicle
                )

        self.stdout.write(self.style.SUCCESS("✅ Created favourites"))

    # ---------- COMMAND ENTRY ----------
    def handle(self, *args, **kwargs):
        self.stdout.write("🌱 Seeding database...")
        users = self.create_users()
        vehicles = self.create_vehicles(users)
        self.create_vehicle_images(vehicles)
        self.create_favourites(users, vehicles)
        self.stdout.write(self.style.SUCCESS("🎉 Seeding complete!"))
