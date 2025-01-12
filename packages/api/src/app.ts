import Fastify from "fastify";
import fastifyAutoload from "@fastify/autoload";
import path from "path";
import fastifyJwt from "@fastify/jwt";
import fastifyMultipart from "@fastify/multipart";
import fastifyWebsocket from "@fastify/websocket";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
require("dotenv").config();

const createApp = async () => {
  const app = Fastify({
    logger: true,
  });

  app.register(fastifySwagger, {
    swagger: {
      info: {
        title: "API Documentation",
        description: "API documentation for the application",
        version: "1.0.0",
      },
      host: `${process.env.HOST}:${process.env.PORT}`,
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
    },
  });

  app.register(fastifySwaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
  });

  app.register(fastifyAutoload, {
    dir: path.join(__dirname, "plugins"),
  });

  app.register(fastifyAutoload, {
    dir: path.join(__dirname, "routes"),
    options: {
      dirNameRoutePrefix: true,
      prefix: "/api",
    },
  });

  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "supersecretkey",
  });

  app.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  app.register(fastifyWebsocket);

  app.ready(() => {
    app.swagger();
  });

  return app;
};

export default createApp;
