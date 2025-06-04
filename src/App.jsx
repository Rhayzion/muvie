import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Auth from './pages/Auth';
// import Home from './pages/Home'; // Create this later

function App() {
  
  return(
    <>
      <Auth />
    </>
    
    )
  // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(true); // To prevent flickering on reload

  // useEffect(() => {
  //   const unsub = onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser);
  //     setLoading(false);
  //   });

  //   return () => unsub(); // Cleanup
  // }, []);

  // if (loading) return <p>Loading...</p>;

  // return (
  //   <Router>
  //     <Routes>
  //       {/* Show Home if logged in, else redirect to Auth */}
  //       <Route
  //         path="/"
  //         element={user ? <Home user={user} /> : <Navigate to="/auth" />}
  //       />
  //       {/* Auth route (signup/login/reset) */}
  //       <Route
  //         path="/auth"
  //         element={!user ? <Auth /> : <Navigate to="/" />}
  //       />
  //     </Routes>
  //   </Router>
  // );
}

export default App;
