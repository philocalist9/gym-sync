'use client';
import { useState, useEffect, FormEvent } from 'react';
import axios from '@/utils/axiosInstance';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Dumbbell, Plus, Edit, Trash2, CheckCircle, XCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Trainer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  isActive: boolean;
  createdAt: string;
}

export default function TrainersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTrainer, setNewTrainer] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Redirect if not a gym owner
    if (!loading && user && user.role !== 'gym-owner') {
      router.push('/dashboard');
    }

    if (!loading && user) {
      fetchTrainers();
    }
  }, [user, loading, router]);

  const fetchTrainers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/gym-owner/trainers');
      setTrainers(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching trainers:', err);
      setError('Failed to load trainers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await axios.post('/api/gym-owner/trainers', newTrainer);
      
      setTrainers(prev => [...prev, response.data]);
      setSuccess('Trainer added successfully');
      setNewTrainer({
        name: '',
        email: '',
        password: '',
        phone: '',
        specialization: ''
      });
      setShowAddForm(false);
    } catch (err: any) {
      console.error('Error adding trainer:', err);
      setError(err.response?.data?.message || 'Failed to add trainer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTrainer = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        await axios.delete(`/api/gym-owner/trainers/${id}`);
        setTrainers(prev => prev.filter(trainer => trainer._id !== id));
        setSuccess('Trainer deleted successfully');
      } catch (err) {
        console.error('Error deleting trainer:', err);
        setError('Failed to delete trainer');
      }
    }
  };

  const toggleTrainerStatus = async (id: string, currentStatus: boolean) => {
    try {
      const trainer = trainers.find(t => t._id === id);
      if (!trainer) return;
      
      const response = await axios.put(`/api/gym-owner/trainers/${id}`, {
        ...trainer,
        isActive: !currentStatus
      });
      
      setTrainers(prev => 
        prev.map(t => t._id === id ? {...t, isActive: !currentStatus} : t)
      );
      
      setSuccess(`Trainer ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      console.error('Error updating trainer status:', err);
      setError('Failed to update trainer status');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTrainer(prev => ({ ...prev, [name]: value }));
  };

  const filteredTrainers = trainers.filter(trainer => 
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (trainer.specialization && trainer.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading || isLoading) {
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
          <h1 className="text-3xl font-bold mb-2">👨‍🏫 Manage Trainers</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add and manage trainers for your gym
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2"
          variant={showAddForm ? "destructive" : "default"}
        >
          {showAddForm ? <XCircle className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showAddForm ? "Cancel" : "Add Trainer"}
        </Button>
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

      {showAddForm && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Add New Trainer</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="text"
                    name="name"
                    value={newTrainer.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    name="email"
                    value={newTrainer.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    name="password"
                    value={newTrainer.password}
                    onChange={handleChange}
                    placeholder="Password"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    name="phone"
                    value={newTrainer.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    type="text"
                    name="specialization"
                    value={newTrainer.specialization}
                    onChange={handleChange}
                    placeholder="Specialization (e.g., Yoga, Strength Training, Cardio)"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add Trainer
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search trainers by name, email, or specialization..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">📋 Existing Trainers</h2>
      
      {trainers.length === 0 ? (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center p-8">
            <Dumbbell className="h-12 w-12 mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No trainers yet</h3>
            <p className="text-gray-500 mb-4 text-center">Start by adding your first trainer to your gym</p>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Trainer
            </Button>
          </CardContent>
        </Card>
      ) : filteredTrainers.length === 0 ? (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center p-8">
            <Search className="h-12 w-12 mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No trainers match your search</h3>
            <p className="text-gray-500 text-center">Try different search terms or clear your search</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTrainers.map((trainer) => (
            <Card 
              key={trainer._id} 
              className={`${!trainer.isActive ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/50' : ''}`}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold">{trainer.name}</h3>
                      {!trainer.isActive && (
                        <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">{trainer.email}</p>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">{trainer.phone || 'No phone provided'}</p>
                    {trainer.specialization && (
                      <div className="mt-2">
                        <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                          {trainer.specialization}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Link href={`/dashboard/gym-owner/trainers/${trainer._id}`}>
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </Link>
                    </Button>
                    <Button 
                      onClick={() => toggleTrainerStatus(trainer._id, trainer.isActive)}
                      variant={trainer.isActive ? "default" : "secondary"}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      {trainer.isActive ? (
                        <>
                          <XCircle className="h-4 w-4" />
                          <span>Deactivate</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Activate</span>
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={() => handleDeleteTrainer(trainer._id)}
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Added on {new Date(trainer.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 