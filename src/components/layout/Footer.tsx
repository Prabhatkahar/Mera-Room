import React from "react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-6 mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Left */}
        <span className="text-sm">&copy; {year} MeraRoom. All rights reserved.</span>

        {/* Right */}
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a
            href="#"
            className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            Terms
          </a>
          <a
            href="#"
            className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
