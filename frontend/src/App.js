import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import DistributionPage from "./pages/DistributionPage";
import Analysis from "./pages/Analysis";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import CrimeTrends from "./pages/CrimeTrends";

import "./App.css";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
      },
      (err) => {
        console.log({ err });
      }
    );
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Router>
        {user ? (
          <>
            <h2>Crime Data Analysis</h2>
            <Navbar />
            <hr style={{ width: "max(60vw, 600px)" }} />
            <Routes>
              {/* <Route path="/" Crimeelement={<HomePage />} /> */}
              <Route path="/crime-trends" element={<CrimeTrends />} />
              <Route path="/distribution" element={<DistributionPage />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="*" element={<Navigate to="/crime-trends" />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </Router>
    </div>
  );
};

export default App;
