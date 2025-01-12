import { FastifyInstance } from "fastify";
import WebSocket from "ws";

const clients: Set<WebSocket> = new Set();

export default async (fastify: FastifyInstance) => {
  fastify.get(
    "/",
    {
      schema: {
        description: "WebSocket endpoint for notifications",
        tags: ["Notification"],
        summary: "Establish WebSocket connection",
        response: {
          101: {
            description: "WebSocket connection established",
          },
          default: {
            description: "Default response",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
      websocket: true,
    },
    (connection) => {
      clients.add(connection);

      connection.on("close", () => {
        clients.delete(connection);
      });
    }
  );

  fastify.decorate("notifyAll", (message: string) => {
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  fastify.post(
    "/",
    {
      schema: {
        description: "Send a notification to all connected WebSocket clients",
        tags: ["Notification"],
        summary: "Broadcast notification",
        body: {
          type: "object",
          required: ["message"],
          properties: {
            message: {
              type: "string",
              description: "The notification message to send",
            },
          },
        },
        response: {
          200: {
            description: "Notification sent successfully",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          default: {
            description: "Default error response",
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
      const { message } = request.body as { message: string };

      fastify.notifyAll(message);

      reply.status(200).send({ message: "Notification sent" });
    }
  );
};

declare module "fastify" {
  interface FastifyInstance {
    notifyAll: (message: string) => void;
  }
}
