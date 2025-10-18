import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

import Sidebar from "../components/cors/Dashboard/Sidebar";

const Dashboard = () => {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.profile);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (profileLoading || authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] bg-gray-50">
      {/* Mobile menu button */}
      <button
        className="absolute top-2 left-2 z-30 block text-2xl text-gray-700 text-richblack-5 lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <AiOutlineMenu />
      </button>

      {/* Sidebar for desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Sidebar overlay for mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Background overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar drawer */}
            <motion.div
              className="fixed left-0 top-0 z-30 h-full w-64 bg-gray-900 text-white shadow-lg"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
            >
              <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="mx-auto w-11/12 max-w-[1000px] py-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
