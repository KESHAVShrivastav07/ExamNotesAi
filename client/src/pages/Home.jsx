import React from 'react'
import Navbar from '../components/Navbar'
import { motion } from "motion/react"
import img from "../assets/img1.png"
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  return (
    <div className='min-h-screen overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-black dark:text-white transition-colors duration-500'>
      <Navbar />

      {/* Hero Section */}
      <section className='max-w-7xl mx-auto px-6 sm:px-8 pt-24 sm:pt-32 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center'>
        <div>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight
                bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900
                dark:from-white dark:via-gray-300 dark:to-white
                bg-clip-text text-transparent"
            >
              Create Smart <br /> AI Notes in Seconds
            </motion.h1>

            <motion.p
              className='mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-gray-500 dark:text-gray-400'
            >
              Generate exam-focused notes, project documentation,
              flow diagrams and revision-ready content using AI —
              faster, cleaner and smarter.
            </motion.p>

          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => navigate("/notes")}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className='mt-10 px-10 py-3.5 rounded-xl
              flex items-center gap-3
              bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
              border border-white/10
              text-white font-semibold text-base
              shadow-[0_15px_40px_rgba(0,0,0,0.35)]
              hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]
              transition-shadow'>
            Get Started
            <span className="text-lg">→</span>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="transform-gpu"
        >
          <div className='rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.12)]'>
            <img src={img} alt="ExamNotes AI preview" className="w-full" />
          </div>
        </motion.div>
      </section>

      <section className='max-w-6xl mx-auto px-6 sm:px-8 py-20 sm:py-28'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Everything you need to ace your exams
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
            Powered by AI to help you study smarter, not harder.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5'>
          <Feature 
            icon="📘" title="Exam Notes" des="High-yield exam-oriented notes with revision points." delay={0} 
            onClick={() => navigate("/notes")}
          />
          <Feature 
            icon="📂" title="Project Notes" des="Well-structured content for assignments and projects." delay={0.1} 
            onClick={() => navigate("/notes")}
          />
          <Feature 
            icon="📊" title="Diagrams" des="Auto-generated visual diagrams for clarity." delay={0.2} 
            onClick={() => navigate("/notes")}
          />
          <Feature 
            icon="⬇️" title="PDF Download" des="Download clean, printable PDFs instantly." delay={0.3} 
            onClick={() => navigate("/history")}
          />
        </div>

        {/* Specialized Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 mb-10 text-center"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Focus Areas</h2>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
          <Feature 
            icon="💻" title="DSA" des="Data Structures & Algorithms master notes." delay={0.5} 
            onClick={() => navigate("/notes/dsa")}
          />
          <Feature 
            icon="🧩" title="OOPS" des="Object Oriented Programming fundamentals." delay={0.6} 
            onClick={() => navigate("/notes/oops")}
          />
          <Feature 
            icon="🗄️" title="DBMS" des="Database management system core concepts." delay={0.7} 
            onClick={() => navigate("/notes/dbms")}
          />
          <Feature 
            icon="🎓" title="Placement" des="Complete placement preparation materials." delay={0.8} 
            onClick={() => navigate("/notes/placement")}
          />
        </div>

        {/* Company Mock Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-20 mb-10 text-center"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Company Mock Series</h2>
        </motion.div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <Feature 
            icon="🏢" title="TCS NQT" des="Standard TCS pattern mock tests." delay={0.2} 
            onClick={() => navigate("/tests?company=TCS")}
          />
          <Feature 
            icon="💠" title="Infosys" des="Logical & analytical reasoning series." delay={0.3} 
            onClick={() => navigate("/tests?company=Infosys")}
          />
          <Feature 
            icon="🌀" title="Wipro" des="Wipro NLTH specific preparation." delay={0.4} 
            onClick={() => navigate("/tests?company=Wipro")}
          />
          <Feature 
            icon="📈" title="Analytics" des="Check your test performance trends." delay={0.5} 
            onClick={() => navigate("/performance")}
          />
          <Feature 
            icon="💻" title="Code Playground" des="Practice algorithms in our Monaco editor." delay={0.6} 
            onClick={() => navigate("/playground")}
          />
        </div>
      </section>

      <Footer />
    </div>
  )
}

function Feature({ icon, title, des, delay = 0, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={onClick}
      className={`relative rounded-2xl p-6
        bg-gradient-to-br from-[rgba(15,15,20,0.92)] to-[rgba(25,25,35,0.88)]
        backdrop-blur-2xl
        border border-white/[0.06]
        shadow-[0_20px_50px_rgba(0,0,0,0.4)]
        hover:shadow-[0_25px_60px_rgba(0,0,0,0.5)]
        hover:border-white/[0.12]
        transition-all duration-150
        text-white
        ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className='text-3xl mb-4'>{icon}</div>
      <h3 className="text-base font-semibold mb-2 tracking-tight">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{des}</p>
    </motion.div>
  )
}

export default Home
