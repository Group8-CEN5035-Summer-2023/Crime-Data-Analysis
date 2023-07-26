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
        <li>
          <Link className="NavLink" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="NavLink" to="/population">
            Population
          </Link>
        </li>
        <li>
          <Link className="NavLink" to="/aggregate">
            Aggregate
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
