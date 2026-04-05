import express from 'express';
import Medication from '../models/Medication';
import { IMedication } from '../types';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    const query: any = {};
    
    if (startDate || endDate) {
      query.takenAt = {};
      if (startDate) query.takenAt.$gte = new Date(startDate as string);
      if (endDate) query.takenAt.$lte = new Date(endDate as string);
    }

    const medications = await Medication.find(query)
      .sort({ takenAt: -1 })
      .limit(Number(limit) * Number(page))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Medication.countDocuments(query);

    res.json({
      medications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medications' });
  }
});

router.post('/', async (req, res) => {
  try {
    const medicationData: Omit<IMedication, 'createdAt'> = req.body;

    const medication = new Medication(medicationData);

    await medication.save();
    res.status(201).json(medication);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create medication record' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const medication = await Medication.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!medication) {
      return res.status(404).json({ error: 'Medication record not found' });
    }

    return res.json(medication);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update medication record' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const medication = await Medication.findOneAndDelete({ _id: id });

    if (!medication) {
      return res.status(404).json({ error: 'Medication record not found' });
    }

    return res.json({ message: 'Medication record deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete medication record' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const { period = 'week' } = req.query;

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const stats = await Medication.aggregate([
      {
        $match: {
          takenAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalTaken: { $sum: 1 },
          uniqueMedications: { $addToSet: '$name' }
        }
      },
      {
        $project: {
          totalTaken: 1,
          uniqueMedicationCount: { $size: '$uniqueMedications' }
        }
      }
    ]);

    res.json(stats[0] || { totalTaken: 0, uniqueMedicationCount: 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medication stats' });
  }
});

export default router;
