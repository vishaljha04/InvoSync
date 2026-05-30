import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Menu, X } from "lucide-react";
import ProfileDropdown from "../layout/ProfileDropdown";
import { useAuth } from "../../context/AuthContext";

const Button = ({
  varient = "primary",
  size = "medium",
  isLoading = false,
  children,
  icon: Icon,
  className = "",
  type = "button",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const varientClasses = {
    primary: "bg-blue-900 hover:bg-blue-800 active:bg-blue-900 text-white",
    secondary:
      "bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300",
    ghost:
      "bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-700",
  };

  const sizeClasses = {
    small: "px-3 py-1 h-8 text-sm gap-1",
    medium: "px-4 py-2 h-10 text-sm gap-2",
    large: "px-6 py-3 h-12 text-base gap-3",
  };

  // Calculate icon size based on button size
  const iconSize = {
    small: "w-3.5 h-3.5",
    medium: "w-4 h-4",
    large: "w-5 h-5",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${varientClasses[varient]} ${sizeClasses[size]} ${className}`}
      disabled={isLoading || props.disabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2
            className={`${iconSize[size]} animate-spin`}
            aria-hidden="true"
          />
          {children && <span className="ml-2">{children}</span>}
        </>
      ) : (
        <>
          {Icon && <Icon className={iconSize[size]} aria-hidden="true" />}
          {children}
        </>
      )}
    </button>
  );
};

const Headers = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setProfileDropdownOpen(false);
    };

    if (profileDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-white/0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Invosync</span>
          </div>

          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-200 hover:after:w-full"
            >
              Testimonials
            </a>

            <a
              href="#feature"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-200 hover:after:w-full"
            >
              Feature
            </a>

            <a
              href="#faq"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-200 hover:after:w-full"
            >
              FAQ
            </a>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onToggle={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }}
                avatar={user?.avatar || ""}
                companyName={user?.name}
                email={user?.email}
                onLogout={logout}
              />
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-black font-medium border px-4 py-1.5 rounded-lg hover:bg-gray-100 transition-all"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-900 to-blue-950 text-white px-4 py-1.5 rounded-lg font-medium transition-all hover:scale-105 hover:shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              className="p-2 rounded-lg text-gray-600
             hover:text-gray-900 hover:bg-gray-100
             focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2
             transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full px-5 py-4 bg-white shadow-lg border-t border-gray-100 animate-slideDown z-40">
          <div className="flex flex-col space-y-4">
            {/* Nav Links */}
            <a
              href="#feature"
              className="text-gray-700 text-base font-medium hover:text-blue-900 transition-all"
            >
              Features
            </a>

            <a
              href="#testimonials"
              className="text-gray-700 text-base font-medium hover:text-blue-900 transition-all"
            >
              Testimonials
            </a>

            <a
              href="#faqs"
              className="text-gray-700 text-base font-medium hover:text-blue-900 transition-all"
            >
              FAQ
            </a>

            <div className="border-t border-gray-200 pt-4"></div>

            {/* Auth Section */}
            {isAuthenticated ? (
              <Button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-gradient-to-r from-blue-900 to-blue-950 text-white py-2.5 rounded-lg font-medium hover:brightness-110 transition-all"
              >
                Go to Dashboard
              </Button>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  to="/login"
                  className="w-full text-gray-900 border border-gray-300 py-2.5 rounded-lg text-center font-medium hover:bg-gray-100 transition-all"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="w-full bg-blue-900 text-white py-2.5 rounded-lg text-center font-medium hover:bg-blue-800 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Headers;
