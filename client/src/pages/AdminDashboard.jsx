import React, { useEffect, useState } from 'react'
import axios from "axios"
import { serverUrl } from '../App'
import { motion, AnimatePresence } from "motion/react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUserData } from "../redux/userSlice"
import { FiUsers, FiFileText, FiDownload, FiLogOut } from "react-icons/fi"
import Footer from "../components/Footer"

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [allTests, setAllTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          navigate("/admin/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const [usersRes, teachersRes, notesRes, testResultsRes, testsRes] = await Promise.all([
          axios.get(`${serverUrl}/api/admin/users`, { headers }),
          axios.get(`${serverUrl}/api/admin/teachers`, { headers }),
          axios.get(`${serverUrl}/api/admin/notes`, { headers }),
          axios.get(`${serverUrl}/api/tests/results/all`, { headers, withCredentials: true }),
          axios.get(`${serverUrl}/api/tests`, { headers, withCredentials: true })
        ]);

        setUsers(usersRes.data);
        setTeachers(teachersRes.data);
        setNotes(notesRes.data);
        setTestResults(testResultsRes.data);
        setAllTests(testsRes.data);

      } catch (error) {
        console.error("Failed to fetch admin data", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = () => {
    // Task 3: Fix Logout Flow - Redirect immediately
    localStorage.removeItem("adminToken");
    dispatch(setUserData(null)); // Clear Redux state
    navigate("/admin/login");
  };

  const downloadPdf = async (noteId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${serverUrl}/api/pdf/generate-pdf/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `note-${noteId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Failed to download PDF", error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-500'>
      {/* Header */}
      <header className='bg-white dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/[0.05] sticky top-0 z-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-950 font-bold text-sm'>
              A
            </div>
            <h1 className='text-lg font-bold tracking-tight text-gray-900 dark:text-white'>Admin Dashboard</h1>
          </div>
            <button
            onClick={handleLogout}
            className='text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10'
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 py-8'>
        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-8'>
          <StatCard icon={<FiUsers />} title="Total Users" value={users.length} color="blue" onClick={() => setActiveTab("users")} />
          <StatCard icon={<FiUsers />} title="Total Teachers" value={teachers.length} color="emerald" onClick={() => setActiveTab("teachers")} />
          <StatCard icon={<FiFileText />} title="Notes Generated" value={notes.length} color="purple" onClick={() => setActiveTab("notes")} />
        </div>

        {/* Content Area */}
        <div className='bg-white dark:bg-slate-900/40 rounded-2xl border border-gray-200 dark:border-white/[0.08] shadow-sm overflow-hidden'>
          {/* Tabs */}
          <div className='flex border-b border-gray-100 dark:border-white/[0.05] px-4'>
            <Tab
              active={activeTab === "users"}
              onClick={() => setActiveTab("users")}
              label="Users"
              count={users.length}
            />
            <Tab
              active={activeTab === "teachers"}
              onClick={() => setActiveTab("teachers")}
              label="Teachers"
              count={teachers.length}
            />
            <Tab
              active={activeTab === "notes"}
              onClick={() => setActiveTab("notes")}
              label="Generated Notes"
              count={notes.length}
            />
            <Tab
              active={activeTab === "allTests"}
              onClick={() => setActiveTab("allTests")}
              label="Mock Tests"
              count={allTests.length}
            />
            <Tab
              active={activeTab === "tests"}
              onClick={() => setActiveTab("tests")}
              label="Test Results"
              count={testResults.length}
            />
          </div>

          {/* List Area */}
          <div className='p-6'>
            {loading ? (
              <div className='flex justify-center py-20 text-gray-400'>
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                >
                  Loading data...
                </motion.div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "users" && <EntityList entities={users} type="user" />}
                  {activeTab === "teachers" && <EntityList entities={teachers} type="teacher" />}
                  {activeTab === "notes" && <NotesList notes={notes} downloadPdf={downloadPdf} />}
                  {activeTab === "allTests" && <AllTestsList tests={allTests} />}
                  {activeTab === "tests" && <TestResultsList results={testResults} />}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <Footer />
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, color, onClick }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100"
  };

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`bg-white dark:bg-slate-900/40 rounded-2xl border border-gray-200 dark:border-white/[0.08] p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-all duration-300 ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl border dark:border-white/[0.05] ${colors[color]} transition-colors duration-300`}>
        {icon}
      </div>
      <div>
        <p className='text-sm text-gray-500 dark:text-gray-400 font-medium mb-1'>{title}</p>
        <p className='text-2xl font-bold text-gray-900 dark:text-white tracking-tight'>{value}</p>
      </div>
    </motion.div>
  )
}

function Tab({ active, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-6 py-4 text-sm font-medium transition-all duration-300 flex items-center gap-2
        ${active ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.05]"}`}
    >
      {label}
      <span className={`px-2 py-0.5 rounded-full text-xs transition-colors duration-300 ${active ? "bg-gray-100 text-gray-900" : "bg-gray-50 text-gray-400"}`}>
        {count}
      </span>
      {active && (
        <motion.div
            layoutId="activeTabBadge"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"
        />
      )}
    </button>
  )
}

