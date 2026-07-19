// Import starter size profiles and breeds into database.

const targetDb = 'dog-breeds-db';

const sizeProfiles = [
  {
    profileName: 'Small',
    minWeightLbs: 5,
    maxWeightLbs: 24,
    minHeightInches: 6,
    maxHeightInches: 14
  },
  {
    profileName: 'Medium',
    minWeightLbs: 25,
    maxWeightLbs: 55,
    minHeightInches: 15,
    maxHeightInches: 22
  },
  {
    profileName: 'Large',
    minWeightLbs: 56,
    maxWeightLbs: 120,
    minHeightInches: 23,
    maxHeightInches: 34
  }
];

const breeds = [
  {
    breedName: 'Labrador Retriever',
    averageWeightLbs: 65,
    averageHeightInches: 23,
    sheddingSeverity: 4,
    hardiness: 8,
    hypoallergenic: false,
    intelligenceScale: 8,
    energyLevel: 8,
    trainability: 9,
    lifeExpectancyYears: 12,
    barkingLevel: 5,
    goodWithChildren: true,
    originCountry: 'Canada'
  },
  {
    breedName: 'Poodle',
    averageWeightLbs: 45,
    averageHeightInches: 21,
    sheddingSeverity: 1,
    hardiness: 7,
    hypoallergenic: true,
    intelligenceScale: 10,
    energyLevel: 7,
    trainability: 10,
    lifeExpectancyYears: 13,
    barkingLevel: 4,
    goodWithChildren: true,
    originCountry: 'Germany'
  },
  {
    breedName: 'Siberian Husky',
    averageWeightLbs: 50,
    averageHeightInches: 22,
    sheddingSeverity: 5,
    hardiness: 9,
    hypoallergenic: false,
    intelligenceScale: 7,
    energyLevel: 10,
    trainability: 6,
    lifeExpectancyYears: 12,
    barkingLevel: 6,
    goodWithChildren: true,
    originCountry: 'Russia'
  }
];

use(targetDb);

const sizeProfilesCollection = db.getCollection('sizeProfiles');
sizeProfilesCollection.deleteMany({});
const sizeProfileResult = sizeProfilesCollection.insertMany(sizeProfiles);

const breedsCollection = db.getCollection('breeds');
breedsCollection.deleteMany({});
const breedsResult = breedsCollection.insertMany(breeds);

print('Inserted size profiles:', Object.keys(sizeProfileResult.insertedIds).length);
print('Inserted breeds:', Object.keys(breedsResult.insertedIds).length);
print('Database:', targetDb);
