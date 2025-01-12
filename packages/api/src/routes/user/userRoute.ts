import { FastifyInstance } from "fastify";
import { createUser, getUser, updateUser, deleteUser } from "@asafe/db";
import { hashPassword } from "@asafe/utils";

export default async (fastify: FastifyInstance) => {
  // Create a new user (ADMIN-only action)
  fastify.post(
    "/",
    {
      schema: {
        description: "Create a new user (ADMIN-only)",
        tags: ["User"],
        summary: "Create user",
        body: {
          type: "object",
          required: ["email", "name", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User's email",
            },
            name: { type: "string", minLength: 1, description: "User's name" },
            password: {
              type: "string",
              minLength: 6,
              description: "User's password",
            },
            role: {
              type: "string",
              enum: ["ADMIN", "USER"],
              description: "Role of the user",
            },
          },
          additionalProperties: false,
        },
        response: {
          201: {
            description: "User created successfully",
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  id: { type: "integer", description: "User ID" },
                  email: { type: "string", description: "User's email" },
                  name: { type: "string", description: "User's name" },
                  role: { type: "string", description: "Role of the user" },
                },
              },
            },
          },
          default: {
            description: "Error response",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
      preValidation: [fastify.authenticate, fastify.authorizeRole(["ADMIN"])],
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

  // Get a user by ID (Authenticated users only)
  fastify.get(
    "/:id",
    {
      schema: {
        description: "Get a user by ID (Authenticated users only)",
        tags: ["User"],
        summary: "Get user by ID",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "integer", description: "User ID" },
          },
        },
        response: {
          200: {
            description: "User retrieved successfully",
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  id: { type: "integer", description: "User ID" },
                  email: { type: "string", description: "User's email" },
                  name: { type: "string", description: "User's name" },
                  role: { type: "string", description: "Role of the user" },
                },
              },
            },
          },
          404: {
            description: "User not found",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
          default: {
            description: "Error response",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      const { id } = request.params as { id: number };
      const user = await getUser(id);

      if (!user) {
        reply.status(404).send({ error: "User not found" });
        return;
      }

      reply.send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    }
  );

  // Update a user (ADMIN-only action)
  fastify.put(
    "/:id",
    {
      schema: {
        description: "Update a user (ADMIN-only)",
        tags: ["User"],
        summary: "Update user",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "integer", description: "User ID" },
          },
        },
        body: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "Updated email",
            },
            name: { type: "string", minLength: 1, description: "Updated name" },
            role: {
              type: "string",
              enum: ["ADMIN", "USER"],
              description: "Updated role",
            },
          },
          additionalProperties: false,
        },
        response: {
          200: {
            description: "User updated successfully",
            type: "object",
            properties: {
              user: {
                type: "object",
                properties: {
                  id: { type: "integer", description: "User ID" },
                  email: { type: "string", description: "User's email" },
                  name: { type: "string", description: "User's name" },
                  role: { type: "string", description: "User's role" },
                },
              },
            },
          },
          404: {
            description: "User not found",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
          default: {
            description: "Error response",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
      preValidation: [fastify.authenticate, fastify.authorizeRole(["ADMIN"])],
    },
    async (request, reply) => {
      const { id } = request.params as { id: number };
      const data = request.body as {
        email?: string;
        name?: string;
        role?: "ADMIN" | "USER";
      };

      const user = await updateUser(id, data);

      if (!user) {
        reply.status(404).send({ error: "User not found" });
        return;
      }

      reply.send({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    }
  );

  // Delete a user (ADMIN-only action)
  fastify.delete(
    "/:id",
    {
      schema: {
        description: "Delete a user (ADMIN-only)",
        tags: ["User"],
        summary: "Delete user",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "integer", description: "User ID" },
          },
        },
        response: {
          204: {
            description: "User deleted successfully",
          },
          404: {
            description: "User not found",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
          default: {
            description: "Error response",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
      preValidation: [fastify.authenticate, fastify.authorizeRole(["ADMIN"])],
    },
    async (request, reply) => {
      const { id } = request.params as { id: number };

      await deleteUser(id);
      reply.status(204).send();
    }
  );
};
