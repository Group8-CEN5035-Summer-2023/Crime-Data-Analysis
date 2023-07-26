import { useState } from "react";

import "../styles/ForgotPassword.css";

import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const resetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setEmailSent(true);
      })
      .catch((err) => {
        console.log({ err });

        if (
          err.code === "auth/invalid-email" ||
          err.code === "auth/user-not-found"
        )
          alert("Invalid email or user not found!");
      });
  };

  return (
    <div className="ForgotPassword">
      <h2>FORGOT PASSWORD</h2>
      <div style={{ height: "30px" }}></div>
      {emailSent ? (
        <>
          <div style={{ fontSize: "20px", marginBottom: "30px" }}>
            A reset email has been sent to <b>{email}</b>
          </div>
        </>
      ) : (
        <>
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
            </tbody>
          </table>

          <div className="ResetPassword">
            <button
              onClick={() => {
                resetPassword();
              }}
            >
              Reset Password
            </button>
          </div>
        </>
      )}

      <b
        className="LoginMessage"
        onClick={() => {
          navigate("/login");
        }}
      >
        Go back and Login
      </b>
    </div>
  );
};

export default LoginPage;
