import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

interface BloodSugarInfo {
  value: number;
  unit: string;
  dateStr: string;
  notes: string;
}

interface DashboardStats {
  medicationsToday: number;
  todaysMedications: any[];
  latestBloodSugar: BloodSugarInfo | null;
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export function useDashboardStats(): DashboardStats {
  const [medicationsToday, setMedicationsToday] = useState<number>(0);
  const [todaysMedications, setTodaysMedications] = useState<any[]>([]);
  const [latestBloodSugar, setLatestBloodSugar] = useState<BloodSugarInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get today's medications
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const medicationResponse = await api.get('/api/medication', {
        params: {
          startDate: today.toISOString(),
          endDate: tomorrow.toISOString(),
          limit: 100
        }
      });

      // Get latest blood sugar
      const bloodSugarResponse = await api.get('/api/blood-sugar', {
        params: {
          limit: 1,
          sort: 'measuredAt'
        }
      });

      setMedicationsToday(medicationResponse.data.medications?.length || 0);
      setTodaysMedications(medicationResponse.data.medications || []);
      
      if (bloodSugarResponse.data.readings && bloodSugarResponse.data.readings.length > 0) {
        const latest = bloodSugarResponse.data.readings[0];
        const measuredDate = new Date(latest.measuredAt);
        const dateStr = measuredDate.toLocaleDateString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        const notesStr = latest.notes ? latest.notes.trim() : '';
        setLatestBloodSugar({
          value: latest.value,
          unit: latest.unit,
          dateStr,
          notes: notesStr
        });
      } else {
        setLatestBloodSugar(null);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    medicationsToday,
    todaysMedications,
    latestBloodSugar,
    loading,
    error,
    fetchStats,
  };
}
