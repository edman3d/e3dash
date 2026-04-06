export interface IMedication {
  name: string;
  dosage: string;
  frequency: string;
  takenAt: Date;
  createdAt: Date;
}

export interface IBloodSugar {
  value: number;
  measuredAt: Date;
  notes?: string;
  createdAt: Date;
}
