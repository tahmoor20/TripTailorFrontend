import { validateSignIn, validateSignUp } from '../utils/validation';

describe('validateSignIn', () => {
  it('accepts a valid email and password', () => {
    expect(validateSignIn({ email: 'a@b.com', password: 'secret1' })).toEqual({});
  });

  it('requires an email and a password', () => {
    const errors = validateSignIn({ email: '  ', password: '' });
    expect(errors.email).toBe('Email is required');
    expect(errors.password).toBe('Password is required');
  });

  it('rejects a malformed email', () => {
    expect(validateSignIn({ email: 'not-an-email', password: 'secret1' }).email).toBe(
      'Please enter a valid email address'
    );
  });

  it('rejects passwords shorter than 6 characters', () => {
    expect(validateSignIn({ email: 'a@b.com', password: '12345' }).password).toBe(
      'Password must be at least 6 characters'
    );
  });
});

describe('validateSignUp', () => {
  const valid = {
    fullName: 'Qamar Uddin',
    email: 'a@b.com',
    phoneNumber: '07123456789',
    password: 'secret1',
  };

  it('accepts valid details', () => {
    expect(validateSignUp(valid)).toEqual({});
  });

  it('requires a full name', () => {
    expect(validateSignUp({ ...valid, fullName: ' ' }).fullName).toBe('Full Name is required');
  });

  it('requires a phone number made only of digits', () => {
    expect(validateSignUp({ ...valid, phoneNumber: '' }).phoneNumber).toBe(
      'Phone Number is required'
    );
    expect(validateSignUp({ ...valid, phoneNumber: '07abc' }).phoneNumber).toBe(
      'Phone Number should contain only numbers'
    );
  });

  it('reports every invalid field at once', () => {
    const errors = validateSignUp({ fullName: '', email: '', phoneNumber: '', password: '' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'fullName', 'password', 'phoneNumber']);
  });
});
