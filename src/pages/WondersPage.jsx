import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import "./WondersPage.css";

function WondersPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [wonders, setWonders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Pagination state - 9 wonders per page
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLoading, setPageLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const wondersPerPage = 9;

  // Get search query from URL when component mounts
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");
    if (searchQuery) {
      setSearchTerm(searchQuery);
      setDebouncedSearchTerm(searchQuery);
      setCurrentPage(1);
    }
  }, [location]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      if (searchTerm !== debouncedSearchTerm) {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredAndSortedWonders = () => {
    let filtered = wonders;

    if (debouncedSearchTerm.trim()) {
      filtered = wonders.filter(
        (wonder) =>
          (wonder.name || "")
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (wonder.location || "")
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (wonder.time_period || "")
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()),
      );
    }

    switch (sortBy) {
      case "A_TO_Z":
        return [...filtered].sort((a, b) =>
          (a.name || "").localeCompare(b.name || ""),
        );
      case "Z_TO_A":
        return [...filtered].sort((a, b) =>
          (b.name || "").localeCompare(a.name || ""),
        );
      case "NEWEST":
        return [...filtered].sort(
          (a, b) => (b.build_year || 0) - (a.build_year || 0),
        );
      case "OLDEST":
        return [...filtered].sort(
          (a, b) => (a.build_year || 0) - (b.build_year || 0),
        );
      default:
        return filtered;
    }
  };

  useEffect(() => {
    const fetchWonders = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://www.world-wonders-api.org/v0/wonders",
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched wonders:", data);
        setWonders(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching wonders:", err);
      }
    };

    fetchWonders();
  }, []);

  const handleSortChange = async (e) => {
    const newSortBy = e.target.value;
    setFilterLoading(true);
    setSortBy(newSortBy);
    setCurrentPage(1);

    setTimeout(() => {
      setFilterLoading(false);
    }, 300);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setFilterLoading(true);
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCurrentPage(1);

    setTimeout(() => {
      setFilterLoading(false);
    }, 300);
  };

  const paginate = (pageNumber) => {
    if (pageNumber === currentPage) return;
    setPageLoading(true);
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      setPageLoading(false);
    }, 300);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setPageLoading(true);
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => {
        setPageLoading(false);
      }, 300);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setPageLoading(true);
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => {
        setPageLoading(false);
      }, 300);
    }
  };

  const SkeletonLoader = () => {
    return (
      <>
        {[...Array(9)].map((_, index) => (
          <div key={`skeleton-${index}`} className="skeleton-wrapper">
            <div className="skeleton-card">
              <div className="skeleton-image"></div>
              <div className="skeleton-description">
                <div className="skeleton-title"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-button"></div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  };

  const allWonders = filteredAndSortedWonders();
  const totalWonders = allWonders.length;
  const totalPages = Math.ceil(totalWonders / wondersPerPage);

  const indexOfLastWonder = currentPage * wondersPerPage;
  const indexOfFirstWonder = indexOfLastWonder - wondersPerPage;
  const currentWonders = allWonders.slice(
    indexOfFirstWonder,
    indexOfLastWonder,
  );

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  if (loading) {
    return (
      <main className="wonders-page">
        <div className="container">
          <div className="top-nav">
            <button onClick={() => navigate("/")} className="home-button">
              <i className="fas fa-home"></i> Home
            </button>
            <ThemeToggle />
          </div>
          <div className="wonders-header">
            <div className="wonders-title-section">
              <h1 className="wonders-title">
                All <span className="accent">Wonders</span>
              </h1>
              <span className="wonders-count">(Loading...)</span>
            </div>
            <div className="wonders-controls">
              <input
                type="text"
                placeholder="Search wonders..."
                className="search-bar wonders-search"
                disabled
              />
              <select id="filter" disabled>
                <option>Sort by</option>
              </select>
            </div>
          </div>
          <div className="wonders__wrapper">
            <SkeletonLoader />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="wonders-page">
        <div className="container">
          <div className="top-nav">
            <button onClick={() => navigate("/")} className="home-button">
              <i className="fas fa-home"></i> Home
            </button>
            <ThemeToggle />
          </div>
          <div className="error-container">
            <h2 className="error-title">Unable to Load Wonders</h2>
            <p className="error-message">
              There was an error fetching the wonders data: {error}
            </p>
            <button
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const showLoading = pageLoading || filterLoading;

  return (
    <main className="wonders-page">
      <div className="container">
        <div className="top-nav">
          <button onClick={() => navigate("/")} className="home-button">
            <i className="fas fa-home"></i> Home
          </button>
          <ThemeToggle />
        </div>

        <div className="wonders-header">
          <div className="wonders-title-section">
            <h1 className="wonders-title">
              All <span className="accent">Wonders</span>
            </h1>
            <span className="wonders-count">({totalWonders} wonders)</span>
          </div>
          <div className="wonders-controls">
            <input
              type="text"
              placeholder="Search wonders..."
              className="search-bar wonders-search"
              value={searchTerm}
              onChange={handleSearchChange}
              disabled={filterLoading}
            />
            <select
              id="filter"
              value={sortBy}
              onChange={handleSortChange}
              disabled={filterLoading}
            >
              <option className="filter__item" value="" disabled>
                Sort by
              </option>
              <option className="filter__item" value="A_TO_Z">
                A to Z
              </option>
              <option className="filter__item" value="Z_TO_A">
                Z to A
              </option>
              <option className="filter__item" value="NEWEST">
                Newest
              </option>
              <option className="filter__item" value="OLDEST">
                Oldest
              </option>
            </select>
          </div>
        </div>

        {searchTerm && !filterLoading && (
          <div className="search-results-message">
            <i className="fas fa-search"></i>
            Showing results for: <strong>"{searchTerm}"</strong>
            {currentWonders.length === 0 ? (
              <span className="no-results-msg"> - No wonders found</span>
            ) : (
              <span className="results-count">
                {" "}
                - {totalWonders} wonders found (showing {indexOfFirstWonder + 1}
                -{Math.min(indexOfLastWonder, totalWonders)})
              </span>
            )}
            <button
              className="clear-search-btn"
              onClick={clearSearch}
              disabled={filterLoading}
            >
              Clear <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {showLoading ? (
          <div className="wonders__wrapper">
            <SkeletonLoader />
          </div>
        ) : (
          <>
            <div className="wonders__wrapper">
              {currentWonders.map((wonder, index) => {
                const wonderSlug = (wonder.name || `wonder-${index}`)
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^\w-]/g, "");

                return (
                  <Link
                    to={`/wonder/${wonderSlug}`}
                    key={index}
                    className="wonder__link-wrapper"
                  >
                    <div className="wonder__wrapper">
                      <div className="wonder__image-container">
                        <img
                          className="wonder__img"
                          src={
                            wonder.links?.images?.[0] ||
                            "https://via.placeholder.com/300x400?text=No+Image+Available"
                          }
                          alt={wonder.name || "Wonder"}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/300x400?text=Image+Not+Found";
                          }}
                        />
                      </div>
                      <div className="wonder_description">
                        <h3 className="wonder__title">
                          {wonder.name || "Unknown Wonder"}
                        </h3>
                        <p className="wonder__location">
                          {wonder.location || "Location unknown"}
                        </p>
                        <p className="wonder__build-year">
                          Built:{" "}
                          {wonder.build_year
                            ? wonder.build_year < 0
                              ? `${Math.abs(wonder.build_year)} BCE`
                              : wonder.build_year
                            : "Unknown"}
                        </p>
                        <p className="wonder__time-period">
                          Period: {wonder.time_period || "Unknown"}
                        </p>
                        <div className="wonder__links">
                          <span className="wonder__link">
                            View Details <i className="fas fa-arrow-right"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1 || showLoading}
                  className="pagination-btn pagination-prev"
                >
                  <i className="fas fa-chevron-left"></i> Previous
                </button>

                <div className="pagination-numbers">
                  {getPageNumbers().map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      disabled={showLoading}
                      className={`pagination-number ${currentPage === number ? "active" : ""}`}
                    >
                      {number}
                    </button>
                  ))}
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages || showLoading}
                  className="pagination-btn pagination-next"
                >
                  Next <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}

        {!showLoading && currentWonders.length === 0 && searchTerm && (
          <div className="no-results-container">
            <i className="fas fa-search fa-3x"></i>
            <h3>No wonders found matching "{searchTerm}"</h3>
            <p>Try searching with different keywords like:</p>
            <div className="suggested-searches">
              <button
                onClick={() => {
                  setFilterLoading(true);
                  setSearchTerm("Great Wall");
                  setDebouncedSearchTerm("Great Wall");
                  setTimeout(() => setFilterLoading(false), 300);
                }}
              >
                Great Wall
              </button>
              <button
                onClick={() => {
                  setFilterLoading(true);
                  setSearchTerm("Colosseum");
                  setDebouncedSearchTerm("Colosseum");
                  setTimeout(() => setFilterLoading(false), 300);
                }}
              >
                Colosseum
              </button>
              <button
                onClick={() => {
                  setFilterLoading(true);
                  setSearchTerm("Pyramid");
                  setDebouncedSearchTerm("Pyramid");
                  setTimeout(() => setFilterLoading(false), 300);
                }}
              >
                Pyramid
              </button>
              <button
                onClick={() => {
                  setFilterLoading(true);
                  setSearchTerm("Rome");
                  setDebouncedSearchTerm("Rome");
                  setTimeout(() => setFilterLoading(false), 300);
                }}
              >
                Rome
              </button>
              <button
                onClick={() => {
                  setFilterLoading(true);
                  setSearchTerm("Ancient");
                  setDebouncedSearchTerm("Ancient");
                  setTimeout(() => setFilterLoading(false), 300);
                }}
              >
                Ancient
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default WondersPage;
