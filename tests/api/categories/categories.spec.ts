import { test, expect } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("should load the homepage", async ({ request }) => {
    const response = await request.get("categories");
    expect(response.status()).toBe(200);
  });
});
