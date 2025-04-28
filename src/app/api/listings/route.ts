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
      listings = db.prepare('SELECT * FROM listings WHERE title LIKE ? OR location LIKE ?').all(`%${query}%`, `%${query}%`);
    } else {
      listings = [];
    }
  
    // Inject fake lat/lng for now if missing
    listings = listings.map((listing: any) => ({
      ...listing,
      lat: listing.lat ?? (37.54 + Math.random() * 0.1),
      lng: listing.lng ?? (-77.44 + Math.random() * 0.1),
    }));
  
    return NextResponse.json(listings);
  }