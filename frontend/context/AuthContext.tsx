'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check for stored auth on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        
        // If we're on the login page and already logged in, redirect based on role
        if (typeof window !== 'undefined' && window.location.pathname === '/login') {
          redirectBasedOnRole(parsedUser.role);
        }
      } catch (err) {
        // If there's an error parsing the user, clear localStorage
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Map frontend role names to backend role names
  const mapRole = (role: string) => {
    const roleMap: {[key: string]: string} = {
      "Gym Owner": "gymOwner",
      "Trainer": "trainer", 
      "Member": "member",
      "Super Admin": "superAdmin"
    };
    return roleMap[role] || role;
  };

  const login = async (email: string, password: string, role: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For development without backend, use mock login for superadmin
      if (email === 'admin@gymsync.com' && password === 'admin123') {
        console.log('Logging in as Super Admin');
        
        // Create superadmin user
        const superAdmin = {
          _id: 'admin-id',
          name: 'Super Admin',
          email: 'admin@gymsync.com',
          role: 'superAdmin'
        };
        
        // Generate a simple mock token
        const adminToken = 'admin-token-' + Date.now();
        
        // Store auth data in localStorage
        localStorage.setItem('token', adminToken);
        localStorage.setItem('role', 'superAdmin');
        localStorage.setItem('user', JSON.stringify(superAdmin));
        
        // Set cookies with proper path and expiration
        document.cookie = `token=${adminToken}; path=/; max-age=86400`;
        document.cookie = `role=superAdmin; path=/; max-age=86400`;
        
        // Update state
        setToken(adminToken);
        setUser(superAdmin);
        
        console.log('Super Admin login successful');
        console.log('Redirecting to dashboard in 500ms...');
        
        // Use a longer timeout to ensure everything is set before redirect
        setTimeout(() => {
          document.location.href = 'http://localhost:3000/dashboard/super-admin';
        }, 500);
        
        return;
      }
      
      // For other mock logins in development
      if (process.env.NODE_ENV === 'development' && !email.includes('@gymsync.com')) {
        await mockLogin(email, password, role);
        return;
      }

      // Actual API login
      const response = await api.post('/auth/login', { 
        email, 
        password, 
        role: mapRole(role) // Make sure we're sending the correct role format
      });
      
      const data = response.data;
      
      // Store auth data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Set cookies with proper path and expiration
      document.cookie = `token=${data.token}; path=/; max-age=86400`;
      document.cookie = `role=${data.user.role}; path=/; max-age=86400`;
      
      // Update state
      setToken(data.token);
      setUser(data.user);
      
      console.log('API login successful, redirecting based on role:', data.user.role);
      
      // Redirect based on role with a small delay
      setTimeout(() => {
        redirectBasedOnRole(data.user.role);
      }, 300);
      
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Mock login function for development
  const mockLogin = async (email: string, password: string, role: string) => {
    if (
      (role === 'Member' && email !== 'member@example.com') ||
      (role === 'Trainer' && email !== 'trainer@example.com') ||
      (role === 'Gym Owner' && email !== 'owner@example.com') ||
      (role === 'Super Admin' && email !== 'admin@example.com')
    ) {
      setError(`Invalid email for ${role} role`);
      return;
    }

    if (password !== 'password') {
      setError('Invalid password');
      return;
    }

    // Convert role name to the internal format
    const dbRole = mapRole(role);
    
    // Create mock user and token
    const mockUser = {
      _id: `mock-id-${dbRole}`,
      name: `Mock ${role}`,
      email,
      role: dbRole
    };
    
    const mockToken = `mock-token-${dbRole}`;
    
    // Store in both localStorage and cookies
    localStorage.setItem('token', mockToken);
    localStorage.setItem('role', dbRole); // Explicitly store role
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    // Also set cookies for App Router components
    document.cookie = `token=${mockToken}; path=/; max-age=86400`;
    document.cookie = `role=${dbRole}; path=/; max-age=86400`;
    
    // Update state
    setUser(mockUser);
    setToken(mockToken);
    
    console.log('Mock login successful, user object:', mockUser);
    
    // Use setTimeout for reliability
    setTimeout(() => {
      redirectBasedOnRole(dbRole);
    }, 100);
  };
  
  // Helper function to redirect based on role
  const redirectBasedOnRole = (role: string) => {
    console.log('Redirecting based on role:', role);
    
    // Set a small timeout to ensure state updates have completed
    setTimeout(() => {
      // Use absolute URLs to be more reliable
      switch(role) {
        case 'superAdmin':
          document.location.href = 'http://localhost:3000/dashboard/super-admin';
          break;
        case 'gymOwner':
          document.location.href = 'http://localhost:3000/dashboard/gym-owner';
          break;
        case 'trainer':
          document.location.href = 'http://localhost:3000/dashboard/trainer';
          break;
        case 'member':
          document.location.href = 'http://localhost:3000/dashboard/member';
          break;
        default:
          document.location.href = 'http://localhost:3000/dashboard';
      }
    }, 100);
  };
  
  const logout = () => {
    console.log('Logout function called');
    
    // Clear auth data from both localStorage and cookies
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    console.log('Cleared localStorage items');
    
    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    console.log('Cleared cookies');
    
    setToken(null);
    setUser(null);
    console.log('Reset auth state');
    
    // Redirect to login page
    console.log('Redirecting to login page...');
    window.location.href = '/login';
  };
  
  const register = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/register', userData);
      
      const data = response.data;
      
      // For gym owners, redirect to pending approval page
      if (userData.role === 'gymOwner' || userData.role === 'Gym Owner') {
        window.location.href = '/pending-approval';
      } else {
        // For other users, redirect to login
        window.location.href = '/login';
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const value: AuthContextType = {
    user,
    token,
    isLoading,
    error,
    login,
    logout,
    register
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 