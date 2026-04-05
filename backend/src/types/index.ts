export interface IMedication {
  name: string;
  dosage: string;
  frequency: string;
  takenAt: Date;
  createdAt: Date;
}

export interface IBloodSugar {
  value: number;
  unit: 'mg/dL' | 'mmol/L';
  measuredAt: Date;
  notes?: string;
  createdAt: Date;
}
