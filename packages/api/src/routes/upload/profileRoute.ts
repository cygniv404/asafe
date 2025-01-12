import { FastifyInstance } from "fastify";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default async (fastify: FastifyInstance) => {
  fastify.post(
    "/profile",
    {
      schema: {
        description: "Upload a user profile picture",
        tags: ["Profile"],
        summary: "Upload profile picture",
        consumes: ["multipart/form-data"],
        body: {
          type: "object",
          properties: {
            file: {
              type: "string",
              format: "binary",
              description:
                "The profile picture file to upload (JPEG or PNG only)",
            },
          },
        },
        response: {
          200: {
            description: "File uploaded successfully",
            type: "object",
            properties: {
              message: {
                type: "string",
              },
              fileUrl: {
                type: "string",
              },
            },
          },
          400: {
            description: "Invalid file upload",
            type: "object",
            properties: {
              error: { type: "string" },
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
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      const data = await request.file();

      if (!data) {
        reply.status(400).send({ error: "No file uploaded" });
        return;
      }

      const { filename, mimetype, file } = data;

      if (!["image/jpeg", "image/png"].includes(mimetype)) {
        reply.status(400).send({ error: "Invalid file type" });
        return;
      }

      const key = `profile-pictures/${Date.now()}-${filename}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
          Body: file,
          ContentType: mimetype,
        })
      );

      reply.status(200).send({
        message: "File uploaded successfully",
        fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      });
    }
  );
};
