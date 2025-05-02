

import { expect, test } from '@jest/globals';



export type Listing = {
  id: number;
  title: string;
  location: string;
  price: string;
  image: string;
  zone: string;
  lat: number;
  lng: number;
};


function searchListings(listings: Listing[], query: string) {
  return listings.filter((listing) =>
    listing.title.toLowerCase().includes(query.toLowerCase())
  );
}


const mockListings: Listing[] = [
  {
    id: 1,
    title: "Listing 1",
    location: "Richmond",
    price: "$200,000",
    image: "/images/placeholder-1.jpg",
    zone: "The Fan District",
    lat: 37.5413,
    lng: -77.4348,
  },
  {
    id: 2,
    title: "Listing 2",
    location: "Scott's Addition",
    price: "$350,000",
    image: "/images/placeholder-2.jpg",
    zone: "Scott's Addition",
    lat: 37.5683,
    lng: -77.4567,
  },
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
