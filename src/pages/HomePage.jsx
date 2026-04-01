import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import "./HomePage.css";

function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allWonders, setAllWonders] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWonders = async () => {
      try {
        const response = await fetch(
          "https://www.world-wonders-api.org/v0/wonders",
        );
        if (response.ok) {
          const data = await response.json();
          setAllWonders(data);
        }
      } catch (err) {
        console.error("Error fetching wonders:", err);
      }
    };
    fetchWonders();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      const filtered = allWonders.filter(
        (wonder) =>
          wonder.name?.toLowerCase().includes(value.toLowerCase()) ||
          wonder.location?.toLowerCase().includes(value.toLowerCase()) ||
          wonder.time_period?.toLowerCase().includes(value.toLowerCase()),
      );
      setSuggestions(filtered.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/wonders?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSuggestionClick = (wonder) => {
    setSearchTerm(wonder.name);
    setShowSuggestions(false);
    const wonderSlug = wonder.name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/wonder/${wonderSlug}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search__box")) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <nav>
        <div className="nav__title">WORLD WONDERS LIBRARY</div>
        <div className="nav__right">
          <ul className="nav__link--list">
            <li className="nav__link">
              <Link to="/" className="nav__link--anchor">
                Home
              </Link>
            </li>
            <li className="nav__link">
              <Link to="/wonders" className="nav__link--anchor">
                Wonders Library
              </Link>
            </li>
            <li className="nav__link btn--link">
              <Link to="#footer" className="nav__link--anchor nav__link--btn">
                Contact
              </Link>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </nav>

      <header className="hero">
        <div className="container">
          <div className="hero__wrapper">
            <div className="hero__content">
              <div className="search__wrapper">
                <h1 className="search__title">BROWSE YOUR WONDERS HERE</h1>
                <div className="search__box">
                  <input
                    className="search-bar"
                    type="text"
                    placeholder="Search wonders by name, location, or time period..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                    onFocus={() =>
                      searchTerm.trim() && setShowSuggestions(true)
                    }
                  />
                  <i className="fa-solid fa-magnifying-glass"></i>

                  {showSuggestions && suggestions.length > 0 && (
                    <div className="search-suggestions">
                      {suggestions.map((wonder, index) => (
                        <div
                          key={index}
                          className="suggestion-item"
                          onClick={() => handleSuggestionClick(wonder)}
                        >
                          <div className="suggestion-icon">
                            <i className="fas fa-landmark"></i>
                          </div>
                          <div className="suggestion-content">
                            <div className="suggestion-name">{wonder.name}</div>
                            <div className="suggestion-location">
                              <i className="fas fa-map-marker-alt"></i>{" "}
                              {wonder.location}
                            </div>
                          </div>
                          <div className="suggestion-arrow">
                            <i className="fas fa-arrow-right"></i>
                          </div>
                        </div>
                      ))}
                      {suggestions.length > 0 && (
                        <div className="suggestion-footer">
                          Press Enter to see all results
                        </div>
                      )}
                    </div>
                  )}

                  {showSuggestions &&
                    searchTerm.trim() &&
                    suggestions.length === 0 && (
                      <div className="search-suggestions no-results">
                        <div className="suggestion-item no-results-item">
                          <div className="suggestion-icon">
                            <i className="fas fa-search"></i>
                          </div>
                          <div className="suggestion-content">
                            <div className="suggestion-name">
                              No wonders found
                            </div>
                            <div className="suggestion-location">
                              Try searching for "Great Wall", "Colosseum", or
                              "Pyramid"
                            </div>
                          </div>
                        </div>
                        <div className="suggestion-footer">
                          Press Enter to see all matching results
                        </div>
                      </div>
                    )}
                </div>
                <div className="search-hint">
                  <span>✨ Try: "Great Wall", "Rome", "Ancient"</span>
                </div>
              </div>
            </div>
            <div className="hero__image">
              <img
                className="hero__img"
                src="https://cdn.contexttravel.com/image/upload/w_1500,q_60/v1661526757/blog/%207%20Wonders%20of%20the%20Modern%20World/7_wonders_christ.jpg"
                alt="Ancient wonders collage"
              />
            </div>
          </div>
        </div>
      </header>

      <footer id="footer">
        <div className="container">
          <div className="footer__row">
            <div className="footer__title">WORLD WONDERS LIBRARY</div>
            <ul className="footer__links">
              <li className="footer__link">
                <Link to="/">Home</Link>
              </li>
              <li className="footer__link">
                <Link to="/wonders">Wonders</Link>
              </li>
              <li className="footer__link">
                <Link to="/about">About</Link>
              </li>
            </ul>
            <div className="footer_copyright">&copy; 2026 Copyright</div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default HomePage;
