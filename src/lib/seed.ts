import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'listings.db');
const db = new Database(dbPath);

const zones = [
  { 
    name: "Riverfront / Canal Walk District",
    lat: 37.5375, 
    lng: -77.4375 
  },
  { 
    name: "Henrico Smart City",
    lat: 37.575, 
    lng: -77.31 
  },
  { 
    name: "The Fan District",
    lat: 37.547, 
    lng: -77.465 
  },
  { 
    name: "Scott's Addition",
    lat: 37.562, 
    lng: -77.470 
  },
  { 
    name: "West End",
    lat: 37.596, 
    lng: -77.612 
  }
];

// 🔥 Drop old table
db.exec(`DROP TABLE IF EXISTS listings`);

// 🔥 Re-create table with lat/lng
db.exec(`
  CREATE TABLE listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    location TEXT,
    price TEXT,
    image TEXT,
    zone TEXT,
    lat REAL,
    lng REAL
  )
`);

const insert = db.prepare(`
  INSERT INTO listings (title, location, price, image, zone, lat, lng)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

for (let i = 0; i < 30; i++) {
  const zone = zones[Math.floor(Math.random() * zones.length)];
  
  const latOffset = (Math.random() - 0.5) * 0.01;  // small random wiggle
  const lngOffset = (Math.random() - 0.5) * 0.01;

  insert.run(
    `Listing ${i + 1}`,
    "Richmond, VA",
    `$${Math.floor(Math.random() * 400 + 100)}k`,
    `/placeholder-${(i % 5) + 1}.jpg`,
    zone.name,
    zone.lat + latOffset,
    zone.lng + lngOffset
  );
}

console.log('✅ Database reseeded with lat/lng!');
