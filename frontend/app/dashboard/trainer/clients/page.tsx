'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw, ArrowRight, User, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';

// Client type definition
interface Client {
  _id: string;
  name: string;
  email: string;
  goal?: string;
  plan?: string;
  progress?: string;
  joinDate?: string;
  attendance?: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { toast } = useToast();
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  
  // New client form state
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    goal: 'Fat Loss',
    plan: 'Basic'
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown
  const toggleDropdown = (id: string) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(id);
    }
  };

  // Fetch clients data
  const fetchClients = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.get('/trainer/clients');
      setClients(response.data);
    } catch (err: any) {
      console.error('Error fetching clients:', err);
      setError(err.response?.data?.message || 'Failed to fetch clients. Please try again.');
      
      // If API fails, use empty array to avoid UI breaking
      setClients([]);
      
      toast({
        title: 'Error',
        description: 'Failed to load clients. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchClients();
  }, []);

  // Handle refresh
  const handleRefresh = () => {
    fetchClients();
  };
  
  // Handle adding a new client
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await api.post('/trainer/add-client', newClient);
      
      toast({
        title: 'Success',
        description: `${newClient.name} has been added as your client.`
      });
      
      // Reset form and close dialog
      setNewClient({
        name: '',
        email: '',
        phone: '',
        goal: 'Fat Loss',
        plan: 'Basic'
      });
      setShowAddClient(false);
      
      // Refresh client list
      fetchClients();
    } catch (err: any) {
      console.error('Error adding client:', err);
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to add client. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewClient(prev => ({ ...prev, [name]: value }));
  };

  // Handle selecting an item and close dropdown
  const handleItemSelect = (name: string, value: string) => {
    handleSelectChange(name, value);
    setOpenDropdown(null);
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.goal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.plan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">👥 My Clients</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your clients' workout plans and progress
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            onClick={() => setShowAddClient(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Client Overview</h2>
              <p className="text-gray-500 dark:text-gray-400">Total Clients: {clients.length}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">Active: {clients.length}</Badge>
              <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">On Track: {clients.filter(c => c.progress === 'Good' || c.progress === 'Excellent').length || 0}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input 
          type="text"
          placeholder="Search clients by name, email, plan or goal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="space-y-4">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <Card key={client._id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                      <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{client.name}</h2>
                      <p className="text-gray-600 dark:text-gray-400">{client.email}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        Joined: {client.joinDate ? new Date(client.joinDate).toLocaleDateString() : 'N/A'} • Attendance: {client.attendance || 'N/A'}
                      </p>
                    </div>
                  </div>
                  {client.progress && (
                    <Badge 
                      className={`${
                        client.progress === 'Excellent' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : client.progress === 'Good'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}
                    >
                      {client.progress}
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="border dark:border-gray-700 rounded p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Goal</p>
                    <p className="font-medium text-gray-900 dark:text-white">{client.goal || 'Not set'}</p>
                  </div>
                  <div className="border dark:border-gray-700 rounded p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Current Plan</p>
                    <p className="font-medium text-gray-900 dark:text-white">{client.plan || 'Not assigned'}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2 justify-end">
                  <Button variant="outline" className="text-blue-600 dark:text-blue-400">
                    View Progress
                  </Button>
                  <Button variant="outline" className="text-purple-600 dark:text-purple-400">
                    Manage Plan
                  </Button>
                  <Button variant="outline" className="text-gray-600 dark:text-gray-400">
                    Message
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1">
                    Details <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No clients found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'No clients match your search' : 'You haven\'t added any clients yet'}
            </p>
            {searchTerm ? (
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Clear Search
              </Button>
            ) : (
              <Button onClick={() => setShowAddClient(true)}>
                Add Your First Client
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add Client Dialog */}
      <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Client</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddClient}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Client Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newClient.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newClient.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={newClient.phone}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                />
              </div>
              <div ref={dropdownRef}>
                <div className="space-y-2">
                  <Label htmlFor="goal">Fitness Goal</Label>
                  <Select 
                    value={newClient.goal} 
                    onValueChange={(value) => handleItemSelect('goal', value)}
                  >
                    <SelectTrigger onClick={() => toggleDropdown('goal-dropdown')}>
                      <SelectValue placeholder="Select a goal">{newClient.goal}</SelectValue>
                    </SelectTrigger>
                    <SelectContent id="goal-dropdown" className={openDropdown === 'goal-dropdown' ? '' : 'hidden'}>
                      <SelectItem value="Fat Loss" onSelect={(value) => handleItemSelect('goal', value)}>Fat Loss</SelectItem>
                      <SelectItem value="Muscle Gain" onSelect={(value) => handleItemSelect('goal', value)}>Muscle Gain</SelectItem>
                      <SelectItem value="Athletic Performance" onSelect={(value) => handleItemSelect('goal', value)}>Athletic Performance</SelectItem>
                      <SelectItem value="General Fitness" onSelect={(value) => handleItemSelect('goal', value)}>General Fitness</SelectItem>
                      <SelectItem value="Rehabilitation" onSelect={(value) => handleItemSelect('goal', value)}>Rehabilitation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan">Initial Plan</Label>
                  <Select 
                    value={newClient.plan} 
                    onValueChange={(value) => handleItemSelect('plan', value)}
                  >
                    <SelectTrigger onClick={() => toggleDropdown('plan-dropdown')}>
                      <SelectValue placeholder="Select a plan">{newClient.plan}</SelectValue>
                    </SelectTrigger>
                    <SelectContent id="plan-dropdown" className={openDropdown === 'plan-dropdown' ? '' : 'hidden'}>
                      <SelectItem value="Basic" onSelect={(value) => handleItemSelect('plan', value)}>Basic</SelectItem>
                      <SelectItem value="Intermediate" onSelect={(value) => handleItemSelect('plan', value)}>Intermediate</SelectItem>
                      <SelectItem value="Advanced" onSelect={(value) => handleItemSelect('plan', value)}>Advanced</SelectItem>
                      <SelectItem value="Custom" onSelect={(value) => handleItemSelect('plan', value)}>Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setShowAddClient(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Client'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 