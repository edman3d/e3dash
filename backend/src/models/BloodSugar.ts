import mongoose, { Schema, Document } from 'mongoose';

interface IBloodSugarDocument extends Document {
  value: number;
  measuredAt: Date;
  notes?: string;
  createdAt: Date;
}

const bloodSugarSchema = new Schema<IBloodSugarDocument>({
  value: {
    type: Number,
    required: true,
    min: 0,
    max: 1000
  },
  measuredAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

bloodSugarSchema.index({ measuredAt: -1 });
bloodSugarSchema.index({ createdAt: -1 });

export const BloodSugar = mongoose.model<IBloodSugarDocument>('BloodSugar', bloodSugarSchema, 'bloodsugar-tracker');
export default BloodSugar;
