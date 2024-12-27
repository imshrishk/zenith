import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "./Button";
import { useAuthStore } from "../../store/authStore";
import { GoogleSignInButton } from "../auth/GoogleSignInButton";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuthStore();

  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "Methods", href: "/methods" },
    { name: "Benefits", href: "/benefits" },
    //{ name: "Q&A", href: "/qna" },
    { name: "FAQ", href: "/faq" },
    { name: "Discussions", href: "/discussions" },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-gray-800">
            ZenithMind
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-4">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-600 hover:text-gray-800"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Controls */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-800 font-medium">
                  {user.displayName || "User"}
                </span>
                <Button onClick={signOut}>
                  <LogOut size={16} />
                  Logout
                </Button>
              </>
            ) : (
              <GoogleSignInButton />
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-gray-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white shadow-lg">
          <ul className="space-y-2 p-4">
            {navigationLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  className="block text-gray-600 hover:text-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {user ? (
              <li>
                <button
                  onClick={signOut}
                  className="w-full text-left text-gray-600 hover:text-gray-800"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <GoogleSignInButton />
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};