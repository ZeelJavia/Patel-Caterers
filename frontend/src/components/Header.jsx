import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, LogOut, Download } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { API_BASE_URL } from "../config/api";
import mainLogo from "../assets/main-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, adminEmail, logout } = useAuth();

  const handleDownloadMenu = () => {
    window.open(`${API_BASE_URL}/api/download-menu`, "_blank");
  };

  // Public navigation - no menu generator
  const publicNavigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  // Admin navigation - includes menu generator
  const adminNavigation = [{ name: "Menu Generator", href: "/menu-generator" }];

  const navigation = isAuthenticated
    ? [...publicNavigation, ...adminNavigation]
    : publicNavigation;

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    // Handle menu generator paths
    if (
      path === "/menu-generator" &&
      (location.pathname === "/add-event" ||
        location.pathname.startsWith("/edit-event"))
    )
      return true;
    return false;
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={mainLogo}
              alt="Patel Caterers"
              className="h-15 w-12 rounded-lg shadow-lg p-1 bg-white border-2 border-gray-100"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Patel Caterers
              </h1>
              <p className="text-sm text-gray-600">
                Professional Catering Services
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <nav className="flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-amber-500 text-white shadow-lg"
                      : "text-gray-700 hover:text-amber-600 hover:bg-amber-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Download Menu Button */}
            <button
              onClick={handleDownloadMenu}
              className="flex items-center space-x-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              <span>Download Menu</span>
            </button>

            {/* Auth Button */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <LogIn className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-amber-600 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-amber-500 text-white"
                      : "text-gray-700 hover:text-amber-600 hover:bg-amber-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Download Menu Button */}
              <button
                onClick={() => {
                  handleDownloadMenu();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full px-4 py-3 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-base font-medium"
              >
                <Download className="h-5 w-5" />
                <span>Download Menu</span>
              </button>

              {/* Mobile Auth Button */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        logout();
                        navigate("/");
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-base font-medium"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-base font-medium"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Admin Login</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
