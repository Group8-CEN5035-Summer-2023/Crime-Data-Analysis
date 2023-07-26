import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AggregatePage from "./pages/AggregatePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Population from "./pages/Population";

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
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/population" element={<Population />} />
              <Route path="/aggregate" element={<AggregatePage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        )}
      </Router>
    </div>
  );
};

export default App;
