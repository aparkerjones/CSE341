const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const router = express.Router();
const sizeProfilesCollection = () => getDb().collection('sizeProfiles');

function validateSizeProfilePayload(payload) {
  const requiredFields = ['profileName', 'minWeightLbs', 'maxWeightLbs', 'minHeightInches', 'maxHeightInches'];
  const missingFields = requiredFields.filter((field) => payload[field] === undefined || payload[field] === null || payload[field] === '');

  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Missing required field(s): ${missingFields.join(', ')}`,
    };
  }

  if (typeof payload.profileName !== 'string') {
    return {
      isValid: false,
      message: 'profileName must be a string.',
    };
  }

  const minWeight = Number(payload.minWeightLbs);
  const maxWeight = Number(payload.maxWeightLbs);
  const minHeight = Number(payload.minHeightInches);
  const maxHeight = Number(payload.maxHeightInches);

  if (![minWeight, maxWeight, minHeight, maxHeight].every(Number.isFinite)) {
    return {
      isValid: false,
      message: 'Weight and height fields must be valid numbers.',
    };
  }

  if (minWeight <= 0 || minHeight <= 0 || maxWeight < minWeight || maxHeight < minHeight) {
    return {
      isValid: false,
      message: 'Minimum values must be positive and maximum values must be greater than or equal to minimum values.',
    };
  }

  return { isValid: true };
}

router.get('/', async (req, res) => {
  try {
    const profiles = await sizeProfilesCollection().find().toArray();
    return res.status(200).json(profiles);
  } catch (error) {
    console.error('Error loading size profiles:', error);
    return res.status(500).json({ message: 'Server error while loading size profiles.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid size profile id.' });
    }

    const profile = await sizeProfilesCollection().findOne({ _id: new ObjectId(id) });

    if (!profile) {
      return res.status(404).json({ message: 'Size profile not found.' });
    }

    return res.status(200).json(profile);
  } catch (error) {
    console.error('Error loading size profile:', error);
    return res.status(500).json({ message: 'Server error while loading size profile.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const validation = validateSizeProfilePayload(req.body || {});
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    const newProfile = {
      profileName: req.body.profileName.trim(),
      minWeightLbs: Number(req.body.minWeightLbs),
      maxWeightLbs: Number(req.body.maxWeightLbs),
      minHeightInches: Number(req.body.minHeightInches),
      maxHeightInches: Number(req.body.maxHeightInches),
    };

    const result = await sizeProfilesCollection().insertOne(newProfile);
    return res.status(201).json({
      message: 'Size profile created successfully.',
      id: result.insertedId,
    });
  } catch (error) {
    console.error('Error creating size profile:', error);
    return res.status(500).json({ message: 'Server error while creating size profile.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid size profile id.' });
    }

    const validation = validateSizeProfilePayload(req.body || {});
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    const updatedProfile = {
      profileName: req.body.profileName.trim(),
      minWeightLbs: Number(req.body.minWeightLbs),
      maxWeightLbs: Number(req.body.maxWeightLbs),
      minHeightInches: Number(req.body.minHeightInches),
      maxHeightInches: Number(req.body.maxHeightInches),
    };

    const result = await sizeProfilesCollection().replaceOne(
      { _id: new ObjectId(id) },
      updatedProfile
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Size profile not found.' });
    }

    return res.status(200).json({ message: 'Size profile updated successfully.' });
  } catch (error) {
    console.error('Error updating size profile:', error);
    return res.status(500).json({ message: 'Server error while updating size profile.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid size profile id.' });
    }

    const result = await sizeProfilesCollection().deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Size profile not found.' });
    }

    return res.status(200).json({ message: 'Size profile deleted successfully.' });
  } catch (error) {
    console.error('Error deleting size profile:', error);
    return res.status(500).json({ message: 'Server error while deleting size profile.' });
  }
});

module.exports = router;
