import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'listings.db');
const db = new Database(dbPath);

const zones = [
    { name: "Dominion Hills",  lat: 38.883923, lng: -77.136283 },
    { name: "Ballston", lat: 38.8826, lng: -77.1112 },
    { name: "Rosslyn", lat: 38.8951, lng: -77.0703 },
    { name: "Clarendon", lat: 38.8868, lng: -77.0961 },
    { name: "Pentagon City", lat: 38.8626, lng: -77.0594 },
  ];
  

db.exec(`DROP TABLE IF EXISTS listings`);


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

    const latOffset = (Math.random() - 0.5) * 0.01;
    const lngOffset = (Math.random() - 0.5) * 0.01;

    const types = ["Condo", "Apartment", "Townhouse", "Studio", "Loft"];
    const descs = [
      "Modern and bright",
      "Cozy and pet-friendly",
      "Steps from metro",
      "Great skyline views",
      "Renovated interior",
    ];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const desc = descs[Math.floor(Math.random() * descs.length)];
    
    insert.run(
      `${type} in ${zone.name}`,
      `${desc}, Arlington, VA`,
      `$${Math.floor(Math.random() * 400 + 100)}k`,
      `/placeholder-${(i % 5) + 1}.jpg`,
      zone.name,
      zone.lat + latOffset,
      zone.lng + lngOffset
    );
    
      
}

console.log('✅ Database reseeded with lat/lng!');
