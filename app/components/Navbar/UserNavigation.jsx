"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  User,
  LogOut,
  ShoppingBag,
  Heart,
  Settings,
  ChevronRight,
  X,
  Mail,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const UserNavigation = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const sidebarRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    // Only add listener when sidebar is open
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleLogout = async (e) => {
    try {
      e.preventDefault();
      await logout();
      setIsSidebarOpen(false);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="h-8 w-8 md:h-6 md:w-6 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  return (
    <>
      {/* User Icon Button - Responsive sizes */}
      <button
        className="flex items-center space-x-1 group relative"
        onClick={(e) => {
          e.stopPropagation();
          setIsSidebarOpen(!isSidebarOpen);
        }}
      >
        <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-black flex items-center justify-center text-white overflow-hidden group-hover:shadow-md transition-all">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-5 w-5 md:h-6 md:w-6" />
          )}
        </div>
      </button>

      <div
        ref={sidebarRef}
        className={`fixed top-0 -right-4 h-full w-[280px] md:w-[380px] bg-white z-[80] 
          transform transition-transform ease-in-out duration-300 ${
            isSidebarOpen ? "" : "translate-x-full"
          }`}
        // style={{right: '6px'}}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            My Account
          </h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 hover:bg-gray-50 rounded-full text-gray-700 transition-colors"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* User Profile Section */}
        {user && (
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-black flex items-center justify-center text-white overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 sm:h-7 sm:w-7" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {user.name || "User"}
                </p>
                {user.email && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-3 w-3 mr-1" />
                    <span className="truncate max-w-[200px]">{user.email}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center text-sm text-gray-500 mt-0.5">
                    <Phone className="h-3 w-3 mr-1" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="py-2">
          {[
            { href: "/profile", icon: User, label: "Profile" },
            { href: "/wishlist", icon: Heart, label: "Wishlist" },
            { href: "/orders", icon: ShoppingBag, label: "Orders" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-4 sm:px-6 py-3 text-sm hover:bg-gray-50 text-gray-700 hover:text-black transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="h-4 w-4 mr-3 text-gray-400" />
              {item.label}
              <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        {user && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white">
            <button
              className="flex items-center w-full px-4 sm:px-6 py-4 text-sm text-black hover:bg-gray-50 font-medium transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Backdrop - Blurred background */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-white/0 backdrop-blur-sm z-[55]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default UserNavigation;
