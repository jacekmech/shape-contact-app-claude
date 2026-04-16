const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/infra/mailer');
const mailer = require('../src/infra/mailer');

describe('POST /api/contact', () => {
  const validBody = { name: 'Alice', email: 'alice@example.com', message: 'Hello there' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 200 with { success: true } when input is valid and mailer resolves', async () => {
    mailer.sendContactEmail.mockResolvedValue();

    const res = await request(app).post('/api/contact').send(validBody);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
    expect(mailer.sendContactEmail).toHaveBeenCalledWith(validBody);
  });

  it('returns 422 with all field errors when all fields are missing', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: '', email: '', message: '' });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toHaveProperty('name');
    expect(res.body.errors).toHaveProperty('email');
    expect(res.body.errors).toHaveProperty('message');
    expect(mailer.sendContactEmail).not.toHaveBeenCalled();
  });

  it('returns 422 with errors.email when only email is invalid', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Alice', email: 'not-valid', message: 'Hello there' });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toHaveProperty('email');
    expect(res.body.errors).not.toHaveProperty('name');
    expect(res.body.errors).not.toHaveProperty('message');
  });

  it('returns 500 with generic error when mailer throws', async () => {
    mailer.sendContactEmail.mockRejectedValue(new Error('SMTP failure'));

    const res = await request(app).post('/api/contact').send(validBody);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ success: false, error: 'Failed to send message' });
  });
});
