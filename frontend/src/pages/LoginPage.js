import { useState } from "react";

import "../styles/LoginPage.css";

import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    signInWithEmailAndPassword(auth, email, password).catch((err) => {
      console.log({ err });
      if (
        err.code === "auth/missing-password" ||
        err.code === "auth/wrong-password"
      )
        alert("Invalid email or password!");
    });
  };

  return (
    <div className="Login">
      <h2>LOGIN</h2>
      <div style={{ height: "30px" }}></div>
      <table
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <tbody>
          <tr>
            <td align="left">Enter email</td>
            <td>
              <input
                className="TextField"
                type="email"
                value={email}
                onChange={(val) => {
                  const text = val.target.value.trim();
                  setEmail(text);
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Enter password</td>
            <td>
              <input
                className="TextField"
                type="password"
                value={password}
                onChange={(val) => {
                  const text = val.target.value.trim();
                  setPassword(text);
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="LoginButton">
        <button
          onClick={() => {
            login();
          }}
        >
          Login
        </button>
      </div>

      <b
        className="RegisterMsg"
        onClick={() => {
          navigate("/forgot-password");
        }}
      >
        Forgot Password
      </b>
      <b
        className="RegisterMsg"
        onClick={() => {
          navigate("/register");
        }}
      >
        New here? Register
      </b>
    </div>
  );
};

export default LoginPage;
