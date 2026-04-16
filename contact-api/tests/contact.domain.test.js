const { validate } = require('../src/domain/contact');

describe('contact.validate', () => {
  it('returns errors.name when name is missing', () => {
    const result = validate({ name: '', email: 'a@b.com', message: 'hello' });
    expect(result).toHaveProperty('name', 'Name is required');
  });

  it('returns errors.name when name is whitespace only', () => {
    const result = validate({ name: '   ', email: 'a@b.com', message: 'hello' });
    expect(result).toHaveProperty('name', 'Name is required');
  });

  it('returns errors.email when email is missing', () => {
    const result = validate({ name: 'Alice', email: '', message: 'hello' });
    expect(result).toHaveProperty('email', 'Email is required');
  });

  it('returns errors.email when email format is invalid', () => {
    const result = validate({ name: 'Alice', email: 'not-an-email', message: 'hello' });
    expect(result).toHaveProperty('email', 'Invalid email address');
  });

  it('returns errors.message when message is missing', () => {
    const result = validate({ name: 'Alice', email: 'a@b.com', message: '' });
    expect(result).toHaveProperty('message', 'Message is required');
  });

  it('returns errors.message when message is whitespace only', () => {
    const result = validate({ name: 'Alice', email: 'a@b.com', message: '   ' });
    expect(result).toHaveProperty('message', 'Message is required');
  });

  it('returns null when all fields are valid', () => {
    const result = validate({ name: 'Alice', email: 'a@b.com', message: 'hello' });
    expect(result).toBeNull();
  });

  it('returns all errors when multiple fields are invalid', () => {
    const result = validate({ name: '', email: 'bad', message: '' });
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('message');
  });
});
