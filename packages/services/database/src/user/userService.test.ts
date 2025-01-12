import {
  createUser,
  getUser,
  getUserByEmail,
  updateUser,
  deleteUser,
} from "./userService";

import { prismaMock } from "../../__mocks__/@prisma/client";

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createUser - should create a new user", async () => {
    prismaMock.user.create.mockResolvedValue({
      id: 1,
      email: "test@example.com",
      name: "Test User",
      password: "hashedpassword",
      role: "USER",
    });

    const result = await createUser(
      "test@example.com",
      "Test User",
      "hashedpassword"
    );

    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        email: "test@example.com",
        name: "Test User",
        password: "hashedpassword",
        role: "USER",
      },
    });
    expect(result).toEqual({
      id: 1,
      email: "test@example.com",
      name: "Test User",
      password: "hashedpassword",
      role: "USER",
    });
  });

  test("getUser - should retrieve a user by ID", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      email: "test@example.com",
      name: "Test User",
      posts: [],
    });

    const result = await getUser(1);

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { posts: true },
    });
    expect(result).toEqual({
      id: 1,
      email: "test@example.com",
      name: "Test User",
      posts: [],
    });
  });

  test("getUserByEmail - should retrieve a user by email", async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 1,
      email: "test@example.com",
      name: "Test User",
    });

    const result = await getUserByEmail("test@example.com");

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
    expect(result).toEqual({
      id: 1,
      email: "test@example.com",
      name: "Test User",
    });
  });

  test("updateUser - should update a user", async () => {
    prismaMock.user.update.mockResolvedValue({
      id: 1,
      email: "updated@example.com",
      name: "Updated User",
    });

    const result = await updateUser(1, {
      email: "updated@example.com",
      name: "Updated User",
    });

    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { email: "updated@example.com", name: "Updated User" },
    });
    expect(result).toEqual({
      id: 1,
      email: "updated@example.com",
      name: "Updated User",
    });
  });

  test("deleteUser - should delete a user", async () => {
    prismaMock.user.delete.mockResolvedValue({
      id: 1,
      email: "test@example.com",
      name: "Test User",
    });

    const result = await deleteUser(1);

    expect(prismaMock.user.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual({
      id: 1,
      email: "test@example.com",
      name: "Test User",
    });
  });
});
