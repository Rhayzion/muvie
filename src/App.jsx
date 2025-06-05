// App.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import Header from "./components/Header";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import LoginModal from "./components/LoginModal";

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
          <LoginModal />
        </Router>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;