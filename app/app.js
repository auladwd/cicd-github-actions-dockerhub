const express = require('express');

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'devops-cicd-demo',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/info', (_req, res) => {
  res.json({
    app: 'devops-cicd-demo',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/api/sum', (req, res) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);

  if (Number.isNaN(a) || Number.isNaN(b)) {
    return res.status(400).json({ error: 'Query params a and b must be valid numbers' });
  }

  res.json({ a, b, result: a + b });
});

module.exports = app;
