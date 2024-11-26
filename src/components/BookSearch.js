import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Tambahkan untuk navigasi
import axios from "axios";
import "./BookSearch.css";

const BookSearch = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [imageLoaded, setImageLoaded] = useState({});

  const navigate = useNavigate(); // Untuk navigasi ke halaman detail
  const maxResults = 40;

  const searchBooks = async (index = 0) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://f75e-103-121-146-143.ngrok-free.app/api/search/?q=${query}&startIndex=${index}&maxResults=${maxResults}`
      );

      const fetchedBooks = response.data;

      setBooks(fetchedBooks);

      // Reset state loading gambar
      const initialImageState = fetchedBooks.reduce((acc, _, i) => {
        acc[i] = false;
        return acc;
      }, {});
      setImageLoaded(initialImageState);

      setHasMore(fetchedBooks.length === maxResults);

      setStartIndex(index);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setStartIndex(0);
    searchBooks(0);
  };

  const handleNext = () => {
    if (hasMore) {
      const nextIndex = startIndex + maxResults;
      searchBooks(nextIndex);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      const prevIndex = Math.max(0, startIndex - maxResults);
      searchBooks(prevIndex);
    }
  };

  const handleImageLoad = (index) => {
    setImageLoaded((prevState) => ({ ...prevState, [index]: true }));
  };

  const handleViewDetails = (book) => {
    navigate(`/book/${book.id}`, { state: { book, query, startIndex } });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "No description available.";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="book-search-container">
      <h1 className="title">Mau Baca Apa Lu?</h1>
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, or category"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
      <div className="book-grid-container">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading...</p>
          </div>
        )}
        <div className="book-grid">
          {books.length > 0 ? (
            books.map((book, index) => (
              <div className="book-card-small" key={index}>
                <div className="book-thumbnail-wrapper">
                  {!imageLoaded[index] && (
                    <div className="image-placeholder">Loading Image...</div>
                  )}
                  <img
                    src={
                      book.thumbnail || "https://via.placeholder.com/100x150"
                    }
                    alt={book.title}
                    className={`book-thumbnail-small ${
                      imageLoaded[index] ? "visible" : "hidden"
                    }`}
                    onLoad={() => handleImageLoad(index)}
                  />
                </div>
                <div className="book-info-small">
                  <h4 className="book-title-small">
                    {truncateText(book.title, 30)}
                  </h4>
                  <p className="book-author-small">
                    {truncateText(book.author || "Unknown Author", 20)}
                  </p>
                  <button
                    className="preview-link-small"
                    onClick={() => handleViewDetails(book)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">
              No books found. Try searching for something else!
            </p>
          )}
        </div>
      </div>
      <div className="pagination-controls">
        <button
          onClick={handlePrev}
          className="pagination-button"
          disabled={startIndex === 0 || isLoading}
        >
          Prev
        </button>
        <button
          onClick={handleNext}
          className="pagination-button"
          disabled={!hasMore || isLoading}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookSearch;
