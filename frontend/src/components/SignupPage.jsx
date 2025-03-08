import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth0 } from "@auth0/auth0-react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidPhone = /^[0-9]{10}$/;

  const handleSignup = () => {
    if (!isValidEmail.test(email)) {
      setErrorMessage("Please enter a valid email.");
      return;
    }
    if (!isValidPhone.test(phone)) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setErrorMessage("You must agree to the Terms & Conditions.");
      return;
    }

    setErrorMessage("");
    toast.success("Signup Successful!", { autoClose: 2000 });
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>

        <input
          type="text"
          className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm">
            I agree to the{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Terms & Conditions
            </a>
          </label>
        </div>

        <button
          className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
          onClick={handleSignup}
        >
          Sign Up
        </button>

        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}

        <div className="relative flex justify-center items-center my-4">
          <span className="absolute bg-white px-2 text-gray-500">OR</span>
          <div className="w-full h-px bg-gray-300"></div>
        </div>

        <button
          className="w-full flex items-center justify-center border border-gray-300 p-2 rounded-md shadow-sm bg-white hover:bg-gray-100 transition duration-200"
          onClick={() => loginWithRedirect()}
        >
          <span className="text-gray-700 font-medium">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Signup;
