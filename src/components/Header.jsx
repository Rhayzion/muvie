import { Link } from "react-router-dom";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Header.css";

// Icons (optional, for dropdown)
import { FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";

const Header = () => {
  const { user, loading } = useAuth(); // Destructure loading as well
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  console.log("User in Header:", user, "Loading:", loading); // Debug log

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <header className="main-header">
        <div className="logo">
          <Link to="/">
            <img src="/logo.png" alt="Muvie Logo" className="logo-img" />
          </Link>
        </div>
        <nav className="nav">
          <div className="loading-placeholder"></div> {/* Placeholder while loading */}
        </nav>
      </header>
    );
  }

  return (
    <motion.header
      className="main-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      <div className="logo">
        <Link to="/">
          <motion.img
            src="/logo.png"
            alt="Muvie Logo"
            className="logo-img"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          />
        </Link>
      </div>
      <nav className="nav">
        {user ? (
          <div className="user-section">
            <motion.div
              className="user-avatar-wrapper"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={user.photoURL || "default-avatar.png"}
                alt="User Avatar"
                className="user-avatar"
              />
              <FiChevronDown className={`dropdown-icon ${isDropdownOpen ? "open" : ""}`} />
            </motion.div>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  className="dropdown-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
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
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Link to="/auth" className="btn">
              Login
            </Link>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

export default Header;