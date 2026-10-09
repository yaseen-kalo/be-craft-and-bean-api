import { test, expect } from "@playwright/test";
import { AuthService } from "@services/auth.service";
import { AuthResponse } from "@types-app/auth.types";
import { ErrorResponse } from "@types-app/common.types";
import { buildRegisterPayload } from "@factories/user.factory";

test.describe("POST auth/register", () => {
  test("@Smoke @Regression register with valid data returns 201", async ({
    request,
  }) => {
    const authService = new AuthService(request);
    const payload = buildRegisterPayload();
    const response = await authService.register(payload);

    expect(response.status()).toBe(201);
    const body = (await response.json()) as AuthResponse;
    expect(body.accessToken).toBeTruthy();
    expect(body.user.email).toBe(payload.email);
    expect(body.user).not.toHaveProperty("password");
  });

  test("@Regression Password with exactly 8 characters returns 201", async ({
    request,
  }) => {
    const authService = new AuthService(request);
    const payload = buildRegisterPayload({
      password: "pass1234",
    });
    const response = await authService.register(payload);

    expect(response.status()).toBe(201);
    const body = (await response.json()) as AuthResponse;
    expect(body.accessToken).toBeTruthy();
    expect(body.user.email).toBe(payload.email);
    expect(body.user).not.toHaveProperty("password");
  });

  test("@Regression Password with 7 characters returns 400", async ({
    request,
  }) => {
    const authService = new AuthService(request);
    const payload = buildRegisterPayload({
      password: "pass123", // 7 characters
    });
    const response = await authService.register(payload);

    expect(response.status()).toBe(400);
    const body = (await response.json()) as ErrorResponse;
    expect(body.code).toBe("VALIDATION_ERROR");
  });
});
