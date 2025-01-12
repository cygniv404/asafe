import { Prisma } from "@prisma/client";
class PrismaError extends Prisma.PrismaClientKnownRequestError {
  name = "PrismaError";
}
export { PrismaError };
