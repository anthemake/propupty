// tests/listings.test.ts

import { expect, test } from '@jest/globals';

// Dummy listing search function
function searchListings(listings: any[], query: string) {
  return listings.filter((listing) =>
    listing.title.toLowerCase().includes(query.toLowerCase())
  );
}

const mockListings = [
  { title: 'Modern Condo in Richmond' },
  { title: 'Luxury Apartment Downtown' },
  { title: 'Smart City Tech Loft' },
  { title: 'Historic Home Scott’s Addition' },
  { title: 'Family Home in West End' },
];

test('searchListings returns correct results', () => {
  const results = searchListings(mockListings, 'Condo');
  expect(results.length).toBe(1);
  expect(results[0].title).toBe('Modern Condo in Richmond');
});

test('searchListings handles no matches', () => {
  const results = searchListings(mockListings, 'Farm');
  expect(results.length).toBe(0);
});
