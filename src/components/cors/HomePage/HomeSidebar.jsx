import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

const HomeSidebar = ({ isOpen, onClose, subLinks, loading }) => {

  const {token} = useSelector((state) => state.auth);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dimmed Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar Panel */}
          <motion.div
            className="fixed right-0 top-0 h-[75vh] sm:w-[45vw] md:w-[35vw] lg:w-[25vw]
            bg-black/30 backdrop-blur-xl border-l border-white/10 rounded-l-2xl z-50
            p-6 flex flex-col shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white tracking-wide">
                Menu
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-all"
              >
                <AiOutlineClose className="text-2xl text-richblack-5" />
              </button>
            </div>

            {/* Courses Section */}
            <div className="text-white text-center mt-5 border-b border-white/10 pb-5">
              <h3 className="text-yellow-300 text-lg font-semibold mb-3">
                Courses
              </h3>
              <ul className="text-left space-y-2">
                {loading ? (
                  <p className="text-gray-400 text-sm">Loading...</p>
                ) : subLinks && subLinks.length > 0 ? (
                  subLinks.map((subLink) => (
                    <Link
                      to={`/catalog/${subLink.name
                        .split(" ")
                        .join("-")
                        .toLowerCase()}`}
                      key={subLink._id}
                      onClick={onClose}
                    >
                      <li className="p-2 rounded-md hover:bg-white/10 transition-all cursor-pointer text-sm sm:text-base">
                        {subLink.name}
                      </li>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No Courses Found</p>
                )}
              </ul>
            </div>

            {/* General Links */}
            <div className="mt-5 flex flex-col gap-3 text-white/90 text-sm sm:text-base">
              <Link
                to="/about"
                onClick={onClose}
                className="hover:text-yellow-300 transition-all"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={onClose}
                className="hover:text-yellow-300 transition-all"
              >
                Contact Us
              </Link>
            </div>

            {/* Footer Buttons */}
            {
              token === null &&
                <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="border border-white/20 bg-black/40 px-4 py-2 rounded-md 
                    text-white text-center hover:bg-white/10 transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={onClose}
                    className="border border-yellow-300 bg-yellow-200 px-4 py-2 rounded-md 
                    text-black font-semibold text-center hover:bg-yellow-300 transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
            }
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HomeSidebar;
