import React from 'react';
import Head from 'next/head';
import { motion } from "framer-motion";
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function About() {
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
        <title>About GymSync - Modernizing Fitness Management</title>
        <meta name="description" content="Learn about GymSync's mission to modernize the fitness industry with AI-powered solutions." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="pt-20">
        {/* About Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-slate-800 dark:via-blue-900/20 dark:to-indigo-900/20 transition-colors duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={0}
              className="text-center mb-16"
            >
              <div className="inline-block mb-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                  <span className="mr-2">🏋️‍♂️</span>
                  Our Story
                </span>
              </div>
              <h3 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                About <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">GYMSYNC</span>
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
                GYMSYNC is not just a project — it's a vision to modernize the fitness industry using smart, AI-powered solutions. Developed by a group of MCA students with a strong foundation in computer science and a shared enthusiasm for fitness and technology, GYMSYNC addresses the growing need for automation, personalization, and real-time health insights in gym environments.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={1}
                className="space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900/30"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                    <span className="text-2xl">🔑</span>
                  </div>
                  <h4 className="text-2xl font-semibold text-gray-900 dark:text-white">Key Features</h4>
                </div>
                <ul className="space-y-6">
                  <motion.li 
                    className="flex items-start group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4 group-hover:scale-110 transition-transform">•</span>
                    <div>
                      <strong className="block text-lg font-semibold text-gray-900 dark:text-white mb-1">AI-Driven Health Tracking</strong>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">GYMSYNC uses intelligent algorithms to analyze workout history, vitals, and progress, helping trainers and members make data-driven decisions.</p>
                    </div>
                  </motion.li>
                  <motion.li 
                    className="flex items-start group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4 group-hover:scale-110 transition-transform">•</span>
                    <div>
                      <strong className="block text-lg font-semibold text-gray-900 dark:text-white mb-1">Smartwatch Integration</strong>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Members can sync their wearables to track heart rate, steps, and calories burned. The system uses this data to suggest workouts and monitor hydration and recovery.</p>
                    </div>
                  </motion.li>
                  <motion.li 
                    className="flex items-start group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4 group-hover:scale-110 transition-transform">•</span>
                    <div>
                      <strong className="block text-lg font-semibold text-gray-900 dark:text-white mb-1">Automated Membership Renewal</strong>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">GYMSYNC automatically tracks expiry dates, sends reminders, and processes renewals, reducing manual effort and ensuring a seamless member experience.</p>
                    </div>
                  </motion.li>
                </ul>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={2}
                className="space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900/30"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h4 className="text-2xl font-semibold text-gray-900 dark:text-white">Our Mission</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Our mission with GYMSYNC is to empower gyms and fitness centers to become smarter, more efficient, and member-focused. We believe fitness should be guided by technology — not hindered by outdated systems.
                </p>

                <div className="flex items-center gap-3 mt-8 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white">
                    <span className="text-2xl">👨‍💻</span>
                  </div>
                  <h4 className="text-2xl font-semibold text-gray-900 dark:text-white">About the Team</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  The GYMSYNC project is the result of months of research, collaboration, and hands-on development by MCA students who specialize in software engineering, AI/ML, and cloud-based systems. Our academic background, combined with practical exposure to real-world tech problems, helped us design a system that's not only technically sound but also user-friendly and scalable.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We're proud to present GYMSYNC as a part of our final MCA project and hope it contributes meaningfully to the evolving landscape of digital health and fitness management.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 