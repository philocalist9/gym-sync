import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const router = useRouter();
  const { isLoading: authLoading, error: authError } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gymName: "",
    location: "",
    phone: ""
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    // Additional validation for gym owners
    if (!form.gymName) {
      setError("Gym Name is required");
      return;
    }

    try {
      // Show loading state
      setIsLoading(true);
      
      // Create the request body
      const requestBody = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: "gymOwner", // Hardcoded role as this is now gym-owner only signup
        gymName: form.gymName,
        location: form.location,
        phone: form.phone
      };
      
      // Log the request for debugging
      console.log('Gym owner signup request:', JSON.stringify(requestBody, null, 2));
      
      // Use the Next.js API route first (more reliable)
      try {
        console.log('Attempting to register via Next.js API route');
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          // Add additional options to handle network issues
          credentials: 'same-origin',
          mode: 'same-origin',
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || data.message || "Registration failed");
        }
        
        // Show success message
        setSuccess("Your gym registration has been submitted. You'll be notified once approved by a Super Admin.");
        
        // Reset form
        setForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          gymName: "",
          location: "",
          phone: ""
        });
        
        return; // Exit early on success
        
      } catch (apiError: any) {
        console.error("Next.js API route failed:", apiError);
        
        // Try to show demo success in development mode if it's a network error
        if (process.env.NODE_ENV === 'development' && apiError.message?.includes('fetch')) {
          console.log('Development mode detected, showing mock success response');
          
          // In development mode, show success even if backend is unreachable
          setSuccess("DEMO MODE: Your gym registration would be submitted in production. You would be notified once approved by a Super Admin.");
          
          // Reset form
          setForm({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            gymName: "",
            location: "",
            phone: ""
          });
          
          return; // Exit early with mock success
        }
        
        // If not a network error or not in development, try direct backend call
        try {
          console.log('Attempting direct backend API call');
          const directResponse = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });
          
          // Handle non-JSON responses
          const contentType = directResponse.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            // Log the raw text response for debugging
            const textResponse = await directResponse.text();
            console.error("Non-JSON response received:", textResponse);
            throw new Error("Server returned non-JSON response. Please try again later.");
          }
          
          const directData = await directResponse.json();
          
          if (!directResponse.ok) {
            throw new Error(directData.message || "Registration failed");
          }
          
          // Show success message
          setSuccess("Your gym registration has been submitted. You'll be notified once approved by a Super Admin.");
          
          // Reset form
          setForm({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            gymName: "",
            location: "",
            phone: ""
          });
          
        } catch (directError: any) {
          console.error("Direct API call failed:", directError);
          
          // Final fallback - try the mock endpoint for development testing
          try {
            if (process.env.NODE_ENV === 'development') {
              console.log('Attempting to use mock signup endpoint as final fallback');
              const mockResponse = await fetch('/api/mock-signup', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
              });
              
              const mockData = await mockResponse.json();
              
              if (!mockResponse.ok) {
                throw new Error(mockData.error || "Mock registration failed");
              }
              
              // Show success message with mock indication
              setSuccess("MOCK MODE: " + (mockData.message || "Your gym registration has been processed in mock mode. In production, you would be notified once approved."));
              
              // Reset form
              setForm({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                gymName: "",
                location: "",
                phone: ""
              });
              
              return; // Exit early with mock success
            }
          } catch (mockError) {
            console.error("Mock API call failed:", mockError);
            // Continue to the error handler below
          }
          
          // More specific error messages based on error type
          if (directError.message?.includes('fetch') || directError.name === 'TypeError') {
            throw new Error("Unable to connect to the server. Please check your internet connection and try again later.");
          } else {
            throw directError;
          }
        }
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Gym Owner Registration</h2>
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        {(error || authError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

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
            name="gymName"
            type="text"
            placeholder="Gym Name *"
            value={form.gymName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          
          <input
            name="location"
            type="text"
            placeholder="Gym Location"
            value={form.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          
          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
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

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200 flex justify-center items-center"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Processing...
              </div>
            ) : (
              "Register Gym"
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-2">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
        
        {/* Admin approval note */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600 text-center">
          <p>
            Note: Your gym registration will require approval by a Super Admin before you can access your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
} 