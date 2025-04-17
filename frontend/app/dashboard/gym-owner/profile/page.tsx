'use client';
import { useState, useEffect, FormEvent } from 'react';
import axios from '@/utils/axiosInstance';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { User, Edit, Save, X } from 'lucide-react';

interface GymOwnerProfile {
  name: string;
  email: string;
  gymName: string;
  location: string;
  phone: string;
}

export default function GymOwnerProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<GymOwnerProfile>({
    name: '',
    email: '',
    gymName: '',
    location: '',
    phone: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Redirect if not a gym owner
    if (!loading && user && user.role !== 'gym-owner') {
      router.push('/dashboard');
    }

    if (!loading && user) {
      fetchProfile();
    }
  }, [user, loading, router]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/gym-owner/profile');
      setProfile(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');
      
      await axios.put('/api/gym-owner/profile', profile);
      
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">👤 Gym Owner Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your gym's information
          </p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        ) : (
          <button 
            onClick={() => setIsEditing(false)}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  readOnly
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gym Name</label>
                <input
                  type="text"
                  name="gymName"
                  value={profile.gymName}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full mr-4">
                  <User className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{profile.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">GYM NAME</h3>
                  <p className="text-lg">{profile.gymName || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">PHONE NUMBER</h3>
                  <p className="text-lg">{profile.phone || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">LOCATION</h3>
                  <p className="text-lg">{profile.location || "Not specified"}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg">
              <h3 className="font-medium mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Account Type</span>
                  <span className="font-medium">Gym Owner</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className="font-medium text-green-600">Approved</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Date Joined</span>
                  <span className="font-medium">August 15, 2023</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 