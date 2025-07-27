import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("KoylaPizzaGrill db is connected ✅");

    server = app.listen(envVars.PORT, () => {
      console.log(`server is running on port ${envVars.PORT} 🍕`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
  await seedSuperAdmin();
})();

// unhandled rejection error
process.on("unhandledRejection", (err) => {
  console.log("unhandled rejection detected..Server shutting down..", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//uncaught rejection error

process.on("uncaughtException", (err) => {
  console.log("uncaught Exception detected..Server shutting down..", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//cloud related error
process.on("SIGTERM", (err) => {
  console.log("SIGTERM Signal Received..Server shutting down..", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//manual server off
process.on("SIGINT", (err) => {
  console.log("SIGINT Signal Received..Server shutting down..", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
