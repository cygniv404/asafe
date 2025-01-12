import { FastifyInstance } from "fastify";
import { hashPassword, comparePasswords } from "@asafe/utils";
import { createUser, getUserByEmail } from "@asafe/db";

export default async (fastify: FastifyInstance) => {
  // Register a new user
  fastify.post(
    "/register",
    {
      schema: {
        description: "Register a new user",
        tags: ["Auth"],
        summary: "Register a user",
        body: {
          type: "object",
          required: ["email", "name", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            name: { type: "string", description: "User's full name" },
            password: { type: "string", description: "User's password" },
            role: {
              type: "string",
              enum: ["ADMIN", "USER"],
              description: "Role of the user",
            },
          },
        },
        response: {
          201: {
            description: "User successfully registered",
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  id: { type: "integer", description: "User ID" },
                  email: {
                    type: "string",
                    description: "User's email address",
                  },
                  name: { type: "string", description: "User's full name" },
                  role: { type: "string", description: "Role of the user" },
                },
              },
            },
          },
          400: {
            description: "Bad Request",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { email, name, password, role } = request.body as {
        email: string;
        name: string;
        password: string;
        role?: "ADMIN" | "USER";
      };

      const hashedPassword = await hashPassword(password);
      const user = await createUser(
        email,
        name,
        hashedPassword,
        role || "USER"
      );

      reply.status(201).send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    }
  );

  // Login a user
  fastify.post(
    "/login",
    {
      schema: {
        description: "Login a user",
        tags: ["Auth"],
        summary: "User login",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            password: { type: "string", description: "User's password" },
          },
        },
        response: {
          200: {
            description: "Login successful",
            type: "object",
            properties: {
              token: { type: "string", description: "JWT token" },
            },
          },
          401: {
            description: "Invalid email or password",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body as {
        email: string;
        password: string;
      };

      const user = await getUserByEmail(email);
      if (!user) {
        reply.status(401).send({ error: "Invalid email or password" });
        return;
      }

      const isValid = await comparePasswords(password, user.password);
      if (!isValid) {
        reply.status(401).send({ error: "Invalid email or password" });
        return;
      }

      const token = fastify.jwt.sign(
        { id: user.id, role: user.role },
        { expiresIn: "1h" }
      );

      reply.send({ token });
    }
  );
};
