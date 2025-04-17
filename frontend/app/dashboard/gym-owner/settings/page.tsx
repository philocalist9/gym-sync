'use client';
import { useState, useEffect } from 'react';
import axios from '@/utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { Clock, DollarSign, UserCog, Bell, ShieldCheck, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

interface GymSettings {
  _id?: string;
  gymHours: {
    openTime: string;
    closeTime: string;
    weekend: {
      openTime: string;
      closeTime: string;
      closed: boolean;
    }
  };
  membershipOptions: {
    monthly: number;
    quarterly: number;
    yearly: number;
    dayPass: number;
  };
  notifications: {
    emailUpdates: boolean;
    smsAlerts: boolean;
    marketingEmails: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    dataRetentionDays: number;
  };
}

type SettingsSectionKey = 'gymHours' | 'membershipOptions' | 'notifications' | 'security';

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<GymSettings>({
    gymHours: {
      openTime: '06:00',
      closeTime: '22:00',
      weekend: {
        openTime: '08:00',
        closeTime: '20:00',
        closed: false
      }
    },
    membershipOptions: {
      monthly: 49.99,
      quarterly: 129.99,
      yearly: 449.99,
      dayPass: 15
    },
    notifications: {
      emailUpdates: true,
      smsAlerts: false,
      marketingEmails: false
    },
    security: {
      twoFactorAuth: false,
      dataRetentionDays: 365
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hours');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/gym-owner/settings');
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Check if user is not a gym owner and redirect
      if (error instanceof AxiosError && error.response?.status === 403) {
        toast.error('Access denied. Redirecting to login...');
        router.push('/login');
      } else {
        toast.error('Failed to load settings');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const method = settings._id ? 'put' : 'post';
      const url = settings._id ? `/gym-owner/settings/${settings._id}` : '/gym-owner/settings';
      const response = await axios[method](url, settings);
      toast.success('Settings saved successfully');
      
      // Update settings with the response if there's a new ID
      if (!settings._id && response.data._id) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section: SettingsSectionKey, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section] as Record<string, any>,
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (
    section: SettingsSectionKey, 
    parentField: string, 
    field: string, 
    value: any
  ) => {
    setSettings(prev => {
      const sectionObj = prev[section] as Record<string, any>;
      const parentObj = sectionObj[parentField] as Record<string, any>;
      
      return {
        ...prev,
        [section]: {
          ...sectionObj,
          [parentField]: {
            ...parentObj,
            [field]: value
          }
        }
      };
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">⚙️ Gym Settings</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">⚙️ Gym Settings</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Configure your gym's operating hours, membership options, and other settings
      </p>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('hours')}
            className={`px-4 py-3 font-medium flex items-center ${
              activeTab === 'hours'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Clock size={18} className="mr-2" /> Hours
          </button>
          <button
            onClick={() => setActiveTab('membership')}
            className={`px-4 py-3 font-medium flex items-center ${
              activeTab === 'membership'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <DollarSign size={18} className="mr-2" /> Membership
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-3 font-medium flex items-center ${
              activeTab === 'notifications'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Bell size={18} className="mr-2" /> Notifications
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-3 font-medium flex items-center ${
              activeTab === 'security'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <ShieldCheck size={18} className="mr-2" /> Security
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'hours' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Operating Hours</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Weekday Hours</h3>
                  <div className="flex items-center space-x-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Opening Time
                      </label>
                      <input
                        type="time"
                        value={settings.gymHours.openTime}
                        onChange={(e) => handleInputChange('gymHours', 'openTime', e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Closing Time
                      </label>
                      <input
                        type="time"
                        value={settings.gymHours.closeTime}
                        onChange={(e) => handleInputChange('gymHours', 'closeTime', e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Weekend Hours</h3>
                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.gymHours.weekend.closed}
                        onChange={(e) => handleNestedInputChange('gymHours', 'weekend', 'closed', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Closed on weekends</span>
                    </label>
                  </div>
                  
                  {!settings.gymHours.weekend.closed && (
                    <div className="flex items-center space-x-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Opening Time
                        </label>
                        <input
                          type="time"
                          value={settings.gymHours.weekend.openTime}
                          onChange={(e) => handleNestedInputChange('gymHours', 'weekend', 'openTime', e.target.value)}
                          className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Closing Time
                        </label>
                        <input
                          type="time"
                          value={settings.gymHours.weekend.closeTime}
                          onChange={(e) => handleNestedInputChange('gymHours', 'weekend', 'closeTime', e.target.value)}
                          className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'membership' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Membership Options</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Monthly Membership ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={settings.membershipOptions.monthly}
                    onChange={(e) => handleInputChange('membershipOptions', 'monthly', parseFloat(e.target.value))}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quarterly Membership ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={settings.membershipOptions.quarterly}
                    onChange={(e) => handleInputChange('membershipOptions', 'quarterly', parseFloat(e.target.value))}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Yearly Membership ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={settings.membershipOptions.yearly}
                    onChange={(e) => handleInputChange('membershipOptions', 'yearly', parseFloat(e.target.value))}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Day Pass ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={settings.membershipOptions.dayPass}
                    onChange={(e) => handleInputChange('membershipOptions', 'dayPass', parseFloat(e.target.value))}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailUpdates}
                      onChange={(e) => handleInputChange('notifications', 'emailUpdates', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">
                      Send email updates about new members and gym activity
                    </span>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.notifications.smsAlerts}
                      onChange={(e) => handleInputChange('notifications', 'smsAlerts', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">
                      Enable SMS alerts for important notifications
                    </span>
                  </label>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.notifications.marketingEmails}
                      onChange={(e) => handleInputChange('notifications', 'marketingEmails', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">
                      Receive marketing emails about new GymSync features
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Security & Privacy</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">
                      Enable two-factor authentication
                    </span>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data Retention Period (days)
                  </label>
                  <input
                    type="number"
                    min="30"
                    value={settings.security.dataRetentionDays}
                    onChange={(e) => handleInputChange('security', 'dataRetentionDays', parseInt(e.target.value))}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This determines how long we keep inactive member data before automatic deletion
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t dark:border-gray-700 flex justify-end">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Saving...
              </>
            ) : (
              <>Save Settings</>
            )}
          </button>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-blue-800 dark:text-blue-300 flex items-start">
        <HelpCircle className="mr-2 flex-shrink-0 mt-0.5" size={18} />
        <p className="text-sm">
          These settings will be applied to your gym's operations. You can change them at any time.
          <br />
          Need help? Contact GymSync support at <span className="font-medium">support@gymsync.io</span>
        </p>
      </div>
    </div>
  );
} 