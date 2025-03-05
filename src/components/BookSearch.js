import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookSearch.css";

const BookSearch = () => {
  const [query, setQuery] = useState(""); // Input pencarian dari pengguna
  const [books, setBooks] = useState([]); // Buku yang ditemukan dari pencarian
  const [recommendedBooks, setRecommendedBooks] = useState([]); // Buku rekomendasi dari model
  const [startIndex, setStartIndex] = useState(0); // Indeks untuk pagination
  const [isLoading, setIsLoading] = useState(false); // Status loading untuk semua proses
  const [isLoadingPopular, setIsLoadingPopular] = useState(false); // Indikator loading untuk Popular Books
  const [hasMore, setHasMore] = useState(true); // Apakah ada lebih banyak buku untuk dimuat
  const [imageLoaded, setImageLoaded] = useState({}); // Mengelola status gambar yang telah dimuat
  const [hasSearched, setHasSearched] = useState(false); // Menandakan apakah pencarian sudah dilakukan
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Status login pengguna
  const [userName, setUserName] = useState(""); // Nama pengguna
  const [showDropdown, setShowDropdown] = useState(false); // State untuk dropdown menu
  const dropdownRef = useRef(null); // Referensi untuk dropdown menu

  const navigate = useNavigate();
  const maxResults = 40;

  // Mengecek apakah pengguna sudah login ketika pertama kali membuka halaman
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Ambil nama pengguna dari local storage (atau bisa disesuaikan dari API)
      setUserName(localStorage.getItem("userName"));
    }
  }, []);

  // Effect untuk menutup dropdown ketika user mengklik di luar dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Fungsi untuk mencari buku dari Google Books API
  const searchBooks = async (index = 0) => {
    if (isLoading) return;

    setIsLoading(true); // Set loading indikator ke true
    setImageLoaded({});
    console.log("Fetching books...");

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/search/?q=${query}&startIndex=${index}&maxResults=${maxResults}`
      );
      const fetchedBooks = response.data;
      console.log("Fetched books:", fetchedBooks);

      if (!Array.isArray(fetchedBooks)) {
        console.error("Error: Data fetched is not an array");
        return;
      }

      setBooks(fetchedBooks);

      const initialImageState = fetchedBooks.reduce((acc, _, i) => {
        acc[i] = false;
        return acc;
      }, {});
      setImageLoaded(initialImageState);

      setHasMore(fetchedBooks.length === maxResults);
      setStartIndex(index);
      setHasSearched(true);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false); // Matikan indikator loading setelah pencarian buku selesai
    }
  };

  // Fungsi untuk mendapatkan rekomendasi buku dari API Django
  const getRecommendations = async () => {
    setIsLoadingPopular(true); // Set loading indikator ke true untuk Popular Books

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/recommend/?input_text=${query}`
      );
      setRecommendedBooks(response.data); // Set hasil rekomendasi dari model
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoadingPopular(false); // Matikan indikator loading untuk Popular Books setelah data diterima
    }
  };

  // Fungsi untuk menangani pencarian pengguna
  const handleSearch = () => {
    setBooks([]); // Clear books from previous search
    setRecommendedBooks([]); // Clear recommended books from previous search
    setImageLoaded({});
    setStartIndex(0);
    setHasSearched(false);
    searchBooks(0); // Pencarian buku di Google Books API
    getRecommendations(); // Mendapatkan rekomendasi dari model
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
    if (isLoggedIn) {
      // Pengguna sudah login, lanjutkan ke halaman detail buku
      navigate(`/book/${book.id}`, { state: { book, query, startIndex } });
    } else {
      // Pengguna belum login, alihkan ke halaman login
      navigate("/login");
    }
  };
  
  // Toggle dropdown menu
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Fungsi untuk logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    axios.defaults.headers.common['Authorization'] = '';
    navigate("/login");
  };

  // Fungsi untuk navigasi ke halaman bookmark
  const handleMyBookmarks = () => {
    navigate("/bookmarks");
  };

  // Fungsi untuk navigasi ke halaman pengaturan pengguna
  const handleUserSettings = () => {
    navigate("/settings");
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "No description available.";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <>
      <div className="book-search-container">
        <div className="header">
          <h1 className="title">Mau Baca Apa Lu?</h1>
  
          {/* Tampilkan nama user dan avatar dropdown */}
          {isLoggedIn && (
            <div className="user-profile">
              <span className="user-name">Welcome, {userName}</span>
              <div className="avatar-dropdown" ref={dropdownRef}>
                <div className="avatar" onClick={toggleDropdown}>
                  {/* Gunakan inisial atau avatar default */}
                  {userName.charAt(0).toUpperCase()}
                </div>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <div className="dropdown-item" onClick={handleMyBookmarks}>MY BOOKMARKS</div>
                    <div className="dropdown-item" onClick={handleUserSettings}>USER SETTINGS</div>
                    <div className="dropdown-item logout" onClick={handleLogout}>LOGOUT</div>
                  </div>
                )}
              </div>
            </div>
          )}
  
          {/* Tampilkan tombol login dan register hanya jika belum login */}
          {!isLoggedIn && (
            <div className="auth-buttons">
              <button className="auth-button login" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="auth-button register" onClick={() => navigate("/register")}>
                Register
              </button>
            </div>
          )}
        </div>
  
        <div className="search-bar">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by title, author, or category"
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">Search</button>
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
                      {!imageLoaded[index] && <div className="image-placeholder">Loading Image...</div>}
                      <img
                        src={book.thumbnail || "https://via.placeholder.com/100x150"} 
                        alt={book.title}
                        className={`book-thumbnail-small ${imageLoaded[index] ? "visible" : "hidden"}`}
                        onLoad={() => handleImageLoad(index)}
                      />
                    </div>
                    <div className="book-info-small">
                      <h4 className="book-title-small">{truncateText(book.title, 30)}</h4>
                      <p className="book-author-small">{truncateText(book.author || "Unknown Author", 20)}</p>
                      <button className="preview-link-small" onClick={() => handleViewDetails(book)}>View</button>
                    </div>
                  </div>
                ))
              ) : (
                hasSearched && <p className="no-results">No books found. Try searching for something else!</p>
              )}
          </div>
        </div>

        {hasSearched && books.length > 0 && (
          <div className="pagination-controls">
            <button onClick={handlePrev} className="pagination-button" disabled={startIndex === 0 || isLoading}>Previous</button>
            <button onClick={handleNext} className="pagination-button" disabled={!hasMore || isLoading}>Next</button>
          </div>
        )}
      </div>

      {/* Popular Books Section showing Recommendations */}
      {hasSearched && (
        <div className="popular-books-section">
          <h2 className="popular-books-title">Recommendations Books</h2>
          {/* Indikator loading untuk Popular Books */}
          {isLoadingPopular ? (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading Recommendations Books...</p>
            </div>
          ) : (
            <div className="popular-books-grid">
              {recommendedBooks.length > 0 ? (
                recommendedBooks.map((book, index) => (
                  <div className="book-card-small" key={index}>
                    <div className="book-thumbnail-wrapper">
                      <img
                        src={book.thumbnail || "https://via.placeholder.com/100x150"} // Gunakan URL thumbnail buku rekomendasi
                        alt={book.title}
                        className="book-thumbnail-small"  // Gunakan kelas yang sama
                      />
                    </div>
                    <div className="book-info-small">
                      <h4 className="book-title-small">{truncateText(book.title, 30)}</h4>
                      <p className="book-author-small">{truncateText(book.author || "Unknown Author", 20)}</p>
                      <button className="preview-link-small" onClick={() => handleViewDetails(book)}>View</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No recommendations found.</p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default BookSearch;