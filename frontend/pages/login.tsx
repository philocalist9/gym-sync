import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { ROLES } from "../shared/roles";

const roles = ["Member", "Trainer", "Gym Owner", "Super Admin"];

export default function Login() {
  const router = useRouter();
  const { login, isLoading, error: authError } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "Super Admin", // Default to Super Admin for easy testing
  });
  const [error, setError] = useState("");

  // Helper function to redirect based on role
  const redirectToDashboard = (role: string) => {
    console.log('Direct redirect based on role:', role);
    
    // Use relative paths for better compatibility
    switch(role) {
      case 'superAdmin':
        document.location.href = '/dashboard/super-admin';
        break;
      case 'gymOwner':
        document.location.href = '/dashboard/gym-owner';
        break;
      case 'trainer':
        document.location.href = '/dashboard/trainer';
        break;
      case 'member':
        document.location.href = '/dashboard/member';
        break;
      default:
        document.location.href = '/';
    }
  };

  // Check for existing login and redirect if needed
  useEffect(() => {
    // Check if this is a fresh login request by URL parameter
    const isShowLogin = router.query.showLogin === 'true';
    
    // Skip redirect if the showLogin parameter is present
    if (isShowLogin) {
      console.log('Showing login page as requested by URL parameter');
      return;
    }
    
    // Check if user is already logged in
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log('User already logged in:', user);
        redirectToDashboard(user.role);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [router.query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log("Login attempt with:", form.email, "as", form.role);
    
    // Direct login for Super Admin
    if (form.email === "admin@gymsync.com" && form.password === "admin123" && form.role === "Super Admin") {
      console.log("Using Super Admin credentials with direct redirect");
      
      // Create superadmin user
      const superAdmin = {
        _id: 'admin-id',
        name: 'Super Admin',
        email: 'admin@gymsync.com',
        role: 'superAdmin'
      };
      
      // Store auth data - be thorough to avoid missing data
      localStorage.setItem('token', 'admin-token');
      localStorage.setItem('role', 'superAdmin'); // Store role separately too
      localStorage.setItem('user', JSON.stringify(superAdmin));
      
      // Set cookies for App Router components
      document.cookie = `token=admin-token; path=/; max-age=86400`;
      document.cookie = `role=superAdmin; path=/; max-age=86400`;
      
      console.log("Stored admin user:", superAdmin);
      console.log("Setting cookies and localStorage complete");
      
      // Set a delay to ensure storage is complete
      setTimeout(() => {
        // Use direct location change for most reliable navigation
        console.log("Redirecting to super admin dashboard...");
        document.location.href = '/dashboard/super-admin';
      }, 300); // Longer delay for more reliability
      return;
    }
    
    // Mock login for example accounts
    if (process.env.NODE_ENV === 'development') {
      if (
        (form.role === 'Member' && form.email === 'member@example.com') ||
        (form.role === 'Trainer' && form.email === 'trainer@example.com') ||
        (form.role === 'Gym Owner' && form.email === 'owner@example.com') ||
        (form.role === 'Super Admin' && form.email === 'admin@example.com')
      ) {
        if (form.password === 'password') {
          // Map role
          const roleMap = {
            "Gym Owner": "gymOwner",
            "Trainer": "trainer", 
            "Member": "member",
            "Super Admin": "superAdmin"
          };
          const dbRole = roleMap[form.role] || form.role;
          
          // Create mock user and token
          const mockUser = {
            _id: `mock-id-${dbRole}`,
            name: `Mock ${form.role}`,
            email: form.email,
            role: dbRole
          };
          
          const mockToken = `mock-token-${dbRole}`;
          
          // Store in both localStorage and cookies
          localStorage.setItem('token', mockToken);
          localStorage.setItem('role', dbRole); // Store role separately too
          localStorage.setItem('user', JSON.stringify(mockUser));
          
          // Set cookies for App Router components
          document.cookie = `token=${mockToken}; path=/; max-age=86400`;
          document.cookie = `role=${dbRole}; path=/; max-age=86400`;
          
          console.log("Using mock login with direct redirect to:", dbRole);
          console.log("Stored user:", mockUser);
          console.log("Setting cookies and localStorage complete");
          
          // Set a delay to ensure storage is complete
          setTimeout(() => {
            // Direct navigation based on role
            if (dbRole === 'superAdmin') {
              document.location.href = '/dashboard/super-admin';
            } else if (dbRole === 'gymOwner') {
              document.location.href = '/dashboard/gym-owner';
            } else if (dbRole === 'trainer') {
              document.location.href = '/dashboard/trainer';
            } else if (dbRole === 'member') {
              document.location.href = '/dashboard/member';
            }
          }, 300); // Longer delay for more reliability
          return;
        } else {
          setError('Invalid password');
          return;
        }
      }
    }
    
    // Use the context login for other cases
    try {
      await login(form.email, form.password, form.role);
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Login to GymSync</h2>

        {(error || authError) && <p className="text-red-500 mb-4 text-sm text-center">{error || authError}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            {roles.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>

          {form.role === "Gym Owner" && (
            <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
              <p>Note: Gym owners require approval by a Super Admin before being able to log in.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold disabled:opacity-70"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 font-medium hover:underline">
            Register Gym
          </Link>
        </p>

        <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
          <p className="font-semibold mb-1">Super Admin account:</p>
          <div>
            <p className="font-medium">Email: admin@gymsync.com</p>
            <p className="font-medium">Password: admin123</p>
          </div>
          
          <p className="font-semibold mt-3 mb-1">Demo accounts:</p>
          <div className="grid grid-cols-2 gap-1">
            <div>
              <p className="font-medium">Member:</p>
              <p>member@example.com</p>
            </div>
            <div>
              <p className="font-medium">Trainer:</p>
              <p>trainer@example.com</p>
            </div>
            <div>
              <p className="font-medium">Gym Owner:</p>
              <p>owner@example.com</p>
            </div>
            <div>
              <p className="font-medium">Super Admin:</p>
              <p>admin@example.com</p>
            </div>
          </div>
          <p className="mt-2 text-center">Password for demo accounts: <span className="font-medium">password</span></p>
        </div>
      </div>
    </div>
  );
} 