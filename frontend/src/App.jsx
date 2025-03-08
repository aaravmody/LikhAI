import { useState,useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './components/LandingPage';
import ButtonComp from './components/Button';
import Navigation from './components/NavigationMenu';
import Login from './components/Login';
import { ToastContainer } from "react-toastify";
import Signup from './components/SignupPage';
import { auth } from '../firebase-config';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import CreateProject from './components/CreateProject';
//import './App.css'


function App() {

  useEffect(() => {
    signInAnonymously(auth);
    onAuthStateChanged(auth, (user) => {
      console.log(user)
      if (user) {
        console.log('User signed in:', user.uid);
      }
    });
  }, []);

  return (
    <>
      <ToastContainer autoClose={700} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/button" element={<ButtonComp />} />
          <Route path="/navigation-menu" element={<Navigation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create-project" element={<CreateProject />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
