import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import SequenceBuilder from "./components/SequenceBuilder";
import Profile from "./components/Profile";
import Sidebar from "./components/Sidebar";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if token exists on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  // Toggle sidebar for mobile view
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
            }
          />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                <div className="flex flex-col md:flex-row min-h-screen">
                  {/* Overlay for mobile */}
                  <div
                    className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-20 transition-opacity md:hidden ${
                      isSidebarOpen
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                    onClick={handleOverlayClick}
                  ></div>

                  {/* Sidebar */}
                  <div
                    className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:transform-none ${
                      isSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0"
                    }`}
                  >
                    <Sidebar />
                  </div>

                  {/* Main content */}
                  <div className="flex-1 flex flex-col">
                    <header className="bg-white shadow-sm z-10 sticky top-0">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                          <div className="flex items-center">
                            <button
                              className="md:hidden mr-2 p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              onClick={toggleSidebar}
                              aria-label="Toggle menu"
                            >
                              <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 6h16M4 12h16M4 18h16"
                                />
                              </svg>
                            </button>
                            <h1 className="text-xl font-semibold text-indigo-600">
                              Email Marketing
                            </h1>
                          </div>

                          <div className="flex items-center">
                            <div className="relative">
                              <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <span className="sr-only">Open user menu</span>
                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                                  {localStorage.getItem("user")
                                    ? JSON.parse(
                                        localStorage.getItem("user")
                                      ).name?.charAt(0) || "U"
                                    : "U"}
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </header>
                    <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
                      <Dashboard />
                    </main>
                  </div>
                </div>
              }
            />
            <Route
              path="/sequence-builder"
              element={
                <div className="flex flex-col md:flex-row min-h-screen">
                  {/* Overlay for mobile */}
                  <div
                    className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-20 transition-opacity md:hidden ${
                      isSidebarOpen
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                    onClick={handleOverlayClick}
                  ></div>

                  {/* Sidebar */}
                  <div
                    className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:transform-none ${
                      isSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0"
                    }`}
                  >
                    <Sidebar />
                  </div>

                  {/* Main content */}
                  <div className="flex-1 flex flex-col">
                    <header className="bg-white shadow-sm z-10 sticky top-0">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                          <div className="flex items-center">
                            <button
                              className="md:hidden mr-2 p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              onClick={toggleSidebar}
                              aria-label="Toggle menu"
                            >
                              <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 6h16M4 12h16M4 18h16"
                                />
                              </svg>
                            </button>
                            <h1 className="text-xl font-semibold text-indigo-600">
                              Sequence Builder
                            </h1>
                          </div>

                          <div className="flex items-center">
                            <div className="relative">
                              <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <span className="sr-only">Open user menu</span>
                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                                  {localStorage.getItem("user")
                                    ? JSON.parse(
                                        localStorage.getItem("user")
                                      ).name?.charAt(0) || "U"
                                    : "U"}
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </header>
                    <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
                      <SequenceBuilder />
                    </main>
                  </div>
                </div>
              }
            />
            <Route
              path="/profile"
              element={
                <div className="flex flex-col md:flex-row min-h-screen">
                  {/* Overlay for mobile */}
                  <div
                    className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-20 transition-opacity md:hidden ${
                      isSidebarOpen
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                    onClick={handleOverlayClick}
                  ></div>

                  {/* Sidebar */}
                  <div
                    className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:transform-none ${
                      isSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0"
                    }`}
                  >
                    <Sidebar />
                  </div>

                  {/* Main content */}
                  <div className="flex-1 flex flex-col">
                    <header className="bg-white shadow-sm z-10 sticky top-0">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                          <div className="flex items-center">
                            <button
                              className="md:hidden mr-2 p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              onClick={toggleSidebar}
                              aria-label="Toggle menu"
                            >
                              <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 6h16M4 12h16M4 18h16"
                                />
                              </svg>
                            </button>
                            <h1 className="text-xl font-semibold text-indigo-600">
                              Profile
                            </h1>
                          </div>

                          <div className="flex items-center">
                            <div className="relative">
                              <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <span className="sr-only">Open user menu</span>
                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                                  {localStorage.getItem("user")
                                    ? JSON.parse(
                                        localStorage.getItem("user")
                                      ).name?.charAt(0) || "U"
                                    : "U"}
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </header>
                    <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
                      <Profile />
                    </main>
                  </div>
                </div>
              }
            />
          </Route>

          {/* Redirect root to dashboard if authenticated, otherwise to login */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* 404 route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
