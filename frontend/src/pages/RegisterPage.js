import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterPage.css";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const registerUser = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        console.log({ cred });
      })
      .catch((err) => {
        console.log({ err });
        if (err.code === "auth/email-already-in-use") {
          alert("Account with this email already exists!");
        }
      });
  };

  return (
    <div className="Register">
      <h2>REGISTER</h2>
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
            <td align="left">Enter password</td>
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
          <tr>
            <td>Confirm password</td>
            <td>
              <input className="TextField" type="password" />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="RegisterButton">
        <button
          onClick={() => {
            registerUser();
          }}
        >
          Register
        </button>
      </div>

      <b
        className="LoginMsg"
        onClick={() => {
          navigate("/login");
        }}
      >
        Already have an account? Login
      </b>
    </div>
  );
};

export default RegisterPage;
