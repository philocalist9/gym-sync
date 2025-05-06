'use client';

import { useState } from 'react';
import axios from '@/utils/axiosInstance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

export default function AddTestAccountPage() {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gymName: '',
    phoneNumber: '',
    address: '',
    description: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.gymName || !formData.phoneNumber || !formData.address) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields"
        });
        setIsCreating(false);
        return;
      }
      
      // Create test account via API
      const response = await axios.post('/api/signup-middleware', formData);
      
      if (response.data.success) {
        toast({
          title: "Test Account Created",
          description: `Added ${formData.name} (${formData.gymName}) to pending applications`
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          gymName: '',
          phoneNumber: '',
          address: '',
          description: ''
        });
      } else {
        throw new Error(response.data.error || 'Unknown error occurred');
      }
    } catch (error: any) {
      console.error('Error creating test account:', error);
      toast({
        title: "Creation Failed",
        description: error.response?.data?.error || error.message || "There was a problem creating the test account."
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const createRandomAccount = async () => {
    setIsCreating(true);
    
    try {
      // Generate random data
      const id = Math.floor(Math.random() * 10000);
      const randomAccount = {
        name: `Test Owner ${id}`,
        email: `test${id}@example.com`,
        gymName: `Test Gym ${id}`,
        phoneNumber: `555-${id.toString().padStart(4, '0')}`,
        address: `${id} Test Street, Testville`,
        description: 'This is a randomly generated test account'
      };
      
      // Create random account via API
      const response = await axios.post('/api/signup-middleware', randomAccount);
      
      if (response.data.success) {
        toast({
          title: "Random Account Created",
          description: `Added ${randomAccount.name} (${randomAccount.gymName}) to pending applications`
        });
      } else {
        throw new Error(response.data.error || 'Unknown error occurred');
      }
    } catch (error: any) {
      console.error('Error creating random account:', error);
      toast({
        title: "Creation Failed",
        description: error.response?.data?.error || error.message || "There was a problem creating the random account."
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add Test Account</h1>
        
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/super-admin/approvals">
              View Approvals
            </Link>
          </Button>
          <Button
            onClick={createRandomAccount}
            disabled={isCreating}
          >
            Add Random Account
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Create Test Account</CardTitle>
          <p className="text-sm text-gray-500">
            Add a test gym owner account to the pending approvals list
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Owner Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com" 
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gymName">Gym Name</Label>
                <Input 
                  id="gymName" 
                  name="gymName" 
                  value={formData.gymName}
                  onChange={handleChange}
                  placeholder="FitZone Gym" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input 
                  id="phoneNumber" 
                  name="phoneNumber" 
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="555-123-4567" 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                name="address" 
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Fitness St, Workout City" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your gym..." 
                rows={3} 
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Test Account'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 