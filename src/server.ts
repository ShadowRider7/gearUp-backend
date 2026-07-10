import app from "./app";
import config from "./config/index";
import { prisma } from "./lib/prisma";
import configureApp from "@codegenie/serverless-express";

const PORT = config.port;

export const handler = configureApp({ app });
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the Database Successfully");
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
