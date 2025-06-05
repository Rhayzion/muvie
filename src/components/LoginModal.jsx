
import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "../context/ModalContext";
import Auth from "../pages/Auth";
import "../styles/LoginModal.css";
import { AiOutlineClose } from "react-icons/ai";

const LoginModal = () => {
  const { isLoginModalOpen, closeLoginModal } = useModal();

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button className="modal-close-btn" onClick={closeLoginModal}>
              <AiOutlineClose size={24} />
            </button>
            <Auth isModal={true} /> {/* Pass a prop to indicate it's in a modal */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;