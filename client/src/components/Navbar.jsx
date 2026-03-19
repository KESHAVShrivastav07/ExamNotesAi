import React, { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from "motion/react"
import logo from "../assets/logo.png"
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

function Navbar() {
    const { userData } = useSelector((state) => state.user)

    const credits = userData?.credits || 0
    const userInitial = userData?.name?.slice(0,1)?.toUpperCase() || "U"

    const [showCredits, setShowCredits] = useState(false)
    const [showProfile, setShowProfile] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const creditsRef = useRef(null)
    const profileRef = useRef(null)

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (creditsRef.current && !creditsRef.current.contains(e.target)) {
                setShowCredits(false)
            }
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfile(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSignOut = async () => {
        try {
            await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
            dispatch(setUserData(null))
            navigate("/auth")
        } catch (error) {
            console.log(error)
        }
    }

    if (!userData) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className='relative z-20 mx-4 sm:mx-6 mt-4 sm:mt-6
            rounded-2xl
            bg-[rgba(15,15,20,0.88)] backdrop-blur-2xl
            border border-white/[0.08]
            shadow-[0_20px_50px_rgba(0,0,0,0.5)]
            flex items-center justify-between px-5 sm:px-8 py-4'>

            {/* LOGO */}
            <div
                onClick={() => navigate("/")}
                className='flex items-center gap-3 cursor-pointer group'
            >
                <img src={logo} alt="examnotes" className='w-9 h-9 transition-transform group-hover:scale-105' />
                <span className='text-lg hidden md:block font-semibold text-white tracking-tight'>
                    ExamNotes <span className='text-gray-400 font-normal'>AI</span>
                </span>
            </div>

            <div className='flex items-center gap-3 sm:gap-4 relative'>
                {/* THEME TOGGLE */}
                <ThemeToggle />

                {/* CREDITS */}
                <div className='relative' ref={creditsRef}>
                    <motion.div
                        onClick={() => {
                            setShowCredits(!showCredits)
                            setShowProfile(false)
                        }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className='flex items-center gap-2 px-4 py-2 rounded-full
                        bg-white/[0.07] border border-white/[0.1]
                        hover:bg-white/[0.12]
                        text-white text-sm shadow-sm cursor-pointer transition-colors'>

                        <span className='text-base'>💠</span>
                        <span className='font-medium tabular-nums'>{credits}</span>

                        <span className='ml-1 h-5 w-5 flex items-center justify-center
                        rounded-full bg-white/90 text-[10px] font-bold text-black'>
                            +
                        </span>
                    </motion.div>

                    <AnimatePresence>
                    {showCredits && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 8, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className='absolute right-0 mt-2 w-64
                            rounded-2xl bg-[rgba(15,15,20,0.95)] backdrop-blur-2xl
                            border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-5 text-white'>

                            <h4 className='font-semibold text-sm mb-1.5'>Buy Credits</h4>
                            <p className='text-xs text-gray-400 mb-4 leading-relaxed'>
                                Use credits to generate AI notes & PDFs.
                            </p>

                            <button
                                onClick={() => {
                                    setShowCredits(false)
                                    navigate("/pricing")
                                }}
                                className='w-full py-2.5 rounded-xl bg-white text-black text-sm font-semibold
                                hover:bg-gray-100 transition-colors shadow-sm'>
                                Buy More Credits
                            </button>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>

                {/* PROFILE */}
                <div className='relative' ref={profileRef}>
                    <motion.div
                        onClick={() => {
                            setShowProfile(!showProfile)
                            setShowCredits(false)
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        className='flex items-center justify-center w-10 h-10 rounded-full
                        bg-gradient-to-br from-primary-500 to-primary-700
                        text-white cursor-pointer shadow-md
                        hover:shadow-primary-500/25 transition-shadow'>

                        <span className='text-sm font-semibold'>{userInitial}</span>
                    </motion.div>

                    <AnimatePresence>
                    {showProfile && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 8, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className='absolute right-0 mt-2 w-48
                            rounded-2xl bg-[rgba(15,15,20,0.95)] backdrop-blur-2xl
                            border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-2 text-white'>

                            <MenuItem
                                text="History"
                                onClick={() => {
                                    setShowProfile(false)
                                    navigate("/history")
                                }}
                            />

                            <MenuItem
                                text="Code Playground"
                                onClick={() => {
                                    setShowProfile(false)
                                    navigate("/playground")
                                }}
                            />

                            <div className="h-px bg-white/[0.06] my-1" />

                            <MenuItem
                                text="Sign Out"
                                red
                                onClick={handleSignOut}
                            />
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>

            </div>
        </motion.div>
    )
}

/* MENU ITEM */
function MenuItem({ onClick, text, red }) {
    return (
        <div
            onClick={onClick}
            className={`px-4 py-2.5 text-sm rounded-xl cursor-pointer transition-colors
            ${red
                ? "text-red-400 hover:bg-red-500/10"
                : "text-gray-200 hover:bg-white/[0.07]"
            }`}>
            {text}
        </div>
    )
}

export default Navbar
