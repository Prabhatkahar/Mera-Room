import React from "react";
import { Link } from "react-router-dom";
import { Home, User } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Home className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          <span className="font-bold text-lg text-gray-900 dark:text-white">
            MeraRoom
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/admin"
            className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            Admin
          </Link>
        </div>

        {/* User Icon / Mobile Menu */}
        <div className="flex items-center space-x-2 md:hidden">
          <User className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
