import React from "react";
import * as Icons from "react-icons/vsc";
import { matchPath, NavLink, useLocation } from "react-router-dom";

const SidebarLink = ({ link, iconName, onClick }) => {
  const Icon = Icons[iconName];
  const location = useLocation();

  const matchRoute = (Route) => {
    return matchPath({ path: Route }, location.pathname);
  };

  return (
    <NavLink
      to={link.path}
      onClick={onClick} // ✅ close sidebar on mobile tap
      className={({ isActive }) =>
        `relative flex items-center gap-x-3 rounded-md px-6 py-3 text-sm font-medium transition-all duration-200 
        ${
          matchRoute(link.path)
            ? "bg-yellow-800 text-yellow-50"
            : "text-richblack-300 hover:bg-richblack-700 hover:text-white"
        }`
      }
    >
      {/* Left highlight line */}
      <span
        className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 transition-opacity duration-200 ${
          matchRoute(link.path) ? "opacity-100" : "opacity-0"
        }`}
      ></span>

      {/* Icon and label */}
      <Icon className="text-lg shrink-0" />
      <span className="truncate">{link.name}</span>
    </NavLink>
  );
};

export default SidebarLink;
