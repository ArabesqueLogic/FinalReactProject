import React from "react";
import { Link } from "react-router-dom";
import "./AboutPage.css";

function AboutPage() {
  return (
    <>
      <nav>
        <div className="nav__title">WORLD WONDERS LIBRARY</div>
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
      </nav>

      <main className="about-page">
        <div className="container">
          <div className="about__wrapper">
            <h1 className="about__title">About World Wonders Library</h1>
            <div className="about__content">
              <p>
                Welcome to the World Wonders Library, your digital gateway to
                the most magnificent achievements of human civilization
                throughout history.
              </p>

              <h2>Our Mission</h2>
              <p>
                To preserve, celebrate, and educate people about the world's
                most remarkable wonders, from ancient marvels to modern
                masterpieces.
              </p>

              <h2>What We Offer</h2>
              <ul>
                <li>Comprehensive information about world wonders</li>
                <li>High-quality images and historical context</li>
                <li>Interactive search and sorting features</li>
                <li>Educational resources for all ages</li>
              </ul>
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

export default AboutPage;
