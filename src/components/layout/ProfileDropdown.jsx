import { ChevronDown, User, LogOut } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyName,
  email,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative select-none">
      {/* Trigger Button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100/60 active:scale-[0.98] transition-all duration-200"
      >
        {/* Avatar */}
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="h-9 w-9 rounded-xl border border-gray-200 object-cover shadow-sm"
          />
        ) : (
          <div className="h-9 w-9 bg-gradient-to-br from-blue-900 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-semibold text-sm">
              {companyName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Name + Email */}
        <div className="hidden sm:flex flex-col text-left leading-tight">
          <p className="text-sm font-semibold text-gray-900">{companyName}</p>
          <p className="text-xs text-gray-500">{email}</p>
        </div>

        {/* Icon */}
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white backdrop-blur-xl rounded-xl shadow-xl shadow-black/5 border border-gray-100 py-2 z-50 animate-fadeSlideDown">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{companyName}</p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>

          {/* Items */}
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-all"
          >
            <User className="h-4 w-4 text-gray-500" />
            View Profile
          </button>

          {/* Logout */}
          <div className="mt-1 border-t border-gray-100">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 transition-all"
            >
              <LogOut className="h-4 w-4 text-red-600" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
