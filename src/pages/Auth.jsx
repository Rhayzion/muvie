import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import '../styles/Auth.css';

// Animation library
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { FcGoogle } from 'react-icons/fc';
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineWarning, AiOutlineCheckCircle } from 'react-icons/ai';
import { HiOutlineMail } from 'react-icons/hi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { CgProfile } from 'react-icons/cg';
import { BiArrowBack } from 'react-icons/bi';

const errorMessages = {
  'auth/email-already-in-use': 'Email in use. Sign in instead.',
  'auth/invalid-email': 'Invalid email. Try again.',
  'auth/weak-password': 'Password too short. Use 6+ characters.',
  'auth/user-not-found': 'No account. Sign up first.',
  'auth/wrong-password': 'Wrong password. Try again.',
  'auth/too-many-requests': 'Too many tries. Wait and retry.',
  'auth/network-request-failed': 'Network issue. Check connection.',
  'auth/popup-closed-by-user': 'Google sign-in cancelled.',
  'default': 'Error occurred. Try again.'
};

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const getFriendlyError = (errorCode) => errorMessages[errorCode] || errorMessages['default'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, { displayName: username });
        await setDoc(doc(db, 'users', userCred.user.uid), { email, username, createdAt: new Date().toISOString() });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
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
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        username: result.user.displayName || result.user.email.split('@')[0],
        createdAt: new Date().toISOString()
      }, { merge: true });
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
      setResetMessage('Reset link sent! Check your inbox.');
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
      >
        <AnimatePresence mode="wait">
          {!resetMode ? (
            <motion.div
              key="auth-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              <div className="auth-header">
                <h1 className="auth-title">{isSignup ? 'Join the Action' : 'Back in Action'}</h1>
                <p className="auth-subtitle">
                  {isSignup ? 'Kick off your adventure' : 'Jump back in'}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(255, 87, 34, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoogleSignIn}
                className="auth-google-btn"
                disabled={loading}
              >
                <FcGoogle size={20} />
                <span>Continue with Google</span>
              </motion.button>

              <div className="auth-divider">
                <span>or</span>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                <motion.div
                  className="auth-input-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
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
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <CgProfile className="auth-input-icon" />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="auth-input"
                      required
                    />
                  </motion.div>
                )}

                <motion.div
                  className="auth-input-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <RiLockPasswordLine className="auth-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
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
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <span onClick={() => setResetMode(true)}>Forgot Password?</span>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    className="auth-message auth-error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AiOutlineWarning className="auth-message-icon" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 87, 34, 0.7)' }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="auth-spinner"></span>
                  ) : isSignup ? (
                    'Sign Up'
                  ) : (
                    'Sign In'
                  )}
                </motion.button>
              </form>

              <motion.div
                className="auth-switch-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <span>
                  {isSignup ? 'Already here? ' : 'New here? '}
                  <span onClick={() => setIsSignup((prev) => !prev)}>
                    {isSignup ? 'Sign In' : 'Sign Up'}
                  </span>
                </span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="reset-mode"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
            >
              <div className="auth-header">
                <h1 className="auth-title">Reset Password</h1>
                <p className="auth-subtitle">Get back in the game</p>
              </div>

              <motion.div
                className="auth-input-group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
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
                  className={`auth-message ${resetMessage.includes('sent') ? 'auth-success' : 'auth-error'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {resetMessage.includes('sent') ? (
                    <AiOutlineCheckCircle className="auth-message-icon" />
                  ) : (
                    <AiOutlineWarning className="auth-message-icon" />
                  )}
                  <span>{resetMessage}</span>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 87, 34, 0.7)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResetPassword}
                className="auth-button"
                disabled={loading}
              >
                {loading ? <span className="auth-spinner"></span> : 'Send Reset Link'}
              </motion.button>

              <motion.div
                className="auth-switch-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <span onClick={() => setResetMode(false)}>
                  <BiArrowBack className="auth-back-icon" />
                  Back to Sign In
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}