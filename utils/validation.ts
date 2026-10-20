export type FormErrors = Record<string, string>;

const EMAIL_PATTERN = /\S+@\S+\.\S+/;
const DIGITS_ONLY = /^\d+$/;
const MIN_PASSWORD_LENGTH = 6;

function validateEmail(email: string, errors: FormErrors): void {
  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address';
  }
}

function validatePassword(password: string, errors: FormErrors): void {
  if (!password.trim()) {
    errors.password = 'Password is required';
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
}

export function validateSignIn(values: { email: string; password: string }): FormErrors {
  const errors: FormErrors = {};
  validateEmail(values.email, errors);
  validatePassword(values.password, errors);
  return errors;
}

export function validateSignUp(values: {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}): FormErrors {
  const errors: FormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Full Name is required';
  }

  validateEmail(values.email, errors);

  if (!values.phoneNumber.trim()) {
    errors.phoneNumber = 'Phone Number is required';
  } else if (!DIGITS_ONLY.test(values.phoneNumber)) {
    errors.phoneNumber = 'Phone Number should contain only numbers';
  }

  validatePassword(values.password, errors);
  return errors;
}
