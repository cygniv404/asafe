import createApp from "./app";
require("dotenv").config();

const startServer = async () => {
  const app = await createApp();

  try {
    const port = parseInt(process.env.PORT || "3000");
    const host = process.env.HOST || "0.0.0.0";
    await app.listen({ port, host });
    console.log(`Server running at http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

startServer();
