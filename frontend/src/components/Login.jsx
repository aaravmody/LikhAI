import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpSent, setOtpSent] = useState(false);
  const [useOtp, setUseOtp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async () => {
    if (!useOtp) {
      if (!isValidEmail.test(email)) {
        setErrorMessage("Please enter a valid email.");
        return;
      }
      if (!password) {
        setErrorMessage("Please enter your password.");
        return;
      }

      try {
        const response = await axios.post("http://localhost:3000/api/v1/login-with-password", {
          email,
          password,
        });

        console.log(response.data.token)

        localStorage.setItem("authToken", response.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

        toast.success("Logged in successfully!");
        navigate("/");
      } catch (error) {
        console.log(error)
        setErrorMessage(error.response?.data?.message || "Login failed.");
      }
    } else {
      if (isValidEmail.test(email)) {
        try {
          await axios.post("http://localhost:3000/api/v1/login-with-otp", { email });
          setOtpSent(true);
          toast.info("OTP sent successfully!");
        } catch (error) {
          setErrorMessage(error.response?.data?.message || "Failed to send OTP.");
        }
      } else {
        setErrorMessage("Please enter a valid email.");
      }
    }
  };


  const verifyOtp = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length === 6) {
      try {
        const response = await axios.post("http://localhost:3000/api/v1/verify-otp", {
          email,
          otp: enteredOtp,
        });

        // Get token from response headers
        const token = response.headers["authorization"] || response.headers["Authorization"];

        console.log(token)

        if (token) {
          localStorage.setItem("authToken", token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

        toast.success("OTP Verified Successfully!");
        navigate("/");
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Invalid OTP. Please try again.");
      }
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Login</h2>
        <div className="flex justify-center mb-4">
          <button className={`mr-2 px-4 py-2 rounded-lg ${useOtp ? "bg-gray-300" : "bg-blue-500 text-white"}`} onClick={() => { setUseOtp(false); setOtpSent(false); }}>
            Password
          </button>
          <button className={`px-4 py-2 rounded-lg ${useOtp ? "bg-blue-500 text-white" : "bg-gray-300"}`} onClick={() => setUseOtp(true)}>
            OTP
          </button>
        </div>
        {!otpSent ? (
          <div>
            <input type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {useOtp ? (
              <button className="w-full mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600" onClick={handleLogin}>Send OTP</button>
            ) : (
              <div>
                <input type="password" className="w-full mt-4 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="w-full mt-4 bg-green-500 text-white p-2 rounded-lg hover:bg-green-600" onClick={handleLogin}>Login</button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input key={index} type="text" maxLength="1" ref={(el) => (inputRefs.current[index] = el)} className="w-10 h-10 text-center border rounded-lg focus:ring-2 focus:ring-blue-500" value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} />
              ))}
            </div>
            <button className="w-full mt-4 bg-green-500 text-white p-2 rounded-lg hover:bg-green-600" onClick={verifyOtp}>Verify OTP</button>
          </div>
        )}
        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
      </motion.div>
    </div>
  );
};

export default Login;