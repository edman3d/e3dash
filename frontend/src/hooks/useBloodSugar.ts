import { useState, useEffect } from 'react';
import api from '../services/api';

interface BloodSugar {
  _id: string;
  userId: string;
  value: number;
  measuredAt: string;
  notes?: string;
  createdAt: string;
}

interface BloodSugarStats {
  avgValue: number;
  minValue: number;
  maxValue: number;
  totalReadings: number;
}

interface ChartData {
  _id: string;
  avgValue: number;
  readings: number;
}

export function useBloodSugar() {
  const [readings, setReadings] = useState<BloodSugar[]>([]);
  const [stats, setStats] = useState<BloodSugarStats>({ 
    avgValue: 0, 
    minValue: 0, 
    maxValue: 0, 
    totalReadings: 0 
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReadings = async (page = 1, limit = 10, startDate?: string, endDate?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await api.get(`/api/blood-sugar?${params}`);
      setReadings(response.data.readings);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch blood sugar readings');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (period = 'week') => {
    try {
      const response = await api.get(`/api/blood-sugar/stats?period=${period}`);
      setStats(response.data);
    } catch (err: any) {
      console.error('Failed to fetch blood sugar stats:', err);
    }
  };

  const fetchChartData = async (period = 'week') => {
    try {
      const response = await api.get(`/api/blood-sugar/chart?period=${period}`);
      setChartData(response.data);
    } catch (err: any) {
      console.error('Failed to fetch chart data:', err);
    }
  };

  const addReading = async (readingData: Omit<BloodSugar, '_id' | 'userId' | 'createdAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/blood-sugar', readingData);
      setReadings(prev => [response.data, ...prev]);
      await fetchStats();
      await fetchChartData();
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add blood sugar reading');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateReading = async (id: string, updateData: Partial<BloodSugar>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/api/blood-sugar/${id}`, updateData);
      setReadings(prev => prev.map(reading => reading._id === id ? response.data : reading));
      await fetchStats();
      await fetchChartData();
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update blood sugar reading');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteReading = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/blood-sugar/${id}`);
      setReadings(prev => prev.filter(reading => reading._id !== id));
      await fetchStats();
      await fetchChartData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete blood sugar reading');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();
    fetchStats();
    fetchChartData();
  }, []);

  return {
    readings,
    stats,
    chartData,
    loading,
    error,
    fetchReadings,
    fetchStats,
    fetchChartData,
    addReading,
    updateReading,
    deleteReading,
  };
}
