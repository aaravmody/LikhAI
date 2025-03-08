import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [inputValue, setInputValue] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const [useOtp, setUseOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const inputRefs = useRef([]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidPhone = /^[0-9]{10}$/;

  const handleLogin = () => {
    if (!useOtp) {
      if (!isValidEmail.test(inputValue)) {
        setErrorMessage("Please enter a valid email.");
        return;
      }
      if (!password) {
        setErrorMessage("Please enter your password.");
        return;
      }
      toast.success("Logged in successfully!");
      navigate("/button");
    } else {
      if (isValidEmail.test(inputValue) || isValidPhone.test(inputValue)) {
        setOtpSent(true);
        setErrorMessage("");
        toast.info("OTP sent successfully!");
      } else {
        setErrorMessage("Please enter a valid email or phone number.");
      }
    }
  };

  const verifyOtp = () => {
    if (otp.join("").length === 6) {
      toast.success("OTP Verified Successfully!");
      navigate("/button");
    } else {
      setErrorMessage("Invalid OTP. Please try again.");
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      let newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <div className="flex justify-center mb-4">
          <button
            className={`mr-2 px-4 py-2 rounded-md ${useOtp ? "bg-gray-300" : "bg-blue-500 text-white"}`}
            onClick={() => {
              setUseOtp(false);
              setOtpSent(false);
              setErrorMessage("");
            }}
          >
            Login via Password
          </button>
          <button
            className={`px-4 py-2 rounded-md ${useOtp ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            onClick={() => {
              setUseOtp(true);
              setErrorMessage("");
            }}
          >
            Login via OTP
          </button>
        </div>

        {!otpSent ? (
          <div>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Email or Phone"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {useOtp ? (
              <button
                className="w-full mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                onClick={handleLogin}
              >
                Send OTP
              </button>
            ) : (
              <div>
                <input
                  type="password"
                  className="w-full mt-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="w-full mt-4 bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-between">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-10 h-10 text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                />
              ))}
            </div>
            <button
              className="w-full mt-4 bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
              onClick={verifyOtp}
            >
              Login
            </button>
          </div>
        )}
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Login;