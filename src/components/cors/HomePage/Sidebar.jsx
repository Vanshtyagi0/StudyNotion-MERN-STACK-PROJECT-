import React from "react";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Background Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      ></div>

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={onClose} className="text-gray-500 text-2xl">
            &times;
          </button>
        </div>
        <ul className="p-4 space-y-4">
          <li><a href="#home" className="block hover:text-blue-500">Home</a></li>
          <li><a href="#about" className="block hover:text-blue-500">About</a></li>
          <li><a href="#contact" className="block hover:text-blue-500">Contact</a></li>
        </ul>
      </div>
    </>
  );
}
