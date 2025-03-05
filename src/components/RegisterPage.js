import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const RegisterPage = () => {
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",  // New state for password confirmation
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (registerData.password !== registerData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        registerData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        console.log("Registration successful", response.data);
        setErrorMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        if (error.response.data.username) {
          setErrorMessage("Username already exists");
        } else if (error.response.data.email) {
          setErrorMessage("Email already exists");
        } else {
          setErrorMessage(error.response.data.error || "Registration failed. Please try again.");
        }
      } else if (error.request) {
        setErrorMessage("Cannot connect to server. Please try again later.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="page-container">
      <div className="header">
        <button className="back-button" onClick={handleBack}>← Back</button>
        <h1 className="title">Create Account</h1>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          {errorMessage && (
            <div className={`message-container ${errorMessage.includes("successful") ? "success" : "error"}`}>
              <p className="message">{errorMessage}</p>
            </div>
          )}
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                required
                minLength={3}
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
                minLength={6}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="submit-button">Register</button>
          </form>
          <p className="auth-switch">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login here</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
