import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import "./WonderDetailPage.css";

function WonderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wonder, setWonder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchWonderDetails = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "https://www.world-wonders-api.org/v0/wonders",
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allWonders = await response.json();
        console.log("All wonders:", allWonders);
        console.log("Looking for ID:", id);

        const decodedId = decodeURIComponent(id);

        const foundWonder = allWonders.find((w) => {
          const urlName = (w.name || "")
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");

          const directNameMatch = w.name === decodedId;

          return urlName === decodedId || directNameMatch;
        });

        if (foundWonder) {
          console.log("Found wonder:", foundWonder);
          setWonder(foundWonder);
          if (
            foundWonder.links?.images &&
            foundWonder.links.images.length > 0
          ) {
            setSelectedImage(foundWonder.links.images[0]);
          }
        } else {
          setError("Wonder not found. Please check the URL.");
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching wonder details:", err);
      }
    };

    fetchWonderDetails();
  }, [id]);

  const formatBuildYear = (year) => {
    if (!year) return "Unknown";
    return year < 0 ? `${Math.abs(year)} BCE` : year;
  };

  const handleThumbnailClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const SkeletonLoader = () => {
    return (
      <div className="detail__wrapper">
        <div className="detail__header">
          <div className="skeleton-title-large shimmer"></div>
          <div className="skeleton-badge shimmer"></div>
        </div>
        <div className="detail__content">
          <div className="skeleton-main-image shimmer"></div>
          <div className="info__section">
            <div className="skeleton-section-title shimmer"></div>
            <div className="info__grid">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton-info-item shimmer"></div>
              ))}
            </div>
          </div>
          <div className="info__section">
            <div className="skeleton-section-title shimmer"></div>
            <div className="skeleton-text-block shimmer"></div>
          </div>
          <div className="info__section">
            <div className="skeleton-section-title shimmer"></div>
            <div className="skeleton-text-block shimmer"></div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
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
                  Find your wonder
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
        <main className="detail-page">
          <div className="container">
            <button
              className="back-button"
              onClick={() => navigate("/wonders")}
            >
              <i className="fas fa-arrow-left"></i> Back to All Wonders
            </button>
            <SkeletonLoader />
          </div>
        </main>
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

  if (error || !wonder) {
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
                  Find your wonder
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
        <main className="detail-page">
          <div className="container">
            <button
              className="back-button"
              onClick={() => navigate("/wonders")}
            >
              <i className="fas fa-arrow-left"></i> Back to All Wonders
            </button>
            <div className="error-container">
              <h2 className="error-title">Wonder Not Found</h2>
              <p className="error-message">
                {error ||
                  "Unable to load the wonder details. Please try again."}
              </p>
              <button
                className="retry-button"
                onClick={() => navigate("/wonders")}
              >
                Back to Wonders
              </button>
            </div>
          </div>
        </main>
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
                Find your wonder
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

      <main className="detail-page">
        <div className="container">
          <button className="back-button" onClick={() => navigate("/wonders")}>
            <i className="fas fa-arrow-left"></i> Back to All Wonders
          </button>

          <div className="detail__wrapper">
            <div className="detail__header">
              <h1 className="detail__title">
                {wonder.name || "Unknown Wonder"}
              </h1>
              <div className="detail__location-badge">
                <i className="fas fa-map-marker-alt"></i>{" "}
                {wonder.location || "Location unknown"}
              </div>
            </div>

            <div className="detail__content">
              <div className="detail__gallery">
                {wonder.links?.images && wonder.links.images.length > 0 ? (
                  <>
                    <img
                      className="detail__main-image"
                      src={selectedImage || wonder.links.images[0]}
                      alt={wonder.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/800x600?text=Image+Not+Available";
                      }}
                    />

                    {wonder.links.images.length > 1 && (
                      <div className="detail__thumbnails">
                        {wonder.links.images.map((img, idx) => (
                          <img
                            key={idx}
                            className={`detail__thumbnail ${selectedImage === img ? "active" : ""}`}
                            src={img}
                            alt={`${wonder.name} view ${idx + 1}`}
                            onClick={() => handleThumbnailClick(img)}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="detail__no-image">
                    <i className="fas fa-image"></i>
                    <p>No image available</p>
                  </div>
                )}
              </div>

              <div className="detail__info">
                <div className="info__section">
                  <h2 className="section__title">Key Information</h2>
                  <div className="info__grid">
                    <div className="info__item">
                      <i className="fas fa-calendar-alt"></i>
                      <div>
                        <strong>Built Year</strong>
                        <p>{formatBuildYear(wonder.build_year)}</p>
                      </div>
                    </div>
                    <div className="info__item">
                      <i className="fas fa-clock"></i>
                      <div>
                        <strong>Time Period</strong>
                        <p>{wonder.time_period || "Unknown"}</p>
                      </div>
                    </div>
                    <div className="info__item">
                      <i className="fas fa-globe"></i>
                      <div>
                        <strong>Location</strong>
                        <p>{wonder.location || "Unknown"}</p>
                      </div>
                    </div>
                    {wonder.summary && (
                      <div className="info__item full-width">
                        <i className="fas fa-info-circle"></i>
                        <div>
                          <strong>Summary</strong>
                          <p>{wonder.summary}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {wonder.description && (
                  <div className="info__section">
                    <h2 className="section__title">Description</h2>
                    <div className="description__content">
                      <p>{wonder.description}</p>
                    </div>
                  </div>
                )}

                {wonder.history && (
                  <div className="info__section">
                    <h2 className="section__title">Historical Context</h2>
                    <div className="description__content">
                      <p>{wonder.history}</p>
                    </div>
                  </div>
                )}

                {(wonder.links?.wiki || wonder.links?.wikipedia) && (
                  <div className="info__section">
                    <h2 className="section__title">Learn More</h2>
                    <div className="links__container">
                      <a
                        href={wonder.links?.wiki || wonder.links?.wikipedia}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="external-link"
                      >
                        <i className="fab fa-wikipedia-w"></i> Wikipedia
                      </a>
                      {wonder.links?.official && (
                        <a
                          href={wonder.links.official}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="external-link"
                        >
                          <i className="fas fa-external-link-alt"></i> Official
                          Site
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

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

export default WonderDetailPage;
