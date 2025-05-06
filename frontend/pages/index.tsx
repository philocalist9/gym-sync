import React, { useState } from 'react';
import Link from "next/link";
import Head from 'next/head';
import { motion } from "framer-motion";
import { Dumbbell, Users, ShieldCheck, UserCog, Calendar, BarChart2, CreditCard } from "lucide-react";
import Navbar from '../components/Navbar';

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.6, ease: "easeOut" }
    })
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Head>
        <title>GymSync - Your All-in-One Gym Companion</title>
        <meta name="description" content="Manage workouts, track client progress, schedule appointments, and run your gym smoothly — all from one place." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 py-20 sm:py-28 transition-colors duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div 
                className="flex-1 text-center lg:text-left"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight text-gray-900 dark:text-white">
                  Your All-in-One <br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Gym Companion
                  </span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl lg:mx-0 mx-auto">
                  Manage workouts, track client progress, schedule appointments, and run your gym smoothly — all from one place.
                </p>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <Link 
                    href="/signup"
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg shadow-lg transition-all transform hover:-translate-y-1"
                  >
                    Get Started Free
                  </Link>
                  <Link 
                    href="/login?showLogin=true"
                    className="w-full md:w-auto bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-800 dark:text-white font-medium px-8 py-3 rounded-lg shadow-lg transition-all transform hover:-translate-y-1"
                  >
                    Log In
                  </Link>
                </div>
              </motion.div>
              <motion.div 
                className="flex-1 mt-8 lg:mt-0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="w-full h-80 bg-white dark:bg-slate-800/50 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden border border-blue-100 dark:border-blue-900 transition-colors duration-300">
                  <img 
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                    alt="Gym management" 
                    className="object-cover w-full h-full"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={0}
              className="text-center mb-16"
            >
              <h3 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Who Uses GymSync?</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Our platform is designed for everyone in the fitness ecosystem
              </p>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {[
                { 
                  icon: Dumbbell, 
                  title: "Members", 
                  desc: "Track workouts & fitness progress with intuitive dashboards."
                },
                { 
                  icon: Users, 
                  title: "Trainers", 
                  desc: "Manage clients, create workout & diet plans efficiently."
                },
                { 
                  icon: UserCog, 
                  title: "Gym Owners", 
                  desc: "Oversee trainers & members, manage facilities in one place."
                },
                { 
                  icon: ShieldCheck, 
                  title: "Super Admins", 
                  desc: "Approve gyms and manage platform access with ease."
                }
              ].map(({ icon: Icon, title, desc }, index) => (
                <motion.div
                  key={title}
                  className="bg-blue-50 dark:bg-slate-800 p-6 rounded-2xl shadow hover:shadow-xl transition-all duration-300 border border-blue-100 dark:border-slate-700"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  custom={index + 1}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mb-4 text-white mx-auto sm:mx-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 dark:bg-slate-800 transition-colors duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={0}
              className="text-center mb-16"
            >
              <h3 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Key Features</h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Everything you need to manage your fitness journey
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Calendar,
                  title: "Smart Scheduling",
                  desc: "Efficiently manage appointments and class schedules"
                },
                {
                  icon: BarChart2,
                  title: "Progress Tracking",
                  desc: "Monitor fitness goals and achievements"
                },
                {
                  icon: CreditCard,
                  title: "Payment Processing",
                  desc: "Secure and seamless payment handling"
                }
              ].map(({ icon: Icon, title, desc }, index) => (
                <motion.div
                  key={title}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-slate-700"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  custom={index + 1}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mb-4 text-white">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">GymSync</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Your all-in-one solution for modern gym management
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-600 dark:text-gray-400">
                  support@gymsync.com
                </li>
                <li className="text-gray-600 dark:text-gray-400">
                  +1 (555) 123-4567
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-slate-800 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} GymSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 