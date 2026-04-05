import express from 'express';
import MedicationType from '../models/MedicationType';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const medicationTypes = await MedicationType.find()
      .sort({ name: 1 });
    
    return res.json(medicationTypes);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch medication types' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, dosage } = req.body;

    if (!name || !dosage) {
      return res.status(400).json({ error: 'Name and dosage are required' });
    }

    const existingType = await MedicationType.findOne({ name });
    if (existingType) {
      return res.status(400).json({ error: 'Medication type with this name already exists' });
    }

    const medicationType = new MedicationType({
      name: name.trim(),
      dosage: dosage.trim()
    });

    await medicationType.save();
    return res.status(201).json(medicationType);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create medication type' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dosage } = req.body;

    if (!name || !dosage) {
      return res.status(400).json({ error: 'Name and dosage are required' });
    }

    const existingType = await MedicationType.findOne({ 
      name: name.trim(), 
      _id: { $ne: id } 
    });
    
    if (existingType) {
      return res.status(400).json({ error: 'Medication type with this name already exists' });
    }

    const medicationType = await MedicationType.findByIdAndUpdate(
      id,
      { 
        name: name.trim(),
        dosage: dosage.trim()
      },
      { new: true, runValidators: true }
    );

    if (!medicationType) {
      return res.status(404).json({ error: 'Medication type not found' });
    }

    return res.json(medicationType);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update medication type' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const medicationType = await MedicationType.findByIdAndDelete(id);

    if (!medicationType) {
      return res.status(404).json({ error: 'Medication type not found' });
    }

    return res.json({ message: 'Medication type deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete medication type' });
  }
});

export default router;
