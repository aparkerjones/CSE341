const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const router = express.Router();
const contactsCollection = () => getDb().collection('contacts');

function validateContactPayload(payload) {
  const requiredFields = ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'];
  const missingFields = requiredFields.filter((field) => !payload[field]);

  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Missing required field(s): ${missingFields.join(', ')}`,
    };
  }

  const isStringField = requiredFields.every((field) => typeof payload[field] === 'string');
  if (!isStringField) {
    return {
      isValid: false,
      message: 'All contact fields must be strings.',
    };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(payload.email)) {
    return {
      isValid: false,
      message: 'Email format is invalid.',
    };
  }

  const birthdayPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!birthdayPattern.test(payload.birthday)) {
    return {
      isValid: false,
      message: 'Birthday must use YYYY-MM-DD format.',
    };
  }

  return { isValid: true };
}

router.get('/', async (req, res) => {
  try {
    const { id } = req.query;

    if (id) {
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid contact id.' });
      }

      const contact = await contactsCollection().findOne({ _id: new ObjectId(id) });

      if (!contact) {
        return res.status(404).json({ message: 'Contact not found.' });
      }

      return res.status(200).json(contact);
    }

    const contacts = await contactsCollection().find().toArray();
    return res.status(200).json(contacts);
  } catch (error) {
    console.error('Error loading contacts:', error);
    return res.status(500).json({ message: 'Server error while loading contacts.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid contact id.' });
    }

    const contact = await contactsCollection().findOne({ _id: new ObjectId(id) });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    return res.status(200).json(contact);
  } catch (error) {
    console.error('Error loading contact by id:', error);
    return res.status(500).json({ message: 'Server error while loading contact.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const validation = validateContactPayload(req.body || {});
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    const newContact = {
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
      email: req.body.email.trim(),
      favoriteColor: req.body.favoriteColor.trim(),
      birthday: req.body.birthday.trim(),
    };

    const result = await contactsCollection().insertOne(newContact);
    return res.status(201).json({
      message: 'Contact created successfully.',
      id: result.insertedId,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    return res.status(500).json({ message: 'Server error while creating contact.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid contact id.' });
    }

    const validation = validateContactPayload(req.body || {});
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    const updatedContact = {
      firstName: req.body.firstName.trim(),
      lastName: req.body.lastName.trim(),
      email: req.body.email.trim(),
      favoriteColor: req.body.favoriteColor.trim(),
      birthday: req.body.birthday.trim(),
    };

    const result = await contactsCollection().replaceOne(
      { _id: new ObjectId(id) },
      updatedContact
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    return res.status(200).json({ message: 'Contact updated successfully.' });
  } catch (error) {
    console.error('Error updating contact:', error);
    return res.status(500).json({ message: 'Server error while updating contact.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid contact id.' });
    }

    const result = await contactsCollection().deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    return res.status(200).json({ message: 'Contact deleted successfully.' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return res.status(500).json({ message: 'Server error while deleting contact.' });
  }
});

module.exports = router;
