import { useState, useEffect } from 'react';
import api from '../services/api';

interface Medication {
  _id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string;
  takenAt: string;
  createdAt: string;
}

interface MedicationStats {
  totalTaken: number;
  uniqueMedicationCount: number;
}

export function useMedication() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [stats, setStats] = useState<MedicationStats>({ totalTaken: 0, uniqueMedicationCount: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedications = async (page = 1, limit = 10, startDate?: string, endDate?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await api.get(`/api/medication?${params}`);
      setMedications(response.data.medications);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch medications');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (period = 'week') => {
    try {
      const response = await api.get(`/api/medication/stats?period=${period}`);
      setStats(response.data);
    } catch (err: any) {
      console.error('Failed to fetch medication stats:', err);
    }
  };

  const addMedication = async (medicationData: Omit<Medication, '_id' | 'userId' | 'createdAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/medication', medicationData);
      setMedications(prev => [response.data, ...prev]);
      await fetchStats();
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add medication');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMedication = async (id: string, updateData: Partial<Medication>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/api/medication/${id}`, updateData);
      setMedications(prev => prev.map(med => med._id === id ? response.data : med));
      await fetchStats();
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update medication');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMedication = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/medication/${id}`);
      setMedications(prev => prev.filter(med => med._id !== id));
      await fetchStats();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete medication');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
    fetchStats();
  }, []);

  return {
    medications,
    stats,
    loading,
    error,
    fetchMedications,
    fetchStats,
    addMedication,
    updateMedication,
    deleteMedication,
  };
}
