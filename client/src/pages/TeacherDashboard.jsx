import React, { useState } from "react";
import { motion } from "motion/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLogOut } from "react-icons/fi";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import TeacherSidebar from "../components/TeacherSidebar";
import DashboardHome from "../components/teacher/DashboardHome";
import UploadNotes from "../components/teacher/UploadNotes";
import ManageSubjects from "../components/teacher/ManageSubjects";
import MyUploads from "../components/teacher/MyUploads";
import ManageTests from "../components/teacher/ManageTests";
import Footer from "../components/Footer";

function TeacherDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true });
      dispatch(setUserData(null));
      navigate("/teacher/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardHome userData={userData} setActiveSection={setActiveSection} />;
      case "upload":
        return <UploadNotes />;
      case "subjects":
        return <ManageSubjects />;
      case "uploads":
        return <MyUploads />;
      case "tests":
        return <ManageTests />;
      default:
        return <DashboardHome userData={userData} setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden transition-colors duration-500">
      {/* Sidebar */}
      <TeacherSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-white/[0.05]">
          <div className="flex items-center justify-between px-6 md:px-10 py-4">
            <div className="pl-12 md:pl-0">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight capitalize">
                {activeSection === "dashboard"
                  ? "Dashboard"
                  : activeSection === "upload"
                  ? "Upload Notes"
                  : activeSection === "subjects"
                  ? "Manage Subjects"
                  : activeSection === "tests"
                  ? "Mock Test Series"
                  : "My Uploads"}
              </h1>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
                Welcome back, {userData?.name?.split(" ")[0] || "Teacher"}
              </p>
            </div>

            {/* Profile badge & Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{userData?.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{userData?.email}</p>
              </div>
              <div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700
                  flex items-center justify-center text-white font-semibold text-sm shadow-md"
              >
                {userData?.name?.charAt(0)?.toUpperCase() || "T"}
              </div>
              <div className="h-8 w-px bg-gray-200 dark:bg-white/[0.05] mx-1 hidden sm:block" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400
                  hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                title="Sign Out"
              >
                <FiLogOut className="text-lg" />
                <span className="hidden lg:block">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="p-6 md:p-10"
        >
          {renderContent()}
        </motion.div>
        
        <div className="px-6 md:px-10 pb-10">
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default TeacherDashboard;
