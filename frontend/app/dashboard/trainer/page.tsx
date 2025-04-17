"use client";
import React from "react";

export default function TrainerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">👨‍🏫 Trainer Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your clients, create workout plans and schedule sessions</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card title="👥 Clients" description="Manage your client roster" link="/dashboard/trainer/clients" bgcolor="bg-purple-50" hoverbg="hover:bg-purple-100" />
          <Card title="🏋️‍♂️ Workout Plans" description="Create and manage workout plans" link="/dashboard/trainer/workouts" bgcolor="bg-purple-50" hoverbg="hover:bg-purple-100" />
          <Card title="📅 Schedule" description="Manage your training sessions" link="/dashboard/trainer/schedule" bgcolor="bg-purple-50" hoverbg="hover:bg-purple-100" />
          <Card title="📊 Client Progress" description="Track your clients' achievements" link="/dashboard/trainer/progress" bgcolor="bg-purple-50" hoverbg="hover:bg-purple-100" />
          <Card title="💬 Messages" description="Communicate with your clients" link="/dashboard/trainer/messages" bgcolor="bg-purple-50" hoverbg="hover:bg-purple-100" />
          <Card title="👤 Profile" description="Manage your trainer profile" link="/dashboard/trainer/profile" bgcolor="bg-purple-50" hoverbg="hover:bg-purple-100" />
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