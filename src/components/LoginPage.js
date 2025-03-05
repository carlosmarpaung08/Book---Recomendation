import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        loginData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data.access) {
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
  
        // Menyimpan nama pengguna di localStorage
        const userName = response.data.user.username; // Pastikan nama pengguna ada di response
        localStorage.setItem("userName", userName);
  
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        console.log("Login successful", response.data);
        navigate("/"); // Pindahkan ke halaman utama
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        setErrorMessage(error.response.data.error || "Login failed. Please try again.");
      } else if (error.request) {
        setErrorMessage("Cannot connect to server. Please try again later.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  const handleBack = () => {
    navigate(-1); // This will take the user back to the previous page
  };

  return (
    <div className="page-container">
      <div className="header">
        <button className="back-button" onClick={handleBack}>← Back</button>
        <h1 className="title">Welcome Back!</h1>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          {errorMessage && (
            <div className="error-message-container">
              <p className="error-message">{errorMessage}</p>
            </div>
          )}
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="PasswFord"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="submit-button">Login</button>
          </form>
          <p className="auth-switch">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>Register here</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
