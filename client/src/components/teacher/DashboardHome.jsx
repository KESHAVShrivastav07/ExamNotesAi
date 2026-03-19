import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { FiUpload, FiBookOpen, FiFileText, FiGrid } from "react-icons/fi";
import axios from "axios";
import { serverUrl } from "../../App";

const SECTIONS = [
  { name: "Placement", emoji: "🎯", color: "bg-blue-50 text-blue-600 border-blue-100" },
  { name: "OOPS", emoji: "🧩", color: "bg-purple-50 text-purple-600 border-purple-100" },
  { name: "DSA", emoji: "🔢", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { name: "DBMS", emoji: "🗄️", color: "bg-amber-50 text-amber-600 border-amber-100" },
];

function DashboardHome({ userData, setActiveSection }) {
  const [stats, setStats] = useState({
    totalUploads: 0,
    totalSubjects: 0,
    sections: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(serverUrl + "/api/stats", {
          withCredentials: true,
        });
        setStats(res.data);
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Uploads",
      value: stats.totalUploads,
      icon: <FiFileText />,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Subjects",
      value: stats.totalSubjects,
      icon: <FiBookOpen />,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      title: "Sections",
      value: SECTIONS.length,
      icon: <FiGrid />,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back, {userData?.name?.split(" ")[0] || "Teacher"} 👋
        </h2>
        <p className="mt-2 text-primary-100 text-sm max-w-md">
          Manage your notes, subjects, and uploads from your personalized dashboard.
        </p>
        <button
          onClick={() => setActiveSection("upload")}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary-700
            rounded-xl text-sm font-semibold shadow-sm hover:bg-primary-50 transition-colors"
        >
          <FiUpload /> Upload New Notes
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {statCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 flex items-center gap-5"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border ${card.color}`}
            >
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">
                {loading ? "—" : card.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sections */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Sections</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SECTIONS.map((section, i) => {
            const count =
              stats.sections.find((s) => s._id === section.name)?.count || 0;
            return (
              <motion.div
                key={section.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                className={`rounded-2xl border p-5 ${section.color} bg-opacity-40
                  hover:shadow-md transition-shadow cursor-default`}
              >
                <span className="text-2xl">{section.emoji}</span>
                <h4 className="mt-3 font-semibold text-sm">{section.name}</h4>
                <p className="text-xs mt-1 opacity-70">{count} note{count !== 1 ? "s" : ""}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
