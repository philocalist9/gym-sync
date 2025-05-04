'use client';

import { useState, useEffect } from 'react';
import { User, Save, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/axios';

interface TrainerProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  bio?: string;
  createdAt?: string;
}

export default function TrainerProfilePage() {
  const [profile, setProfile] = useState<TrainerProfile | null>(null);
  const [formData, setFormData] = useState<Partial<TrainerProfile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Fetch trainer profile
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const response = await api.get('/trainer/profile');
        setProfile(response.data);
        setFormData(response.data);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Failed to fetch profile data');
        
        toast({
          title: 'Error',
          description: 'Failed to load profile. Please try again.'
        });
        
        // Create mock data for development
        if (process.env.NODE_ENV === 'development') {
          const mockData = {
            _id: 'mock-id-123',
            name: 'John Trainer',
            email: 'john.trainer@example.com',
            phone: '123-456-7890',
            specialization: 'Weight Training',
            bio: 'Experienced personal trainer specialized in weight training and nutrition.',
            createdAt: new Date().toISOString()
          };
          setProfile(mockData);
          setFormData(mockData);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    
    try {
      const response = await api.put('/trainer/profile', formData);
      setProfile(response.data);
      
      toast({
        title: 'Success',
        description: 'Your profile has been updated successfully.'
      });
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
      
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">👤 My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and update your trainer profile information
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  placeholder="Your email address"
                  disabled
                />
                <p className="text-sm text-gray-500">Email cannot be changed</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  placeholder="Your phone number"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  name="specialization"
                  value={formData.specialization || ''}
                  onChange={handleInputChange}
                  placeholder="E.g. Weight Training, Yoga, CrossFit"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleInputChange}
                  placeholder="Tell your clients about your experience and expertise"
                  rows={5}
                />
              </div>
              
              {profile?.createdAt && (
                <div className="pt-2">
                  <p className="text-sm text-gray-500">
                    Member since: {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={isSaving} className="flex items-center gap-2">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 