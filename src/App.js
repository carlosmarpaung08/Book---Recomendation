import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookSearch from "./components/BookSearch";
import BookDetail from "./components/BookDetail";
import LoginPage from "./components/LoginPage"; // Import LoginPage
import RegisterPage from "./components/RegisterPage"; // Import RegisterPage

function App() {
  return (
    <Router>
      <Routes>
        {/* Existing Routes */}
        <Route path="/" element={<BookSearch />} />
        <Route path="/book/:id" element={<BookDetail />} />

        {/* New Routes for Login and Register */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
