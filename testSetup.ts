import buildFastify from "./packages/api/src/app";

let fastify: ReturnType<typeof buildFastify>;

export const setupFastify = () => {
  if (!fastify) {
    fastify = buildFastify();
  }
  return fastify;
};

export const teardownFastify = async () => {
  if (fastify) {
    await (await fastify).close();
    fastify = null as any;
  }
};
