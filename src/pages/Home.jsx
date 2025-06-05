// MovieDetails.js
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useModal } from "../context/ModalContext"; // Add this
import { motion } from "framer-motion";
import "../styles/MovieDetails.css";

// Dummy movie data fetch (replace with your API call)
const fetchMovie = async (id) => {
  return {
    id,
    title: "Venom: Let There Be Carnage",
    rating: 4.1,
    description:
      "Eddie Brock is still struggling to coexist with the shape-shifting extraterrestrial Venom. When deranged serial killer Cletus Kasady also becomes host to an alien symbiote, Brock and Venom must put aside their differences to stop his reign of terror.",
  };
};

const MovieDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { openLoginModal } = useModal(); // Use modal context
  const [movie, setMovie] = useState(null);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const loadMovie = async () => {
      const movieData = await fetchMovie(id);
      setMovie(movieData);
    };
    loadMovie();
  }, [id]);

  const handleLike = () => {
    if (!user) {
      openLoginModal(); // Open modal instead of redirecting
      return;
    }
    setLikes(hasLiked ? likes - 1 : likes + 1);
    setHasLiked(!hasLiked);
  };

  if (!movie) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="movie-details-container">
      <motion.div
        className="movie-details"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="movie-title">{movie.title}</h1>
        <p className="movie-rating">Rating: {movie.rating} ★</p>
        <p className="movie-description">{movie.description}</p>

        {/* Like Button */}
        <motion.button
          className={`like-button ${hasLiked ? "liked" : ""}`}
          onClick={handleLike}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {user ? (
            <>
              {hasLiked ? "Unlike" : "Like"} ({likes})
            </>
          ) : (
            "Login to Like"
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default MovieDetails;