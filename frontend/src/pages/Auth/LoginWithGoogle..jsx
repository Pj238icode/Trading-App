import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { loginWithGoogle } from "@/Redux/Auth/Action";

const LoginWithGoogle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        throw new Error("No credential received from Google");
      }

      // Dispatch Redux action with Google token
      dispatch(loginWithGoogle(credentialResponse.credential, navigate));
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  const handleGoogleFailure = (err) => {
    setError("Google login failed");
    console.error(err);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleFailure}
        useOneTap={false}
      >
        <Button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200">
          <FcGoogle size={24} />
          Sign in with Google
        </Button>
      </GoogleLogin>
      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
};

export default LoginWithGoogle;
