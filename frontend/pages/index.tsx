import React, { useState } from 'react';
import Link from "next/link";
import Head from 'next/head';
import { motion } from "framer-motion";
import { Dumbbell, Users, ShieldCheck, UserCog, Calendar, BarChart2, CreditCard, Menu, X } from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.6, ease: "easeOut" }
    })
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <Head>
        <title>GymSync - Your All-in-One Gym Companion</title>
        <meta name="description" content="Manage workouts, track client progress, schedule appointments, and run your gym smoothly — all from one place." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                GymSync
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link 
                href="/"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition"
              >
                Home
              </Link>
              <Link 
                href="/about"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition"
              >
                About
              </Link>
              <Link 
                href="/contact"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition"
              >
                Contact
              </Link>
              <Link 
                href="/dashboard"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition"
              >
                Dashboard
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href="/login?showLogin=true"
                className="text-white bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg shadow transition-colors"
              >
                Log In
              </Link>
              <Link 
                href="/signup"
                className="text-gray-700 dark:text-white bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 px-5 py-2 rounded-lg shadow transition-colors"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white focus:outline-none transition"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4">
              <div className="flex flex-col space-y-3">
                <Link 
                  href="/"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition"
                >
                  Home
                </Link>
                <Link 
                  href="/about"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition"
                >
                  About
                </Link>
                <Link 
                  href="/contact"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition"
                >
                  Contact
                </Link>
                <Link 
                  href="/dashboard"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition"
                >
                  Dashboard
                </Link>
                <div className="border-t border-gray-200 dark:border-slate-800 pt-3 flex flex-col space-y-3">
                  <Link 
                    href="/login?showLogin=true"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition"
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/signup"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium w-full text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 py-20 sm:py-28">
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
                <div className="w-full h-80 bg-white dark:bg-slate-800/50 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden border border-blue-100 dark:border-blue-900">
                  {/* Placeholder for image - in real implementation, use an actual image */}
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
        <section className="py-20 bg-white dark:bg-slate-900">
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
                  className="bg-blue-50 dark:bg-slate-800 p-6 rounded-2xl shadow hover:shadow-xl transition border border-blue-100 dark:border-slate-700"
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

        {/* Feature Highlights Section */}
        <section className="py-20 bg-gray-50 dark:bg-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={0}
              className="text-center mb-16"
            >
              <h3 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                Why Choose <span className="text-blue-600">GymSync</span>?
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Everything you need to manage your fitness journey or business
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Users,
                  title: "Centralized Management",
                  desc: "Manage all users, roles, and permissions from one dashboard."
                },
                {
                  icon: BarChart2,
                  title: "Progress Tracking",
                  desc: "Automated tracking of workouts, attendance, and fitness goals."
                },
                {
                  icon: ShieldCheck,
                  title: "Role-Based Access",
                  desc: "Custom dashboards and insights based on user roles."
                },
                {
                  icon: Dumbbell,
                  title: "Workout Planning",
                  desc: "Create, assign, and monitor personalized workout plans."
                },
                {
                  icon: Calendar,
                  title: "Easy Scheduling",
                  desc: "Book appointments and classes with a simple calendar interface."
                },
                {
                  icon: CreditCard,
                  title: "Membership Management",
                  desc: "Handle subscriptions and renewals with ML-powered insights."
                }
              ].map(({ icon: Icon, title, desc }, index) => (
                <motion.div
                  key={title}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow hover:shadow-xl transition"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  custom={index + 1}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to transform your fitness business?</h2>
              <p className="text-lg mb-8 text-blue-100">
                Join thousands of gyms, trainers, and fitness enthusiasts using GymSync to streamline their operations.
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
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                GymSync
              </span>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300">
                  Terms
                </Link>
                <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300">
                  Privacy
                </Link>
                <Link href="/contact" className="hover:text-gray-700 dark:hover:text-gray-300">
                  Contact
                </Link>
              </div>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white transition">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 dark:border-slate-800 pt-8 text-center text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} GymSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 