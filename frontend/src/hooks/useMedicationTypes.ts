import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

interface MedicationType {
  _id: string;
  name: string;
  dosage: string;
  createdAt: string;
}

export function useMedicationTypes() {
  const [medicationTypes, setMedicationTypes] = useState<MedicationType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedicationTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/medication-types');
      setMedicationTypes(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch medication types');
    } finally {
      setLoading(false);
    }
  }, []);

  const addMedicationType = async (medicationTypeData: Omit<MedicationType, '_id' | 'createdAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/api/medication-types', medicationTypeData);
      setMedicationTypes(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add medication type');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMedicationType = async (id: string, updateData: Partial<MedicationType>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/api/medication-types/${id}`, updateData);
      setMedicationTypes(prev => prev.map(type => type._id === id ? response.data : type));
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update medication type');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMedicationType = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/medication-types/${id}`);
      setMedicationTypes(prev => prev.filter(type => type._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete medication type');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicationTypes();
  }, [fetchMedicationTypes]);

  return {
    medicationTypes,
    loading,
    error,
    fetchMedicationTypes,
    addMedicationType,
    updateMedicationType,
    deleteMedicationType,
  };
}
