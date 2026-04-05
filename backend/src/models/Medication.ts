import mongoose, { Schema, Document } from 'mongoose';

interface IMedicationDocument extends Document {
  name: string;
  dosage: string;
  frequency: string;
  takenAt: Date;
  createdAt: Date;
}

const medicationSchema = new Schema<IMedicationDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  dosage: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  frequency: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  takenAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

medicationSchema.index({ takenAt: -1 });
medicationSchema.index({ createdAt: -1 });

export const Medication = mongoose.model<IMedicationDocument>('Medication', medicationSchema, 'medication-tracker');
export default Medication;
