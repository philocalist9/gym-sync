'use client';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Building, Clock, Mail, Phone, MapPin, Search, Users, AlertCircle } from 'lucide-react';

// Sample data for gym owners
const sampleOwners = [
  {
    _id: '1',
    name: 'Sarah Miller',
    email: 'sarah@powergym.com',
    gymName: 'Power Gym',
    phone: '555-5678',
    location: 'Los Angeles',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'approved',
    memberCount: 145,
    trainerCount: 12
  },
  {
    _id: '2',
    name: 'David Chen',
    email: 'david@fitzone.com',
    gymName: 'Fit Zone',
    phone: '555-8765',
    location: 'Seattle',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'approved',
    memberCount: 87,
    trainerCount: 8
  },
  {
    _id: '3',
    name: 'Jessica Lee',
    email: 'jessica@fitnesshub.com',
    gymName: 'Fitness Hub',
    phone: '555-4321',
    location: 'Boston',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    status: 'approved',
    memberCount: 210,
    trainerCount: 15
  }
];

export default function GymOwnersPage() {
  const [owners, setOwners] = useState(sampleOwners);
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSuspendOwner = (id: string) => {
    setOwners(owners.map(owner => 
      owner._id === id ? {...owner, status: 'suspended'} : owner
    ));
    setSuccess('Gym owner account suspended successfully');
  };

  // Filter owners based on search term
  const filteredOwners = owners.filter(owner => {
    const searchLower = searchTerm.toLowerCase();
    return (
      owner.name.toLowerCase().includes(searchLower) ||
      (owner.gymName && owner.gymName.toLowerCase().includes(searchLower)) ||
      (owner.location && owner.location.toLowerCase().includes(searchLower)) ||
      owner.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">🏢 Gym Owners</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all registered gym owners on the platform
          </p>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, gym, or location..."
            className="w-full p-3 pl-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {owners.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mb-4 flex justify-center">
              <Building className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Gym Owners</h3>
            <p className="text-gray-500">
              There are no approved gym owners on the platform yet.
            </p>
          </CardContent>
        </Card>
      ) : filteredOwners.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-medium mb-2">No Matching Results</h3>
            <p className="text-gray-500">
              No gym owners match your search criteria. Try different search terms.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredOwners.map((owner) => (
            <Card key={owner._id} className="overflow-hidden shadow hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-4">
                    <div className="p-3 bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{owner.name}</h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span>{owner.gymName || 'Unnamed Gym'}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{owner.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Since {new Date(owner.createdAt).toLocaleDateString()}</span>
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
                  
                  <div className="flex flex-col md:items-end justify-between">
                    <div className="flex flex-col items-end gap-2">
                      <Badge className="bg-green-500 text-white px-3 py-1 text-sm rounded-full">
                        {owner.status === 'suspended' ? 'Suspended' : 'Active'}
                      </Badge>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{owner.memberCount} members</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{owner.trainerCount} trainers</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex gap-2">
                      {owner.status !== 'suspended' && (
                        <Button
                          onClick={() => handleSuspendOwner(owner._id)}
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <span>Suspend</span>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        View Details
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