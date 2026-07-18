const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const router = express.Router();
const breedsCollection = () => getDb().collection('breeds');

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function validateBreedPayload(payload) {
  const requiredFields = [
    'breedName',
    'averageWeightLbs',
    'averageHeightInches',
    'sheddingSeverity',
    'hardiness',
    'hypoallergenic',
    'intelligenceScale',
    'energyLevel',
    'trainability',
    'lifeExpectancyYears',
    'barkingLevel',
    'goodWithChildren',
    'originCountry',
  ];

  const missingFields = requiredFields.filter((field) => payload[field] === undefined || payload[field] === null || payload[field] === '');
  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Missing required field(s): ${missingFields.join(', ')}`,
    };
  }

  if (typeof payload.breedName !== 'string' || typeof payload.originCountry !== 'string') {
    return {
      isValid: false,
      message: 'breedName and originCountry must be strings.',
    };
  }

  const integerFields = [
    { key: 'averageWeightLbs', min: 1, max: 250 },
    { key: 'averageHeightInches', min: 4, max: 50 },
    { key: 'sheddingSeverity', min: 1, max: 5 },
    { key: 'hardiness', min: 1, max: 10 },
    { key: 'intelligenceScale', min: 1, max: 10 },
    { key: 'energyLevel', min: 1, max: 10 },
    { key: 'trainability', min: 1, max: 10 },
    { key: 'lifeExpectancyYears', min: 4, max: 25 },
    { key: 'barkingLevel', min: 1, max: 10 },
  ];

  for (const field of integerFields) {
    const numericValue = toNumber(payload[field.key]);
    if (!Number.isInteger(numericValue) || numericValue < field.min || numericValue > field.max) {
      return {
        isValid: false,
        message: `${field.key} must be an integer between ${field.min} and ${field.max}.`,
      };
    }
  }

  if (typeof payload.hypoallergenic !== 'boolean' || typeof payload.goodWithChildren !== 'boolean') {
    return {
      isValid: false,
      message: 'hypoallergenic and goodWithChildren must be booleans.',
    };
  }

  if (payload.sizeProfileId && !ObjectId.isValid(payload.sizeProfileId)) {
    return {
      isValid: false,
      message: 'sizeProfileId must be a valid MongoDB ObjectId when provided.',
    };
  }

  return { isValid: true };
}

function normalizeBreed(payload) {
  const normalized = {
    breedName: payload.breedName.trim(),
    averageWeightLbs: Number(payload.averageWeightLbs),
    averageHeightInches: Number(payload.averageHeightInches),
    sheddingSeverity: Number(payload.sheddingSeverity),
    hardiness: Number(payload.hardiness),
    hypoallergenic: payload.hypoallergenic,
    intelligenceScale: Number(payload.intelligenceScale),
    energyLevel: Number(payload.energyLevel),
    trainability: Number(payload.trainability),
    lifeExpectancyYears: Number(payload.lifeExpectancyYears),
    barkingLevel: Number(payload.barkingLevel),
    goodWithChildren: payload.goodWithChildren,
    originCountry: payload.originCountry.trim(),
  };

  if (payload.sizeProfileId) {
    normalized.sizeProfileId = new ObjectId(payload.sizeProfileId);
  }

  return normalized;
}

async function ensureUniqueBreedName(breedName, currentId) {
  const existing = await breedsCollection().findOne({
    breedName: { $regex: `^${escapeRegex(breedName)}$`, $options: 'i' },
  });

  if (!existing) {
    return true;
  }

  if (currentId && existing._id.toString() === currentId) {
    return true;
  }

  return false;
}

router.get('/', async (req, res) => {
  try {
    const breeds = await breedsCollection().find().toArray();
    return res.status(200).json(breeds);
  } catch (error) {
    console.error('Error loading breeds:', error);
    return res.status(500).json({ message: 'Server error while loading breeds.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid breed id.' });
    }

    const breed = await breedsCollection().findOne({ _id: new ObjectId(id) });

    if (!breed) {
      return res.status(404).json({ message: 'Breed not found.' });
    }

    return res.status(200).json(breed);
  } catch (error) {
    console.error('Error loading breed by id:', error);
    return res.status(500).json({ message: 'Server error while loading breed.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const validation = validateBreedPayload(req.body || {});
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    const normalizedBreed = normalizeBreed(req.body);

    const isUnique = await ensureUniqueBreedName(normalizedBreed.breedName);
    if (!isUnique) {
      return res.status(409).json({ message: 'A breed with that name already exists.' });
    }

    const result = await breedsCollection().insertOne(normalizedBreed);
    return res.status(201).json({
      message: 'Breed created successfully.',
      id: result.insertedId,
    });
  } catch (error) {
    console.error('Error creating breed:', error);
    return res.status(500).json({ message: 'Server error while creating breed.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid breed id.' });
    }

    const validation = validateBreedPayload(req.body || {});
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    const normalizedBreed = normalizeBreed(req.body);

    const isUnique = await ensureUniqueBreedName(normalizedBreed.breedName, id);
    if (!isUnique) {
      return res.status(409).json({ message: 'A breed with that name already exists.' });
    }

    const result = await breedsCollection().replaceOne(
      { _id: new ObjectId(id) },
      normalizedBreed
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Breed not found.' });
    }

    return res.status(200).json({ message: 'Breed updated successfully.' });
  } catch (error) {
    console.error('Error updating breed:', error);
    return res.status(500).json({ message: 'Server error while updating breed.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid breed id.' });
    }

    const result = await breedsCollection().deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Breed not found.' });
    }

    return res.status(200).json({ message: 'Breed deleted successfully.' });
  } catch (error) {
    console.error('Error deleting breed:', error);
    return res.status(500).json({ message: 'Server error while deleting breed.' });
  }
});

module.exports = router;
