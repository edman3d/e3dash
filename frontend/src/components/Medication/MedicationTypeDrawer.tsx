import { useState } from 'react';

interface MedicationTypeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  medicationTypes: any[];
  addMedicationType: (data: any) => Promise<any>;
  updateMedicationType: (id: string, data: any) => Promise<any>;
  deleteMedicationType: (id: string) => Promise<void>;
  loading: boolean;
}

interface MedicationTypeFormData {
  name: string;
  dosage: string;
}

export default function MedicationTypeDrawer({ 
  isOpen, 
  onClose, 
  medicationTypes, 
  addMedicationType, 
  updateMedicationType, 
  deleteMedicationType, 
  loading 
}: MedicationTypeDrawerProps) {
  const [formData, setFormData] = useState<MedicationTypeFormData>({ name: '', dosage: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.dosage.trim()) {
      return;
    }

    try {
      if (editingId) {
        await updateMedicationType(editingId, formData);
      } else {
        await addMedicationType(formData);
      }
      
      setFormData({ name: '', dosage: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Failed to save medication type:', error);
    }
  };

  const handleEdit = (type: any) => {
    setFormData({ name: type.name, dosage: type.dosage });
    setEditingId(type._id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this medication type?')) {
      try {
        await deleteMedicationType(id);
      } catch (error) {
        console.error('Failed to delete medication type:', error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', dosage: '' });
    setEditingId(null);
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`absolute top-0 left-0 h-full w-96 bg-white shadow-xl transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Configure Medications</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <div className="p-6 border-b">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medication Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="e.g., Aspirin"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage
                </label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  className="input"
                  placeholder="e.g., 100mg"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {editingId ? 'Update' : 'Add'} Medication
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Medication Types</h3>
            
            {medicationTypes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No medication types configured yet</p>
            ) : (
              <div className="space-y-3">
                {medicationTypes.map((type) => (
                  <div key={type._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{type.name}</p>
                      <p className="text-sm text-gray-500">{type.dosage}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(type)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(type._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
