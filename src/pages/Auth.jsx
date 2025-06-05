import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { useModal } from "../context/ModalContext"; // Add this
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Auth.css";

// Icons
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineWarning, AiOutlineCheckCircle } from "react-icons/ai";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { BiArrowBack } from "react-icons/bi";

const errorMessages = {
  "auth/email-already-in-use": "Email already in use. Try signing in.",
  "auth/invalid-email": "Please enter a valid email.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/user-not-found": "No account found. Sign up first.",
  "auth/wrong-password": "Incorrect password. Try again.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
  "auth/network-request-failed": "Network error. Check your connection.",
  "auth/popup-closed-by-user": "Google sign-in cancelled.",
  "default": "An error occurred. Please try again.",
};

const generateUsername = (email) => {
  const adjectives = ["Creative", "Bold", "Swift", "Curious", "Epic"];
  const nouns = ["Explorer", "Creator", "Voyager", "Dreamer", "Star"];
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const emailPrefix = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
  return `${randomAdj}${randomNoun}${emailPrefix.slice(0, 3)}`;
};

const getInitials = (name, email) => {
  if (name) {
    const nameParts = name.split(" ");
    return nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : nameParts[0][0].toUpperCase();
  }
  return email[0].toUpperCase();
};

export default function Auth({ isModal = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { closeLoginModal } = useModal(); // Use modal context
  const [isSignup, setIsSignup] = useState(location.state?.fromHeader ? true : false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const getFriendlyError = (errorCode) => errorMessages[errorCode] || errorMessages["default"];

  const createUserProfile = async (user, signupMethod, providedUsername) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const generatedUsername = providedUsername || generateUsername(user.email);
      const initials = getInitials(user.displayName || providedUsername, user.email);
      const avatarColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
      const avatar = `https://via.placeholder.com/100/${avatarColor.slice(1)}/fff?text=${initials}`;
      const bio = `New explorer via ${signupMethod}. Ready to dive into the cinematic world!`;

      await setDoc(userRef, {
        email: user.email,
        username: generatedUsername,
        avatar,
        bio,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignup) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, { displayName: username || null });
        await createUserProfile(userCred.user, "Email", username);
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        await createUserProfile(userCred.user, "Email", null);
      }
      if (isModal) {
        closeLoginModal(); // Close modal on success
      } else {
        const from = location.state?.from || "/";
        navigate(from);
      }
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createUserProfile(result.user, "Google", null);
      if (isModal) {
        closeLoginModal(); // Close modal on success
      } else {
        const from = location.state?.from || "/";
        navigate(from);
      }
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("Reset link sent! Check your inbox.");
    } catch (err) {
      setResetMessage(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-box"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
      >
        <AnimatePresence mode="wait">
          {!resetMode ? (
            <motion.div
              key="auth-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="auth-header">
                <h1 className="auth-title">{isSignup ? "Sign Up" : "Sign In"}</h1>
                <p className="auth-subtitle">
                  {isSignup ? "Start your journey" : "Welcome back"}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "#2a2a2a" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGoogleSignIn}
                className="auth-google-btn"
                disabled={loading}
              >
                <FcGoogle size={20} />
                <span>Continue with Google</span>
              </motion.button>

              <div className="auth-divider" />

              <form onSubmit={handleSubmit} className="auth-form">
                <motion.div
                  className="auth-input-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <HiOutlineMail className="auth-input-icon" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                    required
                  />
                </motion.div>

                {isSignup && (
                  <motion.div
                    className="auth-input-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <CgProfile className="auth-input-icon" />
                    <input
                      type="text"
                      placeholder="Username (optional)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="auth-input"
                    />
                  </motion.div>
                )}

                <motion.div
                  className="auth-input-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <RiLockPasswordLine className="auth-input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="auth-eye-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </button>
                </motion.div>

                {!isSignup && (
                  <motion.div
                    className="auth-forgot-password"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <span onClick={() => setResetMode(true)}>Forgot Password?</span>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    className="auth-message auth-error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AiOutlineWarning className="auth-message-icon" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: "#c11119" }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? <span className="auth-spinner"></span> : isSignup ? "Sign Up" : "Sign In"}
                </motion.button>
              </form>

              <motion.div
                className="auth-switch-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <span>
                  {isSignup ? "Already have an account? " : "Don't have an account? "}
                  <span onClick={() => setIsSignup((prev) => !prev)}>
                    {isSignup ? "Sign In" : "Sign Up"}
                  </span>
                </span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="reset-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="auth-header">
                <h1 className="auth-title">Reset Password</h1>
                <p className="auth-subtitle">Enter your email to reset</p>
              </div>

              <motion.div
                className="auth-input-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <HiOutlineMail className="auth-input-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="auth-input"
                  required
                />
              </motion.div>

              {resetMessage && (
                <motion.div
                  className={`auth-message ${resetMessage.includes("sent") ? "auth-success" : "auth-error"}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {resetMessage.includes("sent") ? (
                    <AiOutlineCheckCircle className="auth-message-icon" />
                  ) : (
                    <AiOutlineWarning className="auth-message-icon" />
                  )}
                  <span>{resetMessage}</span>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.03, backgroundColor: "#c11119" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleResetPassword}
                className="auth-button"
                disabled={loading}
              >
                {loading ? <span className="auth-spinner"></span> : "Send Reset Link"}
              </motion.button>

              {!isModal && ( // Hide "Back to Sign In" in modal mode
                <motion.div
                  className="auth-switch-mode"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <span onClick={() => setResetMode(false)}>
                    <BiArrowBack className="auth-back-icon" />
                    Back to Sign In
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}