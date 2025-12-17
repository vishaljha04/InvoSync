import React, { useEffect, useState } from "react";
import { Briefcase, LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import { NAVIGATION_MENU } from "../../utils/data";
const DashboardLayout = ({ children, activeMenu }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(activeMenu || "dashboard");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const NavigationItem = ({ item, isActive, onClick, isCollapsed }) => {
    const Icon = item.icon;
    return (
      <div
        onClick={() => onClick(item.id)}
        className={`px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-all duration-200 ${
          isActive ? "bg-blue-100  border-l-4 border-blue-400 " : ""
        } `}
      >
        <Icon className="h-5 w-5 inline-block mr-3" />
        {!isCollapsed && item.name}
      </div>
    );
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSideBarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
    navigate(`/${itemId}`);
    if (isMobile) {
      setSideBarOpen(false);
    }
  };
  const toggleSideBar = () => {
    setSideBarOpen(!sideBarOpen);
  };

  const sideBarCollapsed = !isMobile && false;

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform ${
          isMobile
            ? sideBarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        } 
        ${sideBarCollapsed ? "w-16" : "w-64"} bg-white border-r border-gray-200
      `}
      >
        <div className="flex items-center h-16 border-b border-gray-200 px-6">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            {!sideBarCollapsed && (
              <span className="text-gray-900 font-bold text-medium">
                Invosync
              </span>
            )}
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          {NAVIGATION_MENU.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={activeNavItem === item.id}
              onClick={handleNavigation}
              isCollapsed={sideBarCollapsed}
            />
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
            onClick={logout}
          >
            <LogOut className="h-5 w-5 flex-shrink-0 text-gray-500" />
            {!sideBarCollapsed && <span className="ml-3 ">Logout</span>}
          </button>
        </div>
      </div>

      {isMobile && sideBarOpen && (
        <div
          className="fixed inset-0 bg-black/10 bg-opacity-25 z-40 backdrop-blur-sm"
          onClick={() => {
            setSideBarOpen(false);
          }}
        />
      )}

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isMobile ? "ml-0" : sideBarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={toggleSideBar}
                className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
              >
                {sideBarOpen ? (
                  <X className="h-5 w-5 text-gray-600" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600" />
                )}
              </button>
            )}
            <div className="min-w-0 flex-1">
              {/* Always visible on all screens */}
              <h1 className="text-sm sm:text-base font-semibold text-gray-900">
                Welcome,{" "}
                <span className="text-blue-600">{user.name}</span>
              </h1>

              {/* Different text based on screen size */}
              <p className="text-xs sm:text-sm text-gray-500">
                {/* Mobile: Short version */}
                <span className="sm:hidden">
                  {activeNavItem === "dashboard"
                    ? "Invoice overview"
                    : "Manage"}
                </span>

                {/* Tablet: Medium version */}
                <span className="hidden sm:block md:hidden">
                  {activeNavItem === "dashboard"
                    ? "Invoice dashboard"
                    : `${
                        NAVIGATION_MENU.find(
                          (item) => item.id === activeNavItem
                        )?.name
                      }`}
                </span>

                {/* Desktop: Full version */}
                <span className="hidden md:block">
                  {activeNavItem === "dashboard"
                    ? "Here's your invoice overview"
                    : `Managing ${
                        NAVIGATION_MENU
                          .find((item) => item.id === activeNavItem)
                          ?.name?.toLowerCase() || "content"
                      }`}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <ProfileDropdown
              isOpen={profileDropdownOpen}
              onToggle={(e) => {
                e.stopPropagation();
                setProfileDropdownOpen(!profileDropdownOpen);
              }}
              avatar={user?.avatar || ""}
              companyName={user?.name || ""}
              email={user?.email || ""}
              onLogout={logout}
            />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
