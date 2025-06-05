import { Link } from "react-router-dom";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import MenuBar from "./MenuBar";
import "../styles/Header.css";
import { FiChevronDown, FiLogOut, FiUser, FiSearch } from "react-icons/fi";

const Header = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Add search functionality here (e.g., navigate to /search?q=${searchQuery})
      setSearchQuery("");
      setIsSearchActive(false);
    }
  };

  if (loading) {
    return (
      <header className="main-header">
        <MenuBar />
        <div className="logo">
          <Link to="/">
            <div className="logo-placeholder" />
          </Link>
        </div>
        <nav className="nav">
          <div className="loading-placeholder" />
        </nav>
      </header>
    );
  }

  return (
    <motion.header
      className="main-header"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <MenuBar />
      <div className="logo">
        <Link to="/">
          <motion.img
            src="/logo.png"
            alt="Muvie Logo"
            className="logo-img"
            whileHover={{ scale: 1.1, y: -5 }}
            transition={{ type: "spring", stiffness: 150, damping: 10 }}
          />
        </Link>
      </div>
      <nav className="nav">
        <div className="search-container">
          <motion.form
            className="search-form"
            onSubmit={handleSearchSubmit}
            initial={{ width: 0 }}
            animate={{ width: isSearchActive ? 250px : 50px }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.button
              type="button"
              className="search-icon-btn"
              onClick={() => setIsSearchActive(!isSearchActive)}
              whileHover={{ scale: 1.2, color: "#ff4d4d" }}
              transition={{ duration: 0.3 }}
            >
              <FiSearch size={20} />
            </motion.button>
            <motion.input
              type="text"
              className="search-input"
              placeholder="Search movies, actors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              initial={{ opacity: 0 }}
              animate={{ opacity: isSearchActive ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.form>
        </div>
        {user ? (
          <div className="user-section">
            <motion.div
              className="user-avatar-wrapper"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(229, 9, 20, 0.5)" }}
            >
              <img
                src={user.photoURL || "default-avatar.png"}
                alt="User Avatar"
                className="user-avatar"
              />
              <FiChevronDown className="dropdown-icon" />
            </motion.div>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  className="dropdown-menu"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FiUser className="dropdown-item-icon" />
                    Profile
                  </Link>
                  <button onClick={handleSignOut} className="dropdown-item">
                    <FiLogOut className="dropdown-item-icon" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            className="auth-buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/auth" state={{ fromHeader: true }} className="btn signup-btn">
              Sign Up
            </Link>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

export default Header;