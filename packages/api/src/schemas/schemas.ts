export const createUserSchema = {
  body: {
    type: "object",
    required: ["email", "name", "password"],
    properties: {
      email: { type: "string", format: "email" },
      name: { type: "string", minLength: 1 },
      password: { type: "string", minLength: 6 },
      role: { type: "string", enum: ["ADMIN", "USER"] },
    },
    additionalProperties: false,
  },
};

export const updateUserSchema = {
  body: {
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      name: { type: "string", minLength: 1 },
      role: { type: "string", enum: ["ADMIN", "USER"] },
    },
    additionalProperties: false,
  },
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "integer" },
    },
  },
};

export const getUserSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "integer" },
    },
  },
};

export const deleteUserSchema = {
  params: {
    type: "object",
    required: ["id"], // Require the user ID in the path
    properties: {
      id: { type: "integer" }, // Ensure the ID is an integer
    },
  },
};
