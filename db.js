import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const db = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

db.getConnection((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MYSQL Database Connected...");
  }
})

export default db;