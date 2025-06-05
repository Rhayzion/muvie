// Home.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext";
import { motion } from "framer-motion";
import "../styles/Home.css";

const Home = () => {
  const { user } = useAuth();
  const { openLoginModal } = useModal();
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (!user) {
      openLoginModal(); // Trigger login modal if not logged in
      return;
    }
    setLikes(hasLiked ? likes - 1 : likes + 1);
    setHasLiked(!hasLiked);
  };

  return (
    <motion.div
      className="home-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="hero-section">
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Welcome to Muvie
        </motion.h1>
        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Discover the latest movies and shows. Sign up to unlock more features!
        </motion.p>
        <motion.div
          className="action-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <button
            className={`like-button ${hasLiked ? "liked" : ""}`}
            onClick={handleLike}
          >
            {user ? (
              <>
                {hasLiked ? "Unlike" : "Like"} ({likes})
              </>
            ) : (
              "Login to Like"
            )}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;