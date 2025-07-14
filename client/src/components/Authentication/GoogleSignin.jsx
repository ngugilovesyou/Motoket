import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; 

const GoogleSignIn = ({ onGoogleSuccess }) => {
  const handleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);

    const userData = {
      email: decoded.email,
      first_name: decoded.given_name,
      last_name: decoded.family_name,
    };

    // Instead of navigating or POSTing here, just send the data back up
    onGoogleSuccess(userData);
  };

  return (
    <div className="my-4">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.error("Login failed")}
      />
    </div>
  );
};

export default GoogleSignIn;