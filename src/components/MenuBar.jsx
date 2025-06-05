// components/MenuBar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineMenu, AiOutlineClose, AiFillHome, AiFillVideoCamera, AiFillStar, AiFillBook, AiFillInfoCircle } from "react-icons/ai";
import "../styles/MenuBar.css";

const MenuBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Home", path: "/", icon: AiFillHome },
    { name: "Movies", path: "/movies", icon: AiFillVideoCamera },
    { name: "Reviews", path: "/reviews", icon: AiFillStar },
    { name: "News", path: "/news", icon: AiFillBook },
    { name: "About", path: "/about", icon: AiFillInfoCircle },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="menu-bar">
      <motion.button
        className="menu-toggle"
        onClick={toggleMenu}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        {isMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </motion.button>
      <motion.nav
        className={`menu-list ${isMenuOpen ? "open" : ""}`}
        initial={{ width: 0 }}
        animate={{ width: isMenuOpen ? 250 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <ul>
          {menuItems.map((item, index) => (
            <motion.li
              key={item.name}
              custom={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link to={item.path} onClick={() => setIsMenuOpen(false)}>
                <item.icon className="menu-icon" />
                <span className="menu-text">{item.name}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.nav>
    </div>
  );
};

export default MenuBar;