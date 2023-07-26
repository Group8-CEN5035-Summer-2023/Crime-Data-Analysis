import React from "react";
import { Link } from "react-router-dom";

import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = () => {
  const logout = () => {
    signOut(auth);
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/population">Population</Link>
        </li>
        <li>
          <Link to="/aggregate">Aggregate</Link>
        </li>
        <li>
          <button
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
