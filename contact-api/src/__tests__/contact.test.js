const request = require('supertest');
const app = require('../app');
const mailer = require('../infra/mailer');

jest.mock('../infra/mailer');

describe('POST /api/contact', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 when all fields are valid', async () => {
    mailer.send.mockResolvedValue();

    const res = await request(app).post('/api/contact').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Hello there',
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
    expect(mailer.send).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Hello there',
    });
  });

  it('returns 422 when name is missing', async () => {
    const res = await request(app).post('/api/contact').send({
      email: 'jane@example.com',
      message: 'Hello there',
    });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toHaveProperty('name');
    expect(mailer.send).not.toHaveBeenCalled();
  });

  it('returns 422 when email is invalid', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Jane Doe',
      email: 'not-an-email',
      message: 'Hello there',
    });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toHaveProperty('email');
    expect(mailer.send).not.toHaveBeenCalled();
  });

  it('returns 422 when message is missing', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toHaveProperty('message');
    expect(mailer.send).not.toHaveBeenCalled();
  });

  it('returns 422 with all field errors when body is empty', async () => {
    const res = await request(app).post('/api/contact').send({});

    expect(res.status).toBe(422);
    expect(res.body.errors).toHaveProperty('name');
    expect(res.body.errors).toHaveProperty('email');
    expect(res.body.errors).toHaveProperty('message');
    expect(mailer.send).not.toHaveBeenCalled();
  });

  it('returns 500 when mailer throws', async () => {
    mailer.send.mockRejectedValue(new Error('SMTP connection failed'));

    const res = await request(app).post('/api/contact').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Hello there',
    });

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('message');
  });
});
