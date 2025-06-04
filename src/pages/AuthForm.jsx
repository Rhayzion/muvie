import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AuthForm() {
  const [isSignup, setIsSignup] = useState(false);
  const [userData, setUserData] = useState({ email: '', password: '', username: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetMode, setResetMode] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignup) {
        const userCredentials = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        await updateProfile(userCredentials.user, { displayName: userData.username });
        await setDoc(doc(db, 'users', userCredentials.user.uid), {
          username: userData.username,
          email: userData.email,
        });
      } else {
        await signInWithEmailAndPassword(auth, userData.email, userData.password);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Authentication failed. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSignup = () => {
    setIsSignup((prev) => !prev);
    setUserData({ ...userData, username: '' });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setResetMessage('');
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage('Password reset email sent!');
    } catch (err) {
      console.error('Error sending reset email:', err);
      setError('Failed to send reset email. Please check your email address.');
    }
  };

  const toggleResetMode = () => {
    setResetMode((prev) => !prev);
    setError('');
    setResetMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white/60 backdrop-blur-md shadow-2xl rounded-xl p-8 w-full max-w-4xl flex flex-col md:flex-row gap-10">
        {!resetMode ? (
          <>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
              <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-4">
                {isSignup ? 'Create Account' : 'Welcome Back'}
              </h2>

              {isSignup && (
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={userData.username}
                  onChange={handleInputChange}
                  className="input-style"
                  required
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={userData.email}
                onChange={handleInputChange}
                className="input-style"
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={userData.password}
                  onChange={handleInputChange}
                  className="input-style pr-10"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                className="bg-purple-600 text-white font-bold py-2 rounded-md hover:bg-purple-700 transition"
              >
                {isSignup ? 'Sign Up' : 'Sign In'}
              </button>

              <div className="text-center text-sm text-gray-600">
                <p onClick={toggleSignup} className="cursor-pointer hover:text-purple-700 font-medium">
                  {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </p>
                <p onClick={toggleResetMode} className="cursor-pointer hover:text-blue-600 mt-2">
                  Forgot Password?
                </p>
              </div>
            </form>

            <div className="flex-1 hidden md:block">
              <img
                src={isSignup ? '/signup.svg' : '/signin.svg'}
                alt="Illustration"
                className="w-full max-h-96 object-contain"
              />
            </div>
          </>
        ) : (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-5 w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 text-center">Reset Password</h2>

            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="input-style"
              required
            />

            {resetMessage && <p className="text-green-600 text-sm">{resetMessage}</p>}
            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition"
            >
              Send Reset Email
            </button>

            <button
              type="button"
              onClick={toggleResetMode}
              className="text-sm text-gray-600 hover:text-purple-700"
            >
              Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
