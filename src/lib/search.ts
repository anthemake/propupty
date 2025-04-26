export type Listing = {
  title: string;
  location: string;
  price: string;
  image: string;
};

export function searchListings(listings: Listing[], query: string): Listing[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();

  return listings.filter((listing) =>
    listing.title.toLowerCase().includes(lowerQuery) ||
    listing.location.toLowerCase().includes(lowerQuery) ||
    listing.price.toLowerCase().includes(lowerQuery) ||
    listing.image.toLowerCase().includes(lowerQuery)
  );
}
