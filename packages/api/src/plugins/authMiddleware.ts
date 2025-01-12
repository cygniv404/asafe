import fp from "fastify-plugin";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

interface AuthPluginOptions {}

interface AuthPlugin {
  (fastify: FastifyInstance, options: AuthPluginOptions): void;
}

const authPlugin: AuthPlugin = async (fastify) => {
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply
          .status(401)
          .send({ error: "Unauthorized", message: "Invalid token" });
      }
    }
  );

  fastify.decorate(
    "authorizeRole",
    (allowedRoles: string[]) =>
      async (request: FastifyRequest, reply: FastifyReply) => {
        const { role } = request.user as { role: string };
        if (!allowedRoles.includes(role)) {
          return reply
            .status(403)
            .send({ error: "Forbidden", message: "Insufficient permissions" });
        }
      }
  );
};

export default fp(authPlugin);

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
    authorizeRole: (allowedRoles: string[]) => any;
  }
}
