import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export async function GET(req: Request) {
    const dbPath = path.join(process.cwd(), 'src', 'lib', 'listings.db');
    const db = new Database(dbPath);
    

  const { searchParams } = new URL(req.url);
  const zone = searchParams.get('zone');

  let listings;
  if (zone) {
    listings = db.prepare('SELECT * FROM listings WHERE zone = ?').all(zone);
  } else {
    listings = db.prepare('SELECT * FROM listings').all();
  }

  listings = listings.map((listing: any) => ({
    ...listing,
    lat: listing.lat ?? 37.54 + Math.random() * 0.05,
    lng: listing.lng ?? -77.44 + Math.random() * 0.05,
  }));

  return NextResponse.json(listings);
}