function EntityList({ entities, type }) {
  if (entities.length === 0) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400 italic">No {type}s found.</div>;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {entities.map(entity => (
        <motion.div 
          key={entity._id} 
          whileHover={{ y: -4, scale: 1.05 }}
          className='p-4 rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50/50 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:border-gray-200 dark:hover:border-white/[0.1] transition-all duration-300 cursor-default'
        >
          <div className='flex justify-between items-start mb-2'>
            <h3 className='font-semibold text-gray-900 truncate pr-4'>{entity.name}</h3>
            {type === "user" && (
              <span className='px-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/[0.05] text-xs font-semibold tabular-nums shadow-sm text-gray-700 dark:text-gray-300'>
                {entity.credits} 💠
              </span>
            )}
          </div>
          <p className='text-sm text-gray-500 truncate'>{entity.email}</p>
          <div className='mt-4 pt-4 border-t border-gray-200 dark:border-white/[0.05] flex justify-between text-xs text-gray-400 dark:text-gray-500'>
            <span>Joined: {new Date(entity.createdAt).toLocaleDateString()}</span>
            <span>{entity.notes?.length || 0} Notes</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function NotesList({ notes, downloadPdf }) {
  if (notes.length === 0) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400 italic">No notes found.</div>;
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
      {notes.map(note => (
        <motion.div 
          key={note._id} 
          whileHover={{ x: 4, scale: 1.02 }}
          className='p-5 rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50/50 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:border-gray-200 dark:hover:border-white/[0.1] transition-all duration-300 flex flex-col sm:flex-row gap-4 justify-between sm:items-center'
        >
          <div>
            <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{note.topic}</h3>
            <div className='flex flex-wrap gap-2 text-xs'>
              {note.classLevel && <span className='text-primary-600 bg-primary-50 px-2 py-0.5 rounded'>{note.classLevel}</span>}
              {note.examType && <span className='text-purple-600 bg-purple-50 px-2 py-0.5 rounded'>{note.examType}</span>}
              <span className='text-gray-500'>{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <button
            onClick={() => downloadPdf(note._id)}
            className='flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-white/[0.1] text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all duration-300 shadow-sm whitespace-nowrap'
          >
            <FiDownload /> PDF
          </button>
        </motion.div>
      ))}
    </div>
  )
}

function TestResultsList({ results }) {
  if (results.length === 0) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400 italic">No test results found.</div>;
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-left text-sm'>
        <thead className='bg-gray-50 dark:bg-slate-800/50 text-gray-400 font-bold uppercase tracking-wider text-[10px]'>
          <tr>
            <th className="px-6 py-4">Student</th>
            <th className="px-6 py-4">Test</th>
            <th className="px-6 py-4 text-center">Score</th>
            <th className="px-6 py-4 text-center">Accuracy</th>
            <th className="px-6 py-4 text-right tabular-nums">Date</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-50 dark:divide-white/[0.05]'>
          {results.map((r, i) => (
            <tr key={i} className='hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors'>
              <td className='px-6 py-4'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs'>
                    {r.studentId?.name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <p className='font-bold text-gray-900 dark:text-white'>{r.studentId?.name}</p>
                    <p className='text-[10px] text-gray-400'>{r.studentId?.email}</p>
                  </div>
                </div>
              </td>
              <td className='px-6 py-4'>
                <p className='font-bold text-gray-700 dark:text-gray-300'>{r.testId?.title}</p>
                <p className='text-[10px] text-gray-400 uppercase tracking-widest'>{r.testId?.companyName}</p>
              </td>
              <td className='px-6 py-4 text-center font-bold text-gray-600 dark:text-gray-400 tabular-nums'>
                {r.score} / {r.totalQuestions}
              </td>
              <td className='px-6 py-4 text-center'>
                <span className={`px-2 py-1 rounded-lg font-bold text-[11px] ${
                  r.accuracy >= 80 ? 'bg-emerald-50 text-emerald-600' : 
                  r.accuracy >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                }`}>
                  {r.accuracy.toFixed(0)}%
                </span>
              </td>
              <td className='px-6 py-4 text-right text-gray-400 text-xs tabular-nums text-nowrap'>
                {new Date(r.submittedAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AllTestsList({ tests }) {
  if (!tests || tests.length === 0) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400 italic">No tests found.</div>;
  }

  // TASK 4: Group only by company: TCS / Infosys / Wipro
  const companies = ['TCS', 'Infosys', 'Wipro', 'Other'];
  
  return (
    <div className='flex flex-col gap-8'>
      {companies.map(company => {
        const companyTests = tests.filter(t => t.companyName === company);
        if (companyTests.length === 0) return null;

        return (
          <div key={company} className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/[0.05] pb-2">
              {company} Series
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {companyTests.map(test => (
                <motion.div 
                  key={test._id} 
                  whileHover={{ y: -4, scale: 1.02 }}
                  className='p-5 rounded-xl border border-gray-100 dark:border-white/[0.05] bg-gray-50/50 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:border-gray-200 dark:hover:border-white/[0.1] transition-all duration-300'
                >
                  <div className='flex justify-between items-start mb-3'>
                    <h4 className='font-bold text-gray-900 dark:text-white leading-tight'>{test.title}</h4>
                  </div>
                  <p className='text-xs text-gray-500 line-clamp-2 mb-4'>{test.description}</p>
                  
                  <div className='text-[10px] text-gray-400 font-semibold uppercase tracking-widest flex justify-between items-center'>
                    <span>{test.questions?.length || 0} Questions</span>
                    <span>{new Date(test.testDate).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AdminDashboard
