const { validateContact } = require('../domain/contact');

describe('validateContact', () => {
  const valid = { name: 'Alice', email: 'alice@example.com', message: 'Hello there.' };

  test('returns valid=true for a correct submission', () => {
    const result = validateContact(valid);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  describe('name', () => {
    test('fails when name is missing', () => {
      const { valid: ok, errors } = validateContact({ ...valid, name: '' });
      expect(ok).toBe(false);
      expect(errors.name).toBeDefined();
    });

    test('fails when name is only whitespace', () => {
      const { valid: ok, errors } = validateContact({ ...valid, name: '   ' });
      expect(ok).toBe(false);
      expect(errors.name).toBeDefined();
    });

    test('fails when name exceeds 200 characters', () => {
      const { valid: ok, errors } = validateContact({ ...valid, name: 'a'.repeat(201) });
      expect(ok).toBe(false);
      expect(errors.name).toBeDefined();
    });

    test('passes when name is exactly 200 characters', () => {
      const { valid: ok } = validateContact({ ...valid, name: 'a'.repeat(200) });
      expect(ok).toBe(true);
    });
  });

  describe('email', () => {
    test('fails when email is missing', () => {
      const { valid: ok, errors } = validateContact({ ...valid, email: '' });
      expect(ok).toBe(false);
      expect(errors.email).toBeDefined();
    });

    test('fails when email format is invalid', () => {
      const { valid: ok, errors } = validateContact({ ...valid, email: 'not-an-email' });
      expect(ok).toBe(false);
      expect(errors.email).toBeDefined();
    });

    test('passes for a valid email', () => {
      const { valid: ok } = validateContact({ ...valid, email: 'user@domain.co.uk' });
      expect(ok).toBe(true);
    });
  });

  describe('message', () => {
    test('fails when message is missing', () => {
      const { valid: ok, errors } = validateContact({ ...valid, message: '' });
      expect(ok).toBe(false);
      expect(errors.message).toBeDefined();
    });

    test('fails when message is only whitespace', () => {
      const { valid: ok, errors } = validateContact({ ...valid, message: '   ' });
      expect(ok).toBe(false);
      expect(errors.message).toBeDefined();
    });

    test('fails when message exceeds 2000 characters', () => {
      const { valid: ok, errors } = validateContact({ ...valid, message: 'a'.repeat(2001) });
      expect(ok).toBe(false);
      expect(errors.message).toBeDefined();
    });

    test('passes when message is exactly 2000 characters', () => {
      const { valid: ok } = validateContact({ ...valid, message: 'a'.repeat(2000) });
      expect(ok).toBe(true);
    });
  });

  test('returns all failing fields when multiple are invalid', () => {
    const { valid: ok, errors } = validateContact({ name: '', email: 'bad', message: '' });
    expect(ok).toBe(false);
    expect(errors.name).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.message).toBeDefined();
  });
});
