import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB_NAME || 'janani_hospital_db';
const host = process.env.DB_HOST || 'localhost';
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';
const port = parseInt(process.env.DB_PORT || '3306', 10);

// Auto-initialize MySQL Database & Schema on server startup
async function ensureDatabaseExists() {
  try {
    const rootConn = await mysql.createConnection({
      host, user, password, port, multipleStatements: true
    });

    const [dbs] = await rootConn.query(`SHOW DATABASES LIKE '${dbName}'`);
    if (dbs.length === 0) {
      console.log(`📦 Database "${dbName}" not found. Auto-creating database & schema for client...`);
      const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const sqlScript = fs.readFileSync(schemaPath, 'utf8');
        await rootConn.query(sqlScript);
        console.log(`🎉 AUTO-INIT SUCCESS: Created database "${dbName}" and all tables from schema.sql!`);
      }
    }
    await rootConn.end();
  } catch (err) {
    console.warn(`⚠️ MySQL Auto-Init Notice: ${err.message}`);
  }
}

// Execute auto-init check
ensureDatabaseExists();

const pool = mysql.createPool({
  host,
  user,
  password,
  database: dbName,
  port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ MySQL Connected: "${dbName}" on ${host}:${port}`);
    connection.release();
  } catch (err) {
    console.warn(`⚠️ MySQL Connection Warning: ${err.message}`);
  }
})();

export default pool;
