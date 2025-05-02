import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export async function GET(req: Request) {
  const dbPath = path.join(process.cwd(), 'src', 'lib', 'listings.db');
  const db = new Database(dbPath);

  const { searchParams } = new URL(req.url);
  const zone = searchParams.get('zone');
  const query = searchParams.get('query');

  let listings;

  if (zone) {
    listings = db.prepare('SELECT * FROM listings WHERE zone = ?').all(zone);
  } else if (query) {
    listings = db
      .prepare('SELECT * FROM listings WHERE LOWER(title) LIKE ?')
      .all(`%${query.toLowerCase()}%`);
  } else {
    listings = db.prepare('SELECT * FROM listings').all();
  }

  interface Listing {
    id: number;
    title: string;
    location: string;
    price: string;
    image: string;
    zone: string;
    lat?: number;
    lng?: number;
  }
  
  listings = (listings as Listing[]).map((listing) => ({
    ...listing,
    lat: listing.lat ?? 37.54 + Math.random() * 0.1,
    lng: listing.lng ?? -77.44 + Math.random() * 0.1,
  }));
  

  return NextResponse.json(listings);
}
