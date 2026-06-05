const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  const client = await pool.connect();
  try {
    console.log("Creating tables...");
    
    // Create registrations table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id SERIAL PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        whatsapp TEXT,
        attendance TEXT,
        bus TEXT,
        bus_address TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create admins table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed admin
    const email = 'admin@phaneroo.com';
    const password = 'admin-password-123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingAdmin = await client.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (existingAdmin.rows.length === 0) {
      await client.query(
        'INSERT INTO admins (email, password, name) VALUES ($1, $2, $3)',
        [email, hashedPassword, 'Phaneroo Admin']
      );
      console.log('Admin seeded successfully!');
      console.log('Email:', email);
      console.log('Password:', password);
    } else {
      console.log('Admin already exists.');
    }

  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
