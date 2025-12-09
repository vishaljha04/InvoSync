import React, { useEffect, useState } from "react";
import { Briefcase, LogOut, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
const DashboardLayout = ({ children, activeMenu }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(activeMenu || "dashboard");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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
    <div>
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
        <div>
          <Link to="/dashboard" className="">
            <div className="">
              <Briefcase className="" />
            </div>
            {!sideBarCollapsed && <span>Invosync</span>}
          </Link>
        </div>
        <nav></nav>
        <div>
          <button className="" onClick={logout}>
            <LogOut className="" />
            {!sideBarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {isMobile && sideBarOpen && (
        <div
          onClick={() => {
            setSideBarOpen(false);
          }}
        />
      )}

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isMobile ? "ml-10" : sideBarCollapsed ? "ml-16" : "ml-64"
        }]`}
      >
        <header>
          <div className="">
            {isMobile && (
              <button onClick={toggleSideBar} className="">
                {sideBarOpen ? <X className="" /> : <Menu className="" />}
              </button>
            )}
            <div>
              <h1>Welcome back, {user.name}</h1>
              <p className="">Here's your invoice overview</p>
            </div>
          </div>

          <div className=""></div>
        </header>
        <main className="">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
