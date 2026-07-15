// Import starter contacts into the database.

const targetDb = 'test';
const targetCollection = 'contacts';

const contacts = [
  {
    firstName: 'Parker',
    lastName: 'Jones',
    email: 'parker.jones@example.com',
    favoriteColor: 'Blue',
    birthday: '1999-04-12'
  },
  {
    firstName: 'Avery',
    lastName: 'Smith',
    email: 'avery.smith@example.com',
    favoriteColor: 'Green',
    birthday: '2000-09-30'
  },
  {
    firstName: 'Jordan',
    lastName: 'Lee',
    email: 'jordan.lee@example.com',
    favoriteColor: 'Orange',
    birthday: '1998-11-05'
  },
  {
    firstName: 'Taylor',
    lastName: 'Miller',
    email: 'taylor.miller@example.com',
    favoriteColor: 'Red',
    birthday: '1997-02-18'
  },
  {
    firstName: 'Morgan',
    lastName: 'Davis',
    email: 'morgan.davis@example.com',
    favoriteColor: 'Purple',
    birthday: '2001-07-22'
  }
];

use(targetDb);

const collection = db.getCollection(targetCollection);
collection.deleteMany({});
const result = collection.insertMany(contacts);

print('Inserted documents:', Object.keys(result.insertedIds).length);
print('Database:', targetDb);
print('Collection:', targetCollection);
