import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { GoogleSignInButton } from "../auth/GoogleSignInButton";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuthStore();

  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "Methods", href: "/methods" },
    { name: "Benefits", href: "/benefits" },
    { name: "FAQ", href: "/faq" },
    { name: "Forum", href: "/discussions" },
    //{ name: "Ebook", href: "/ebook" },
    { name: "Support Us", href: "/donate" },
  ];

  return (
    <header className="relative bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold text-gray-800">
            ZenithMind
          </Link>
          <nav className="hidden md:flex space-x-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-800 font-medium hidden md:block">
                  {user.displayName || "User"}
                </span>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                >
                  <LogOut size={16} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="hidden md:block">
                <GoogleSignInButton />
              </div>
            )}
            <button
              className="md:hidden text-gray-800 hover:text-gray-600 transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden absolute w-full bg-white shadow-lg">
          <div className="px-4 py-2 space-y-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <button
                onClick={signOut}
                className="w-full text-left py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <div className="py-2">
                <GoogleSignInButton />
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};
