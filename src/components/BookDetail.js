import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookDetail.css";

const BookDetail = () => {
  const location = useLocation(); // Mengambil data buku dari state
  const navigate = useNavigate();
  const { book, query, startIndex } = location.state || {}; // Data buku yang diterima
  const [isFavorite, setIsFavorite] = useState(false);

  if (!book) {
    return <p>Book details not available.</p>;
  }

  const handleBack = () => {
    if (query !== undefined && startIndex !== undefined) {
      navigate("/", { state: { query, startIndex } });
    } else {
      navigate(-1);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="book-detail-container">
      <div className="book-detail-header">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>
        <h1 className="page-title">Book Details</h1>
      </div>
      <div className="book-detail-main">
        <div className="book-thumbnail-section">
          <img
            src={book.thumbnail || "https://via.placeholder.com/200x300"}
            alt={book.title}
            className="book-detail-thumbnail"
          />
          <div className="book-status">
            <span className="status-label">Status:</span>{" "}
            <span className="status-value">
              {book.status || "Not Available"}
            </span>
          </div>
          <button
            className="read-button"
            onClick={() => window.open(book.preview_link, "_blank")}
          >
            Read on Google Books
          </button>
        </div>
        <div className="book-detail-info">
          <h2 className="book-title">{book.title}</h2>
          <p className="book-author">
            <span>Author:</span> {book.author || "Unknown Author"}
          </p>
          <p className="book-description">
            {book.description || "No description available for this book."}
          </p>
          <p className="book-category">
            <span>Category:</span> {book.categories || "Not Categorized"}
          </p>
          <p className="book-published">
            <span>Published:</span> {book.publishedDate || "Unknown"}
          </p>
          <button 
            className={`favorite-button ${isFavorite ? 'favorited' : ''}`} 
            onClick={toggleFavorite}
          >
            {isFavorite ? '★ Added to Favorites' : '☆ Add to Favorites'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
