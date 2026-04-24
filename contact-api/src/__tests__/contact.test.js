const request = require('supertest');

jest.mock('../infra/mailer');
const mailer = require('../infra/mailer');
const app = require('../app');

const validBody = { name: 'Alice', email: 'alice@example.com', message: 'Hello there.' };

describe('POST /api/contact', () => {
  beforeEach(() => {
    mailer.sendContactEmail.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns 200 with success=true for a valid submission', async () => {
    const res = await request(app).post('/api/contact').send(validBody);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
    expect(mailer.sendContactEmail).toHaveBeenCalledWith(validBody);
  });

  test('returns 422 with name error when name is missing', async () => {
    const res = await request(app).post('/api/contact').send({ ...validBody, name: '' });
    expect(res.status).toBe(422);
    expect(res.body.errors.name).toBeDefined();
    expect(mailer.sendContactEmail).not.toHaveBeenCalled();
  });

  test('returns 422 with email error when email is invalid', async () => {
    const res = await request(app).post('/api/contact').send({ ...validBody, email: 'bad-email' });
    expect(res.status).toBe(422);
    expect(res.body.errors.email).toBeDefined();
    expect(mailer.sendContactEmail).not.toHaveBeenCalled();
  });

  test('returns 422 with message error when message is missing', async () => {
    const res = await request(app).post('/api/contact').send({ ...validBody, message: '' });
    expect(res.status).toBe(422);
    expect(res.body.errors.message).toBeDefined();
    expect(mailer.sendContactEmail).not.toHaveBeenCalled();
  });

  test('returns 422 with all errors when all fields are invalid', async () => {
    const res = await request(app).post('/api/contact').send({ name: '', email: 'x', message: '' });
    expect(res.status).toBe(422);
    expect(res.body.errors.name).toBeDefined();
    expect(res.body.errors.email).toBeDefined();
    expect(res.body.errors.message).toBeDefined();
  });

  test('returns 500 with generic error when mailer throws', async () => {
    mailer.sendContactEmail.mockRejectedValue(new Error('SMTP failure'));
    const res = await request(app).post('/api/contact').send(validBody);
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).not.toMatch(/SMTP/);
  });
});
