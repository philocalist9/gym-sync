'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import axios from '@/utils/axiosInstance';
import { ROLES } from '@/shared/roles';
import Card from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface SystemSettings {
  appName: string;
  allowNewRegistrations: boolean;
  requireEmailVerification: boolean;
  maintenanceMode: boolean;
  notificationsEnabled: boolean;
  systemEmailAddress: string;
  defaultLanguage: string;
  sessionTimeout: number;
  maxFailedLoginAttempts: number;
  passwordMinLength: number;
}

// Sample settings for development without backend
const sampleSettings: SystemSettings = {
  appName: 'GymSync',
  allowNewRegistrations: true,
  requireEmailVerification: true,
  maintenanceMode: false,
  notificationsEnabled: true,
  systemEmailAddress: 'system@gymsync.app',
  defaultLanguage: 'en',
  sessionTimeout: 30,
  maxFailedLoginAttempts: 5,
  passwordMinLength: 8
};

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [settings, setSettings] = useState<SystemSettings>(sampleSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    // Redirect if not a super admin
    if (!loading && user && user.role !== ROLES.SUPER_ADMIN) {
      router.push('/dashboard');
    }

    if (!loading && user) {
      fetchSettings();
    }
  }, [user, loading, router]);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      // For development without backend, use sample settings
      setTimeout(() => {
        setSettings(sampleSettings);
        setIsLoading(false);
      }, 700); // Simulate API delay
    } catch (err) {
      console.error('Error fetching system settings:', err);
      setError('Failed to load system settings');
      // Fallback to sample settings if API fails
      setSettings(sampleSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      setSuccess('System settings saved successfully');
      setIsLoading(false);
      setIsChanged(false);
    } catch (err) {
      console.error('Error saving system settings:', err);
      setError('Failed to save system settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings(sampleSettings);
      setIsChanged(true);
    }
  };

  const handleChange = (field: keyof SystemSettings, value: any) => {
    setSettings({
      ...settings,
      [field]: value
    });
    setIsChanged(true);
  };

  if (loading || isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">System Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure global system settings and parameters
          </p>
        </div>
        <div className="space-x-3">
          <Button 
            variant="outline" 
            onClick={handleResetSettings}
          >
            Reset
          </Button>
          <Button 
            onClick={handleSaveSettings}
            disabled={!isChanged}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <Card.Header>
            <Card.Title>General Settings</Card.Title>
          </Card.Header>
          <Card.Content className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Application Name</label>
              <Input 
                value={settings.appName} 
                onChange={(e) => handleChange('appName', e.target.value)}
                placeholder="GymSync" 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Maintenance Mode</label>
              <Switch 
                checked={settings.maintenanceMode}
                onCheckedChange={(checked: boolean) => handleChange('maintenanceMode', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Language</label>
              <select 
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                value={settings.defaultLanguage}
                onChange={(e) => handleChange('defaultLanguage', e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </Card.Content>
        </Card>

        {/* Security Settings */}
        <Card>
          <Card.Header>
            <Card.Title>Security Settings</Card.Title>
          </Card.Header>
          <Card.Content className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Allow New Registrations</label>
              <Switch 
                checked={settings.allowNewRegistrations}
                onCheckedChange={(checked: boolean) => handleChange('allowNewRegistrations', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Require Email Verification</label>
              <Switch 
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked: boolean) => handleChange('requireEmailVerification', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Timeout (minutes)</label>
              <Input 
                type="number" 
                min="5" 
                max="120" 
                value={settings.sessionTimeout} 
                onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
              />
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
} 