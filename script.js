require('dotenv').config();
const fs = require('fs');
const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST,
  port: 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

async function run() {
  try {
    await client.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS dictionary (
        id SERIAL PRIMARY KEY,
        word VARCHAR(255) UNIQUE
      );
    `);
    const rawData = fs.readFileSync('words_dictionary.json', 'utf-8');
    const wordsArray = JSON.parse(rawData);
    for (const word of Object.keys(wordsArray)) {
      try {
        await client.query(
          'INSERT INTO dictionary (word) VALUES ($1) ON CONFLICT (word) DO NOTHING;',
          [word],
        );
        console.log('inserted ', word);
      } catch (err) {
        console.error('error when inserting: ', err.message);
      }
    }
    await client.end();
  } catch (err) {
    console.error('Error: ', err);
  }
}

run();
