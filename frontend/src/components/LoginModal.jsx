import React from "react";
import LoginForm from "./LoginForm";

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg relative w-full max-w-sm">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-blue-800">Login</h2>
        <LoginForm onSuccess={onClose} />
      </div>
    </div>
  );
};

export default LoginModal;