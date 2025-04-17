'use client';
import { useState, useEffect, FormEvent } from 'react';
import axios from '@/utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { Search, Plus, Edit, Trash, X, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AxiosError } from 'axios';

interface Facility {
  _id: string;
  name: string;
  type: string;
  status: 'available' | 'maintenance' | 'unavailable';
  capacity: number;
  description: string;
  createdAt: string;
}

export default function FacilitiesPage() {
  const router = useRouter();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFacility, setNewFacility] = useState({
    name: '',
    type: 'room',
    status: 'available' as const,
    capacity: 0,
    description: ''
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/gym-owner/facilities');
      setFacilities(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching facilities:', error);
      setError('Failed to load facilities');
      
      // Check if user is not a gym owner and redirect
      if (error instanceof AxiosError && error.response?.status === 403) {
        toast.error('Access denied. Redirecting to login...');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddFacility = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/gym-owner/facilities', newFacility);
      setSuccessMessage('Facility added successfully!');
      setShowAddForm(false);
      setNewFacility({
        name: '',
        type: 'room',
        status: 'available' as const,
        capacity: 0,
        description: ''
      });
      fetchFacilities();
    } catch (error) {
      console.error('Error adding facility:', error);
      setError('Failed to add facility');
      
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          setError(error.response.data.message || 'Invalid facility data');
        } else if (error.response?.status === 409) {
          setError('A facility with this name already exists');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFacility = async (id: string) => {
    if (confirm('Are you sure you want to delete this facility?')) {
      try {
        setLoading(true);
        await axios.delete(`/gym-owner/facilities/${id}`);
        setSuccessMessage('Facility deleted successfully!');
        fetchFacilities();
      } catch (error) {
        console.error('Error deleting facility:', error);
        setError('Failed to delete facility');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleFacilityStatus = async (id: string, currentStatus: string) => {
    try {
      setLoading(true);
      const statusOrder = ['available', 'maintenance', 'unavailable'];
      const currentIndex = statusOrder.indexOf(currentStatus);
      const newStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
      
      await axios.patch(`/gym-owner/facilities/${id}/status`, { status: newStatus });
      setSuccessMessage(`Facility status updated to ${newStatus} successfully!`);
      fetchFacilities();
    } catch (error) {
      console.error('Error updating facility status:', error);
      setError('Failed to update facility status');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewFacility(prev => ({ 
      ...prev, 
      [name]: name === 'capacity' ? parseInt(value) || 0 : value 
    }));
  };

  // Filter facilities based on search term
  const filteredFacilities = facilities.filter(facility => 
    facility.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    facility.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facility.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Clear success/error messages after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'unavailable':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">🏢 Gym Facilities</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Manage your gym facilities, equipment, and rooms
      </p>

      {/* Success and Error Messages */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage('')}>
            <X size={16} />
          </button>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search and Add Facility Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search facilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center w-full sm:w-auto justify-center"
        >
          {showAddForm ? (
            <>
              <X size={18} className="mr-2" /> Cancel
            </>
          ) : (
            <>
              <Plus size={18} className="mr-2" /> Add Facility
            </>
          )}
        </button>
      </div>

      {/* Add Facility Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Facility</h2>
          <form onSubmit={handleAddFacility}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Facility Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={newFacility.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={newFacility.type}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="room">Room</option>
                  <option value="equipment">Equipment</option>
                  <option value="amenity">Amenity</option>
                  <option value="studio">Studio</option>
                  <option value="court">Court</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={newFacility.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  min="0"
                  value={newFacility.capacity}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={newFacility.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>Add Facility</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Facilities List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {loading && !showAddForm ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredFacilities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No facilities found matching your search.' : 'No facilities found. Add your first facility!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Facility
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredFacilities.map((facility) => (
                  <tr key={facility._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-gray-500 mr-3"/>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {facility.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                            {facility.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white capitalize">
                        {facility.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(facility.status)}`}>
                        {facility.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {facility.capacity > 0 ? facility.capacity : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/dashboard/gym-owner/facilities/${facility._id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => toggleFacilityStatus(facility._id, facility.status)}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                          title="Change status"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 8L12 16"></path>
                            <path d="M8 12L16 12"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteFacility(facility._id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 