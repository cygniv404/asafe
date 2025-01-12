import { hashPassword, comparePasswords } from "./password";

describe("Auth Utilities", () => {
  test("should hash and compare passwords correctly", async () => {
    const password = "securepassword";
    const hash = await hashPassword(password);

    expect(await comparePasswords(password, hash)).toBe(true);
    expect(await comparePasswords("wrongpassword", hash)).toBe(false);
  });
});
