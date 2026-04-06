import express from 'express';
import BloodSugar from '../models/BloodSugar';
import { IBloodSugar } from '../types';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    const query: any = {};
    
    if (startDate || endDate) {
      query.measuredAt = {};
      if (startDate) query.measuredAt.$gte = new Date(startDate as string);
      if (endDate) query.measuredAt.$lte = new Date(endDate as string);
    }

    const readings = await BloodSugar.find(query)
      .select('value measuredAt notes') // Remove unit field
      .sort({ measuredAt: -1 })
      .limit(Number(limit) * Number(page))
      .skip((Number(page) - 1) * Number(limit));

    const total = await BloodSugar.countDocuments(query);

    res.json({
      readings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blood sugar readings' });
  }
});

router.post('/', async (req, res) => {
  try {
    const readingData: Omit<IBloodSugar, 'createdAt'> = req.body;

    const reading = new BloodSugar(readingData);

    await reading.save();
    res.status(201).json(reading);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blood sugar reading' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const reading = await BloodSugar.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!reading) {
      return res.status(404).json({ error: 'Blood sugar reading not found' });
    }

    return res.json(reading);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update blood sugar reading' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const reading = await BloodSugar.findOneAndDelete({ _id: id });

    if (!reading) {
      return res.status(404).json({ error: 'Blood sugar reading not found' });
    }

    return res.json({ message: 'Blood sugar reading deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete blood sugar reading' });
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

    const stats = await BloodSugar.aggregate([
      {
        $match: {
          measuredAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          avgValue: { $avg: '$value' },
          minValue: { $min: '$value' },
          maxValue: { $max: '$value' },
          totalReadings: { $sum: 1 }
        }
      }
    ]);

    res.json(stats[0] || { 
      avgValue: 0, 
      minValue: 0, 
      maxValue: 0, 
      totalReadings: 0 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blood sugar stats' });
  }
});

router.get('/chart', async (req, res) => {
  try {
    const { period = 'week' } = req.query;

    const now = new Date();
    let startDate: Date;
    let groupFormat: string;

    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        groupFormat = '%H:%M';
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupFormat = '%m-%d';
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        groupFormat = '%m-%d';
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupFormat = '%m-%d';
    }

    const query: any = {
      measuredAt: { $gte: startDate }
    };

    const chartData = await BloodSugar.aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: groupFormat,
              date: '$measuredAt'
            }
          },
          avgValue: { $avg: '$value' },
          readings: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

export default router;
