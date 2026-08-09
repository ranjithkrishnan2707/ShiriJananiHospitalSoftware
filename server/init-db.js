import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function initDatabase() {
  console.log('🔄 Connecting to MySQL server on localhost:3306...');
  
  let connection;
  try {
    // 1. Connect without selecting database to create it
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server successfully!');

    // 2. Read schema.sql
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    const sqlScript = fs.readFileSync(schemaPath, 'utf8');

    console.log('📜 Executing schema.sql to create database and tables...');
    await connection.query(sqlScript);

    console.log('🎉 SUCCESS: Database "janani_hospital_db" and all tables created successfully!');
  } catch (err) {
    console.error('❌ Error creating MySQL database:', err.message);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🔑 Access denied for user. Please check DB_PASSWORD in your .env file.');
    }
  } finally {
    if (connection) await connection.end();
  }
}

initDatabase();
