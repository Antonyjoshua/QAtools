/**
 * Central test-data store.
 * Use a timestamp suffix to keep email addresses unique across runs.
 */
const ts = Date.now();

export const validUser = {
  name:     'Test User',
  email:    `testuser+${ts}@mailinator.com`,
  phone:    '9876543210',
  password: 'Test@12345',
};

export const existingUser = {
  email:    'existing@mailinator.com',   // pre-registered account
  password: 'Test@12345',
};

export const invalidData = {
  badEmail:           'not-an-email',
  shortPassword:      '123',
  mismatchPassword:   'Different@999',
  unregisteredEmail:  'nobody@mailinator.com',
  wrongPassword:      'WrongPass@1',
  sqlInjection:       "' OR '1'='1",
  xssPayload:         '<script>alert(1)</script>',
  longString:         'a'.repeat(300),
};
