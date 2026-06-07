const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 9034;

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'app_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

console.log(JSON.stringify({
  level: 'info',
  message: 'Service starting',
  student_id: process.env.STU_ID,
  group: process.env.STU_GROUP,
  variant: process.env.STU_VARIANT,
  timestamp: new Date().toISOString()
}));

app.get('/live', (req, res) => res.status(200).send('OK'));

app.get('/ready', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).send('READY');
  } catch (err) {
    res.status(503).send('NOT READY');
  }
});

app.get('/', (req, res) => {
  res.json({
    service: 'BSTU Lab01 Containerization',
    variant: process.env.STU_VARIANT,
    student_id: process.env.STU_ID,
    group: process.env.STU_GROUP
  });
});

const server = app.listen(port, () => {
  console.log(JSON.stringify({
    level: 'info',
    message: `Server listening on port ${port}`,
    port: port,
    timestamp: new Date().toISOString()
  }));
});

process.on('SIGTERM', () => {
  console.log(JSON.stringify({
    level: 'info',
    message: 'SIGTERM received, closing server...',
    timestamp: new Date().toISOString()
  }));
  
  server.close(async () => {
    console.log(JSON.stringify({
      level: 'info',
      message: 'HTTP server closed',
      timestamp: new Date().toISOString()
    }));
    
    await pool.end();
    console.log(JSON.stringify({
      level: 'info',
      message: 'Database connection closed',
      timestamp: new Date().toISOString()
    }));
    
    process.exit(0);
  });
});
