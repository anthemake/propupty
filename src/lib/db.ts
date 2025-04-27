import Database from 'better-sqlite3';

const db = new Database('src/lib/listings.db');

export default db;
