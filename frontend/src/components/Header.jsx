import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authHeader = axios.defaults.headers.common["Authorization"];
    if (!authHeader) {
      setIsLoggedIn(false);
      return;
    }

    const token = authHeader.split(" ")[1];
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gray-900 text-white shadow-md">
      <h1 className="text-2xl font-bold">Copilot</h1>
      <ul className="flex space-x-6">
        <li>
          <Link to="/" className="hover:text-gray-400">
            Home
          </Link>
        </li>
        <li>
          <Link to="/features" className="hover:text-gray-400">
            Features
          </Link>
        </li>
      </ul>

      {isLoggedIn ? (
        <Link to="/profile">
          <FaUserCircle className="text-2xl cursor-pointer hover:text-gray-400" />
        </Link>
      ) : (
        <Link to="/login">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Login
          </button>
        </Link>
      )}
    </nav>
  );
}

export default Header;
