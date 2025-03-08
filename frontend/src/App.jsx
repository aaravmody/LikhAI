import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './components/LandingPage';
import ButtonComp from './components/Button';
import Navigation from './components/NavigationMenu';
import Login from './components/Login';
import { ToastContainer } from "react-toastify";
import Signup from './components/SignupPage';
//import './App.css'


function App() {

  return (
    <>
      <ToastContainer autoClose={700} />
      <BrowserRouter>
        <Routes>
          <Route path="/landing-page" element={<LandingPage />} />
          <Route path="/button" element={<ButtonComp />} />
          <Route path="/navigation-menu" element={<Navigation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
