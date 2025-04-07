import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600"
      : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <div className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center mr-2">
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-indigo-600">Email Marketing</h2>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
            {localStorage.getItem("user")
              ? JSON.parse(localStorage.getItem("user")).name?.charAt(0) || "U"
              : "U"}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {localStorage.getItem("user")
                ? JSON.parse(localStorage.getItem("user")).name || "User"
                : "User"}
            </p>
            <p className="text-xs text-gray-500">
              {localStorage.getItem("user")
                ? JSON.parse(localStorage.getItem("user")).email ||
                  "user@example.com"
                : "user@example.com"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1 mb-6">
          <Link
            to="/dashboard"
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${isActive(
              "/dashboard"
            )}`}
          >
            <svg
              className="mr-3 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </Link>

          <Link
            to="/sequence-builder"
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${isActive(
              "/sequence-builder"
            )}`}
          >
            <svg
              className="mr-3 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Sequence Builder
          </Link>

          <Link
            to="/profile"
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${isActive(
              "/profile"
            )}`}
          >
            <svg
              className="mr-3 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile
          </Link>
        </div>

        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Flow Components
          </h3>
          <div className="mt-2 space-y-2">
            <div
              className="p-3 bg-blue-50 rounded-lg cursor-move border-2 border-blue-200 hover:border-blue-300 transition-colors duration-200 shadow-sm hover:shadow"
              draggable
              onDragStart={(event) => onDragStart(event, "coldEmail")}
            >
              <div className="flex items-center">
                <div className="p-1.5 bg-blue-100 rounded-md mr-2">
                  <svg
                    className="h-4 w-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-blue-700">Cold Email</h3>
              </div>
              <p className="text-sm text-blue-600 mt-1 ml-6">
                Start a new email sequence
              </p>
            </div>

            <div
              className="p-3 bg-green-50 rounded-lg cursor-move border-2 border-green-200 hover:border-green-300 transition-colors duration-200 shadow-sm hover:shadow"
              draggable
              onDragStart={(event) => onDragStart(event, "waitDelay")}
            >
              <div className="flex items-center">
                <div className="p-1.5 bg-green-100 rounded-md mr-2">
                  <svg
                    className="h-4 w-4 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-green-700">Wait/Delay</h3>
              </div>
              <p className="text-sm text-green-600 mt-1 ml-6">
                Add a time delay
              </p>
            </div>

            <div
              className="p-3 bg-purple-50 rounded-lg cursor-move border-2 border-purple-200 hover:border-purple-300 transition-colors duration-200 shadow-sm hover:shadow"
              draggable
              onDragStart={(event) => onDragStart(event, "leadSource")}
            >
              <div className="flex items-center">
                <div className="p-1.5 bg-purple-100 rounded-md mr-2">
                  <svg
                    className="h-4 w-4 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-purple-700">Lead Source</h3>
              </div>
              <p className="text-sm text-purple-600 mt-1 ml-6">
                Define lead source
              </p>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <svg
            className="mr-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
