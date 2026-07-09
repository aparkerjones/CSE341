const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { id } = req.query;

    if (id) {
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid contact id.' });
      }

      const contact = await getDb()
        .collection('contacts')
        .findOne({ _id: new ObjectId(id) });

      if (!contact) {
        return res.status(404).json({ message: 'Contact not found.' });
      }

      return res.status(200).json(contact);
    }

    const contacts = await getDb().collection('contacts').find().toArray();
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

    const contact = await getDb()
      .collection('contacts')
      .findOne({ _id: new ObjectId(id) });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    return res.status(200).json(contact);
  } catch (error) {
    console.error('Error loading contact by id:', error);
    return res.status(500).json({ message: 'Server error while loading contact.' });
  }
});

module.exports = router;
