const express = require('express');
const { Pool } = require('pg');
const client = require('prom-client');

const app = express();
const port = process.env.PORT || 9034;

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const metricPrefix = 'web28_';

const httpRequestsTotal = new client.Counter({
  name: `${metricPrefix}http_requests_total`,
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'status', 'path']
});

const httpRequestDuration = new client.Histogram({
  name: `${metricPrefix}http_request_duration_seconds`,
  help: 'HTTP request latency in seconds',
  labelNames: ['method', 'path'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]
});

const activeConnections = new client.Gauge({
  name: `${metricPrefix}active_connections`,
  help: 'Current number of active connections'
});

const dbStatus = new client.Gauge({
  name: `${metricPrefix}db_status`,
  help: 'Database connection status (1=up, 0=down)'
});

register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDuration);
register.registerMetric(activeConnections);
register.registerMetric(dbStatus);

app.use((req, res, next) => {
  const start = Date.now();
  activeConnections.inc();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const status = res.statusCode.toString();
    const method = req.method;
    const path = req.route?.path || req.path;
    
    httpRequestsTotal.inc({ method, status, path });
    httpRequestDuration.observe({ method, path }, duration);
    activeConnections.dec();
  });
  
  next();
});

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'app_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

setInterval(async () => {
  try {
    await pool.query('SELECT 1');
    dbStatus.set(1);
  } catch (err) {
    dbStatus.set(0);
  }
}, 15000);

console.log(JSON.stringify({
  level: 'info',
  message: 'Service starting with metrics',
  student_id: process.env.STU_ID,
  group: process.env.STU_GROUP,
  variant: process.env.STU_VARIANT,
  metric_prefix: metricPrefix,
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
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
app.get('/', (req, res) => {
  res.json({
    service: 'BSTU Lab04 Monitoring',
    variant: process.env.STU_VARIANT,
    student_id: process.env.STU_ID,
    group: process.env.STU_GROUP,
    metric_prefix: metricPrefix
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
  console.log('SIGTERM received, closing server...');
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
});
