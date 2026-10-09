import { randomUUID } from "crypto";

export function buildRegisterPayload(overrides: Record<string, unknown> = {}) {
  // returns { email, password, firstName, lastName }
  // email is new every time
  // anything in "overrides" replaces the default

  const defaults = {
    email: `jane-${randomUUID()}@example.com`,
    password: "password123",
    firstName: "Jane",
    lastName: "Doe",
  };

  return { ...defaults, ...overrides };
}
