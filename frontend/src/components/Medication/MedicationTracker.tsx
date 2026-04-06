import { useState } from 'react';
import { useMedication } from '../../hooks/useMedication';
import { useMedicationTypes } from '../../hooks/useMedicationTypes';
import MedicationTypeDrawer from './MedicationTypeDrawer';
import { getESTDateTimeString } from '../../utils/timezone';

interface MedicationFormData {
  medicationTypeId: string;
  takenAt: string;
}

export default function MedicationTracker() {
  const { medications, loading, error, addMedication, deleteMedication } = useMedication();
  const { medicationTypes, fetchMedicationTypes, addMedicationType, updateMedicationType, deleteMedicationType, loading: medicationTypesLoading } = useMedicationTypes();
  const [showForm, setShowForm] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [formData, setFormData] = useState<MedicationFormData>({
    medicationTypeId: '',
    takenAt: getESTDateTimeString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.medicationTypeId) {
      return;
    }

    const selectedType = medicationTypes.find(type => type._id === formData.medicationTypeId);
    if (!selectedType) {
      return;
    }

    try {
      await addMedication({
        name: selectedType.name,
        dosage: selectedType.dosage,
        frequency: 'as needed',
        takenAt: formData.takenAt,
      });
      
      setFormData({
        medicationTypeId: '',
        takenAt: getESTDateTimeString(),
      });
      setShowForm(false);
    } catch (err) {
      console.error('Failed to add medication:', err);
    }
  };

  const getTodaysIntakes = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return medications.filter(medication => {
      const takenDate = new Date(medication.takenAt);
      return takenDate >= today && takenDate < tomorrow;
    });
  };

  const getRecentIntakes = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return medications.filter(medication => {
      const takenDate = new Date(medication.takenAt);
      return takenDate < today || takenDate >= tomorrow;
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this medication record?')) {
      try {
        await deleteMedication(id);
      } catch (err) {
        console.error('Failed to delete medication:', err);
      }
    }
  };

  if (loading && medications.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Medication Tracker</h2>
        <button
          onClick={() => setShowDrawer(true)}
          className="btn btn-secondary"
        >
          Configure Medications
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Add Medication Intake</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Add Medication'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medication
              </label>
              <select
                value={formData.medicationTypeId}
                onChange={(e) => setFormData({ ...formData, medicationTypeId: e.target.value })}
                className="input"
                required
              >
                <option value="">Select a medication</option>
                {medicationTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name} - {type.dosage}
                  </option>
                ))}
              </select>
              {medicationTypes.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  No medications configured. Click "Configure Medications" to add some.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taken At
              </label>
              <input
                type="datetime-local"
                value={formData.takenAt}
                onChange={(e) => setFormData({ ...formData, takenAt: e.target.value })}
                className="input"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Medication'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900">Today's Intakes</h3>
        {getTodaysIntakes().length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No intakes recorded for today yet.
          </div>
        ) : (
          getTodaysIntakes().map((medication) => (
            <div key={medication._id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{medication.name}</h3>
                  <div className="mt-1 space-y-1 text-sm text-gray-600">
                    <p><strong>Dosage:</strong> {medication.dosage}</p>
                    <p><strong>Taken at:</strong> {new Date(medication.takenAt).toLocaleDateString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(medication._id)}
                  className="ml-4 text-red-600 hover:text-red-800 text-sm"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900">Recent Intakes</h3>
        {getRecentIntakes().length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No recent intakes found.
          </div>
        ) : (
          getRecentIntakes().map((medication) => (
            <div key={medication._id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{medication.name}</h3>
                  <div className="mt-1 space-y-1 text-sm text-gray-600">
                    <p><strong>Dosage:</strong> {medication.dosage}</p>
                    <p><strong>Taken at:</strong> {new Date(medication.takenAt).toLocaleDateString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(medication._id)}
                  className="ml-4 text-red-600 hover:text-red-800 text-sm"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <MedicationTypeDrawer 
        isOpen={showDrawer} 
        onClose={() => {
          setShowDrawer(false);
          fetchMedicationTypes();
        }}
        medicationTypes={medicationTypes}
        addMedicationType={addMedicationType}
        updateMedicationType={updateMedicationType}
        deleteMedicationType={deleteMedicationType}
        loading={medicationTypesLoading}
      />
    </div>
  );
}
