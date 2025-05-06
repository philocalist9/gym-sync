'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Building, Calendar, MapPin, Phone, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ROLES } from '@/shared/roles';
import Link from 'next/link';

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

export default function GymOwnersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [owners, setOwners] = useState<GymOwner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect if not a super admin
    if (!loading && user && user.role !== ROLES.SUPER_ADMIN) {
      router.push('/dashboard');
    }

    if (!loading && user) {
      fetchGymOwners();
    }
  }, [user, loading, router]);

  const fetchGymOwners = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log("Fetching all gym owners...");
      
      // Get auth token for authorization
      const authToken = localStorage.getItem('token');
      
      if (!authToken) {
        throw new Error('No authentication token found');
      }
      
      // Use the correct API URL
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
      
      const response = await fetch(`${apiBaseUrl}/api/superadmin/owners`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
      if (Array.isArray(data)) {
        setOwners(data);
        if (data.length === 0) {
          setError('No gym owners found.');
        }
      } else {
        console.error("Unexpected API response format:", data);
        setError('Received invalid data format from server.');
      }
    } catch (err: any) {
      console.error('Error fetching gym owners:', err);
      setError(`Failed to load gym owners: ${err.message}`);
      
      // Use sample data as fallback
      setOwners([
        {
          _id: '1',
          name: 'Fitness Elite',
          email: 'john@fitnesselite.com',
          gymName: 'Fitness Elite Gym',
          phone: '555-1234',
          location: 'New York',
          status: 'approved',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          name: 'Strong Core Fitness',
          email: 'maria@strongcore.com',
          gymName: 'Strong Core Fitness Center',
          phone: '555-5678',
          location: 'Los Angeles',
          status: 'approved',
          createdAt: new Date(Date.now() - 86400000*30).toISOString()
        },
        {
          _id: '3',
          name: 'Urban Fitness',
          email: 'robert@urbanfitness.com',
          gymName: 'Urban Fitness Club',
          phone: '555-9101',
          location: 'Chicago',
          status: 'rejected',
          createdAt: new Date(Date.now() - 86400000*60).toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">🏋️‍♂️ Gym Owners</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all gym owners on the platform
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={fetchGymOwners}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Link href="/dashboard/super-admin">
            <Button variant="secondary">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-700 dark:text-gray-300">Loading gym owners...</span>
        </div>
      ) : owners.length === 0 ? (
        <Card className="border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6 text-center">
            <div className="mb-4 flex justify-center">
              <Building className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Gym Owners Found</h3>
            <p className="text-gray-500 mb-6">
              There are no gym owners registered on the platform yet.
            </p>
            <Link href="/dashboard/super-admin">
              <Button variant="outline">
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {owners.map((owner) => (
            <Card key={owner._id} className="overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{owner.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{owner.email}</p>
                      </div>
                    </div>
                    {getStatusBadge(owner.status)}
                  </div>
                  
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">{owner.gymName || 'No gym name provided'}</span>
                    </div>
                    {owner.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">{owner.location}</span>
                      </div>
                    )}
                    {owner.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">{owner.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Joined {new Date(owner.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => router.push(`/dashboard/super-admin/gym-owners/${owner._id}`)}
                    >
                      View Details
                    </Button>
                    
                    {owner.status === 'pending' && (
                      <Link href="/dashboard/super-admin/approvals">
                        <Button variant="default" className="w-full">
                          Review Application
                        </Button>
                      </Link>
                    )}
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