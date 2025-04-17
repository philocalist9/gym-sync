"use client";

import React from 'react';
import Link from 'next/link';

export default function SuperAdminDashboard() {
  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Super Admin Dashboard</h1>
      <p className="mb-4">If you can see this, the routing is working correctly!</p>
      
      <div className="bg-green-100 p-4 rounded-lg mb-6">
        <p className="text-green-800">This is a simplified dashboard for testing purposes.</p>
      </div>
      
      <Link href="/dashboard" className="text-blue-500 hover:underline">
        Back to Main Dashboard
      </Link>
    </div>
  );
}