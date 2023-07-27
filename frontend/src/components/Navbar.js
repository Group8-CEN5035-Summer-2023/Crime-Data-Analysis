import React from "react";
import { Link } from "react-router-dom";

import "../styles/Navbar.css";

import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = () => {
  const logout = () => {
    signOut(auth);
  };

  return (
    <nav>
      <ul className="NavList">
        {/* <li>
          <Link className="NavLink" to="/">
            Home
          </Link>
        </li> */}
        <li>
          <Link className="NavLink" to="/crime-trends">
            Crime Trends
          </Link>
        </li>
        <li>
          <Link className="NavLink" to="/distribution">
            Crime Distribution
          </Link>
        </li>
        <li>
          <Link className="NavLink" to="/analysis">
            Analysis
          </Link>
        </li>
        <li>
          <button
            className="LogoutButton"
            onClick={() => {
              logout();
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
