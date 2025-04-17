'use client';
import { useState, useEffect, FormEvent } from 'react';
import axios from '@/utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { Search, Plus, Edit, Trash, UserCheck, UserX, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AxiosError } from 'axios';

interface Member {
  _id: string;
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  membershipStatus: 'active' | 'inactive' | 'expired';
  startDate: string;
  endDate: string;
  createdAt: string;
}

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    membershipType: 'monthly',
    membershipStatus: 'active' as const
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/gym-owner/members');
      setMembers(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching members:', error);
      setError('Failed to load members');
      
      // Check if user is not a gym owner and redirect
      if (error instanceof AxiosError && error.response?.status === 403) {
        toast.error('Access denied. Redirecting to login...');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post('/gym-owner/members', newMember);
      setSuccessMessage('Member added successfully!');
      setShowAddForm(false);
      setNewMember({
        name: '',
        email: '',
        phone: '',
        membershipType: 'monthly',
        membershipStatus: 'active' as const
      });
      fetchMembers();
    } catch (error) {
      console.error('Error adding member:', error);
      setError('Failed to add member');
      
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          setError(error.response.data.message || 'Invalid member data');
        } else if (error.response?.status === 409) {
          setError('A member with this email already exists');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm('Are you sure you want to delete this member?')) {
      try {
        setLoading(true);
        await axios.delete(`/gym-owner/members/${id}`);
        setSuccessMessage('Member deleted successfully!');
        fetchMembers();
      } catch (error) {
        console.error('Error deleting member:', error);
        setError('Failed to delete member');
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleMemberStatus = async (id: string, currentStatus: string) => {
    try {
      setLoading(true);
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await axios.patch(`/gym-owner/members/${id}/status`, { status: newStatus });
      setSuccessMessage(`Member ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
      fetchMembers();
    } catch (error) {
      console.error('Error updating member status:', error);
      setError('Failed to update member status');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
  };

  // Filter members based on search term
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.membershipType.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">👥 Gym Members</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        View and manage your gym members, their membership status, and details
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

      {/* Search and Add Member Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search members..."
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
              <Plus size={18} className="mr-2" /> Add Member
            </>
          )}
        </button>
      </div>

      {/* Add Member Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Member</h2>
          <form onSubmit={handleAddMember}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={newMember.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={newMember.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={newMember.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Membership Type
                </label>
                <select
                  name="membershipType"
                  value={newMember.membershipType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                  <option value="dayPass">Day Pass</option>
                </select>
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
                  <>Add Member</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {loading && !showAddForm ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No members found matching your search.' : 'No members found. Add your first member!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Membership
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMembers.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white capitalize">
                        {member.membershipType}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Since {new Date(member.startDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${member.membershipStatus === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                          member.membershipStatus === 'inactive' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : 
                          'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}>
                        {member.membershipStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(member.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/dashboard/gym-owner/members/${member._id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => toggleMemberStatus(member._id, member.membershipStatus)}
                          className={`${
                            member.membershipStatus === 'active' 
                              ? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300' 
                              : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                          }`}
                        >
                          {member.membershipStatus === 'active' ? <UserX size={18} /> : <UserCheck size={18} />}
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member._id)}
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