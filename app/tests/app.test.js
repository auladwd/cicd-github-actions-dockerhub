const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../app');

let server;
let baseUrl;

describe('CI/CD Demo API', () => {
  before(() => {
    return new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const { port } = server.address();
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(() => {
    return new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it('GET /health should return 200 and healthy status', async () => {
    const res = await fetch(`${baseUrl}/health`);
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.status, 'healthy');
  });

  it('GET /api/sum should return sum of two numbers', async () => {
    const res = await fetch(`${baseUrl}/api/sum?a=10&b=25`);
    const data = await res.json();
    assert.equal(res.status, 200);
    assert.equal(data.result, 35);
  });

  it('GET /api/sum should return 400 for invalid input', async () => {
    const res = await fetch(`${baseUrl}/api/sum?a=abc&b=5`);
    assert.equal(res.status, 400);
  });
});
