import mongoose, { Schema, Document } from 'mongoose';

interface IMedicationTypeDocument extends Document {
  name: string;
  dosage: string;
  createdAt: Date;
}

const medicationTypeSchema = new Schema<IMedicationTypeDocument>({
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
    maxlength: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

medicationTypeSchema.index({ name: 1 });
medicationTypeSchema.index({ createdAt: -1 });

export const MedicationType = mongoose.model<IMedicationTypeDocument>('MedicationType', medicationTypeSchema, 'medication-types');
export default MedicationType;
