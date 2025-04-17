'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Building, Calendar, Check, X, MapPin, Phone } from 'lucide-react';
import axios from '@/utils/axiosInstance';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ROLES } from '@/shared/roles';
import { useToast } from '@/components/ui/use-toast';

interface GymOwner {
  _id: string;
  name: string;
  email: string;
  gymName?: string;
  phone?: string;
  location?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// Sample data for pending gym owners
const sampleOwners: GymOwner[] = [
  {
    _id: '1',
    name: 'John Smith',
    email: 'john@fitnesselite.com',
    gymName: 'Fitness Elite',
    phone: '555-1234',
    location: 'New York',
    createdAt: new Date().toISOString(),
    status: 'pending',
  },
  {
    _id: '2',
    name: 'Maria Garcia',
    email: 'maria@stayfit.com',
    gymName: 'Stay Fit Gym',
    phone: '555-6789',
    location: 'Chicago',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'pending',
  },
  {
    _id: '3',
    name: 'Robert Johnson',
    email: 'robert@powerfitness.com',
    gymName: 'Power Fitness Center',
    phone: '555-9012',
    location: 'Miami',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'pending',
  }
];

export default function ApprovalsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [owners, setOwners] = useState<GymOwner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if not a super admin
    if (!loading && user && user.role !== ROLES.SUPER_ADMIN) {
      router.push('/dashboard');
    }

    if (!loading && user) {
      fetchPendingOwners();
    }
  }, [user, loading, router]);

  const fetchPendingOwners = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log("Fetching pending gym owners...");
      
      // Get auth token for authorization
      const token = localStorage.getItem('token');
      
      // Use the correct API URL
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      
      // Use direct fetch API with proper authorization
      const fetchResponse = await fetch(`${apiBaseUrl}/api/superadmin/approvals`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        credentials: 'include'
      });
      
      if (fetchResponse.ok) {
        const data = await fetchResponse.json();
        console.log("API Direct Fetch Response:", data);
        
        if (Array.isArray(data) && data.length > 0) {
          console.log("Setting owners from API data, count:", data.length);
          setOwners(data);
        } else {
          console.log("No owners returned from API or invalid format:", data);
          setError('No pending applications found in database.');
          // Fallback to sample data for demonstration if needed
          setOwners(sampleOwners);
        }
      } else {
        throw new Error(`API request failed with status ${fetchResponse.status}`);
      }
    } catch (err: any) {
      console.error('Error fetching pending gym owners:', err);
      setError('Failed to load pending applications. Using sample data for demonstration.');
      // Use sample data as fallback
      setOwners(sampleOwners);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setProcessing(id);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/superadmin/approve/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      // Remove the approved owner from the list
      setOwners(owners.filter(owner => owner._id !== id));
      toast({
        title: "Success",
        description: "Gym owner application has been approved"
      });
    } catch (err: any) {
      console.error("Error approving gym owner:", err);
      setError('Failed to approve gym owner');
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again."
        });
        setTimeout(() => {
          document.location.href = '/login';
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: "Failed to approve gym owner. Please try again."
        });
      }
    } finally {
      setProcessing('');
    }
  };
  
  const handleReject = async (id: string) => {
    try {
      setProcessing(id);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/superadmin/reject/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      // Remove the rejected owner from the list
      setOwners(owners.filter(owner => owner._id !== id));
      toast({
        title: "Success",
        description: "Gym owner application has been rejected"
      });
    } catch (err: any) {
      console.error("Error rejecting gym owner:", err);
      setError('Failed to reject gym owner');
      
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again."
        });
        setTimeout(() => {
          document.location.href = '/login';
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: "Failed to reject gym owner. Please try again."
        });
      }
    } finally {
      setProcessing('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">🛂 Pending Approvals</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and approve gym owner registration applications
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : owners.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mb-4 flex justify-center">
              <Building className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Pending Applications</h3>
            <p className="text-gray-500">
              There are no gym owner applications waiting for approval at this time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {owners.map((owner) => (
            <Card key={owner._id} className="overflow-hidden shadow hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-4">
                    <div className="p-3 bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{owner.name}</h3>
                      <p className="text-gray-600">{owner.email}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-3">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{owner.gymName || 'No gym name provided'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Registered {new Date(owner.createdAt).toLocaleDateString()}</span>
                        </div>
                        {owner.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">{owner.location}</span>
                          </div>
                        )}
                        {owner.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">{owner.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:items-end justify-between space-y-4">
                    <Badge className="bg-yellow-400 text-black px-3 py-1 text-sm rounded-full">Pending Review</Badge>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleApprove(owner._id)}
                        className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                        size="sm"
                        disabled={processing === owner._id}
                      >
                        <Check className="h-4 w-4" />
                        <span>Approve</span>
                      </Button>
                      <Button
                        onClick={() => handleReject(owner._id)}
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                        disabled={processing === owner._id}
                      >
                        <X className="h-4 w-4" />
                        <span>Reject</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 