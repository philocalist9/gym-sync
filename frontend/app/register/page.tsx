'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/utils/axiosInstance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.gymName || !formData.phoneNumber || !formData.address) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Submit to API
      const response = await axios.post('/api/signup-middleware', formData);
      
      if (response.data.success) {
        // Success notification
        toast({
          title: "Registration Submitted",
          description: "Your application has been received and is pending review."
        });
        
        // Redirect to confirmation page
        router.push('/register/confirmation');
      } else {
        throw new Error(response.data.error || 'Unknown error occurred');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.response?.data?.error || error.message || "There was a problem submitting your application. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-2xl py-10 px-4">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Gym Owner Registration</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Register your gym to join the Gym-Sync platform. Your application will be reviewed by an administrator.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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
                rows={4} 
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </div>
    </div>
  );
} 