import fp from "fastify-plugin";
import { PrismaError } from "@asafe/db";

export default fp(async (fastify) => {
  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);

    if (error.validation) {
      return reply.status(400).send({
        error: "Request Validation error",
        message: error.message,
        details: error.validation,
      });
    }

    if (error instanceof PrismaError) {
      switch (error.code) {
        case "P2002":
          return reply.status(400).send({
            error: "Unique Constraint Violation",
            message: `A record with this field already exists.`,
          });
        case "P2025":
          return reply.status(404).send({
            error: "Record Not Found",
            message: "The requested record does not exist.",
          });
        default:
          return reply.status(400).send({
            error: "Prisma Error",
            message: error.message,
          });
      }
    }

    reply
      .status(500)
      .send({ error: "Internal Server Error", message: error.message });
  });
});
