import { hashPassword, comparePasswords } from "@asafe/utils";
import { createUser, getUserByEmail } from "@asafe/db";
import { setupFastify, teardownFastify } from "../../../../testSetup";

jest.mock("@asafe/utils", () => ({
  hashPassword: jest.fn(),
  comparePasswords: jest.fn(),
}));

jest.mock("@asafe/db", () => ({
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
}));

describe("Auth Routes", () => {
  let fastify: ReturnType<typeof setupFastify>;

  beforeAll(() => {
    fastify = setupFastify();
  });

  afterAll(async () => {
    await teardownFastify();
  });

  test("POST /api/auth/register - should register a user", async () => {
    (hashPassword as jest.Mock).mockResolvedValue("hashedpassword");
    (createUser as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      name: "Test User",
      role: "USER",
    });

    const response = await (
      await fastify
    ).inject({
      method: "POST",
      url: "/api/auth/register",
      payload: {
        email: "test@example.com",
        name: "Test User",
        password: "password123",
        role: "USER",
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual({
      user: {
        id: 1,
        email: "test@example.com",
        name: "Test User",
        role: "USER",
      },
    });
  });

  test("POST /api/auth/login - should log in a user", async () => {
    (getUserByEmail as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
      name: "Test User",
      password: "hashedpassword",
      role: "USER",
    });
    (comparePasswords as jest.Mock).mockResolvedValue(true);

    const response = await (
      await fastify
    ).inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {
        email: "test@example.com",
        password: "password123",
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().token).toBeDefined();
  });
});
