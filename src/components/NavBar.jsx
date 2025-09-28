import { useEffect, useState } from "react";
import { BsFillMoonStarsFill } from "react-icons/bs";

export const Navbar = () => {
  // Always start in light mode unless localStorage explicitly says "dark"
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark"; // only true if user picked dark before
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="fixed top-0 w-full z-40 bg-[#92B6B1] dark:bg-[#1a1f2b] backdrop-blur-lg border-b border-white/10 shadow-lg hover-feature">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 ">
          {/* Brand */}
          <a href="#home" className="font-mono text-xl font-bold text-black dark:text-white">
            Signify
          </a>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(d => !d)}
            aria-label="Toggle dark mode"
            title={darkMode ? "Switch to light" : "Switch to dark"}
            className="p-2 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <BsFillMoonStarsFill className="text-2xl text-black dark:text-white" />
          </button>

          {/* Links */}
          <div className="flex space-x-8">
            <a href="#home" className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Home
            </a>
            <a href="#about" className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              About
            </a>
            <a href="#project" className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Interpret
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
