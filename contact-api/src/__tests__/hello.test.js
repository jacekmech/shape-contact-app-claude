const request = require('supertest');
const app = require('../app');

describe('GET /api/hello', () => {
  it('returns 200 with a message field', async () => {
    const res = await request(app).get('/api/hello');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(typeof res.body.message).toBe('string');
  });

  it('returns the default message when HELLO_MESSAGE is not set', async () => {
    const res = await request(app).get('/api/hello');
    expect(res.body.message).toBe('Hello, World!');
  });
});
