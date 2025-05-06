import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

// Define the stats data structure
interface StatsData {
  totalMembers: number;
  totalTrainers: number;
  totalGymOwners: number;
  pendingOwners: number;
  approvedOwners: number;
  rejectedOwners: number;
  [key: string]: any; // Allow for additional properties
}

export function useStats() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/superadmin/stats');
        setData(res.data);
      } catch (err) {
        console.error('❌ Error fetching stats:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { data, loading, error };
} 