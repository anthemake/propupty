import Database from 'better-sqlite3';
import { existsSync } from 'fs';

const dbFile = 'src/lib/listings.db';

// If the database file already exists, skip creating again
if (existsSync(dbFile)) {
  console.log('Database already exists. Skipping setup.');
  process.exit(0);
}

const db = new Database(dbFile);

db.exec(`
  CREATE TABLE listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    price TEXT NOT NULL,
    image TEXT NOT NULL
  );

  INSERT INTO listings (title, location, price, image) VALUES
  ('Modern Loft Downtown', 'Riverfront / Canal Walk District', '$2500/mo', '/loft.jpg'),
  ('Smart Home Apartment', 'Henrico Smart City', '$2200/mo', '/smart-apartment.jpg'),
  ('Charming Fan House', 'The Fan District', '$2800/mo', '/fanhouse.jpg'),
  ('Trendy Studio', 'Scott\'s Addition', '$2100/mo', '/scottsaddition.jpg'),
  ('Luxury Condo', 'West End', '$3200/mo', '/westend.jpg');
`);

console.log('✅ Database setup complete!');
