import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import axios from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import { parseJwt, getRoleDashboardPath } from '@/utils/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isApproved?: boolean;
  gymName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  error: null
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (token) {
          // Try to verify token with server first
          try {
            const response = await axios.get('/auth/me');
            setUser(response.data);
          } catch (apiErr) {
            // If server verification fails, try to parse token locally
            console.warn('Server auth check failed, parsing token locally:', apiErr);
            const payload = parseJwt(token);
            
            if (payload && payload.userId) {
              // Use minimal data from token payload
              setUser({
                id: payload.userId,
                name: payload.name || 'User',
                email: payload.email || '',
                role: payload.role || 'member',
              });
            } else {
              // Invalid token, clear it
              localStorage.removeItem('token');
              setUser(null);
            }
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      // Get role from either user object or token payload
      const role = user.role || parseJwt(token)?.role || 'member';
      
      // Get correct dashboard path for this role
      const dashboardPath = getRoleDashboardPath(role);
      router.push(dashboardPath);
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      // Gym owners need approval, send them to confirmation page
      if (user.role === 'gym-owner') {
        router.push('/registration-confirmation');
      } else {
        // For other roles, get correct dashboard path
        const dashboardPath = getRoleDashboardPath(user.role);
        router.push(dashboardPath);
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 