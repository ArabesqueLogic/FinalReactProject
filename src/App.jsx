import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import "@fortawesome/fontawesome-free/css/all.min.css";
import HomePage from "./pages/HomePage";
import WondersPage from "./pages/WondersPage";
import AboutPage from "./pages/AboutPage";
import WonderDetailPage from "./pages/WonderDetailPage";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/wonders" element={<WondersPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/wonder/:id" element={<WonderDetailPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
