'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ROLES } from '../shared/roles';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Users, 
  Dumbbell, 
  Calendar, 
  CreditCard, 
  User, 
  BarChart2, 
  Settings, 
  Building, 
  Shield, 
  LogOut
} from 'lucide-react';

const Sidebar = ({ role }: { role: string }) => {
  const { logout } = useAuth();
  
  // Common links for all roles
  const common = [{ name: 'Home', path: '/', icon: <Home className="w-5 h-5 mr-2" /> }];

  // Member links
  const member = [
    { name: 'Dashboard', path: '/dashboard/member', icon: <BarChart2 className="w-5 h-5 mr-2" /> },
    { name: 'My Workouts', path: '/dashboard/member/workouts', icon: <Dumbbell className="w-5 h-5 mr-2" /> },
    { name: 'Track Progress', path: '/dashboard/member/progress', icon: <BarChart2 className="w-5 h-5 mr-2" /> },
    { name: 'Appointments', path: '/dashboard/member/appointments', icon: <Calendar className="w-5 h-5 mr-2" /> },
    { name: 'Membership', path: '/dashboard/member/membership', icon: <CreditCard className="w-5 h-5 mr-2" /> },
    { name: 'My Profile', path: '/dashboard/member/profile', icon: <User className="w-5 h-5 mr-2" /> },
  ];

  // Trainer links
  const trainer = [
    { name: 'Dashboard', path: '/dashboard/trainer', icon: <BarChart2 className="w-5 h-5 mr-2" /> },
    { name: 'My Clients', path: '/dashboard/trainer/clients', icon: <Users className="w-5 h-5 mr-2" /> },
    { name: 'Create Plans', path: '/dashboard/trainer/plans', icon: <Dumbbell className="w-5 h-5 mr-2" /> },
    { name: 'Schedule', path: '/dashboard/trainer/schedule', icon: <Calendar className="w-5 h-5 mr-2" /> },
    { name: 'Client Progress', path: '/dashboard/trainer/progress', icon: <BarChart2 className="w-5 h-5 mr-2" /> },
    { name: 'My Profile', path: '/dashboard/trainer/profile', icon: <User className="w-5 h-5 mr-2" /> },
  ];

  // Gym Owner links
  const gymOwner = [
    { name: 'Dashboard', path: '/dashboard/gym-owner', icon: <BarChart2 className="w-5 h-5 mr-2" /> },
    { name: 'Trainers', path: '/dashboard/gym-owner/trainers', icon: <Dumbbell className="w-5 h-5 mr-2" /> },
    { name: 'Members', path: '/dashboard/gym-owner/members', icon: <Users className="w-5 h-5 mr-2" /> },
    { name: 'Analytics', path: '/dashboard/gym-owner/analytics', icon: <BarChart2 className="w-5 h-5 mr-2" /> },
    { name: 'Facilities', path: '/dashboard/gym-owner/facilities', icon: <Building className="w-5 h-5 mr-2" /> },
    { name: 'Profile', path: '/dashboard/gym-owner/profile', icon: <User className="w-5 h-5 mr-2" /> },
    { name: 'Settings', path: '/dashboard/gym-owner/settings', icon: <Settings className="w-5 h-5 mr-2" /> },
  ];

  // Super Admin links
  const admin = [
    { name: 'Dashboard', path: '/dashboard/super-admin', icon: <BarChart2 className="w-5 h-5 mr-2" /> },
    { name: 'Approvals', path: '/dashboard/super-admin/approvals', icon: <Shield className="w-5 h-5 mr-2" /> },
    { name: 'Gym Owners', path: '/dashboard/super-admin/gym-owners', icon: <Building className="w-5 h-5 mr-2" /> },
    { name: 'Analytics', path: '/dashboard/super-admin/analytics', icon: <BarChart2 className="w-5 h-5 mr-2" /> },
    { name: 'Plans', path: '/dashboard/super-admin/plans', icon: <CreditCard className="w-5 h-5 mr-2" /> },
    { name: 'Settings', path: '/dashboard/super-admin/settings', icon: <Settings className="w-5 h-5 mr-2" /> },
  ];

  const getSidebar = () => {
    switch (role) {
      case ROLES.MEMBER: return [...common, ...member];
      case ROLES.TRAINER: return [...common, ...trainer];
      case ROLES.GYM_OWNER: return [...common, ...gymOwner];
      case ROLES.SUPER_ADMIN: return [...common, ...admin];
      default: return common;
    }
  };

  return (
    <div className="min-h-screen w-64 bg-slate-900 text-white p-5">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">GymSync</h2>
        <p className="text-gray-400 text-sm">Fitness Management System</p>
      </div>
      
      <nav>
        <ul className="space-y-1">
          {getSidebar().map((item) => (
            <li key={item.name}>
              <Link 
                href={item.path} 
                className="flex items-center hover:text-blue-400 py-2.5 px-4 rounded hover:bg-slate-800 transition-colors"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto pt-6 border-t border-slate-700 mt-10">
        <button 
          onClick={logout}
          className="flex items-center text-gray-400 hover:text-white py-2.5 px-4 rounded hover:bg-slate-800 transition-colors w-full text-left"
        >
          <LogOut className="w-5 h-5 mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 