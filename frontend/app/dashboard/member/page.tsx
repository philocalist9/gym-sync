"use client";
import React from "react";

export default function MemberDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">💪 Member Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Access your workout plans and track your fitness journey</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card title="🏋️‍♂️ My Workouts" description="View your assigned workout routines" link="/dashboard/member/workouts" bgcolor="bg-blue-50" hoverbg="hover:bg-blue-100" />
          <Card title="📊 Progress Tracker" description="Monitor your fitness achievements" link="/dashboard/member/progress" bgcolor="bg-blue-50" hoverbg="hover:bg-blue-100" />
          <Card title="📅 Appointments" description="Schedule sessions with trainers" link="/dashboard/member/appointments" bgcolor="bg-blue-50" hoverbg="hover:bg-blue-100" />
          <Card title="👤 Profile" description="Manage your personal information" link="/dashboard/member/profile" bgcolor="bg-blue-50" hoverbg="hover:bg-blue-100" />
          <Card title="💳 Membership" description="View your membership details" link="/dashboard/member/membership" bgcolor="bg-blue-50" hoverbg="hover:bg-blue-100" />
          <Card title="💬 Messages" description="Communicate with your trainers" link="/dashboard/member/messages" bgcolor="bg-blue-50" hoverbg="hover:bg-blue-100" />
        </div>
      </main>
    </div>
  );
}

function Card({ 
  title, 
  description, 
  link, 
  bgcolor = "bg-white", 
  hoverbg = "hover:bg-blue-50" 
}: { 
  title: string; 
  description: string; 
  link: string;
  bgcolor?: string;
  hoverbg?: string;
}) {
  const darkHoverBg = hoverbg.includes("green") 
    ? "dark:hover:bg-green-900/20" 
    : hoverbg.includes("purple")
      ? "dark:hover:bg-purple-900/20"
      : "dark:hover:bg-blue-900/20";
  
  return (
    <a 
      href={link}
      className={`${bgcolor} dark:bg-slate-800 shadow-md rounded-2xl p-6 ${hoverbg} ${darkHoverBg} transition transform hover:-translate-y-1 border border-gray-100 dark:border-slate-700 block`}
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </a>
  );
} 