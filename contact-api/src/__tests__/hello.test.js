const request = require('supertest');

describe('GET /api/hello', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    delete process.env.HELLO_MESSAGE;
  });

  test('returns 200 with default message', async () => {
    const app = require('../app');
    const res = await request(app).get('/api/hello');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Hello, world!');
  });

  test('returns 200 with custom HELLO_MESSAGE when set', async () => {
    process.env.HELLO_MESSAGE = 'Custom test message';
    const app = require('../app');
    const res = await request(app).get('/api/hello');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Custom test message');
  });
});
