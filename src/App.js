import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookSearch from "./components/BookSearch";
import BookDetail from "./components/BookDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookSearch />} />
        <Route path="/book/:id" element={<BookDetail />} />
      </Routes>
    </Router>
  );
}

export default App;