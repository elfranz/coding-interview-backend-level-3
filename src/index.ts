import { startServer } from "./server";
import prisma from "./database";

startServer().catch((error) => {
    console.error("Error while starting server: ", error);
});

// Gracefully shutdown Prisma on termination signals
const shutdown = async () => {
    console.log("Shutting down gracefully...");
    try {
        await prisma.$disconnect();
        console.log("Prisma disconnected successfully");
    } catch (err) {
        console.error("Error disconnecting Prisma", err);
    }
    process.exit(0);
};

// listens to interrupt signals to execute
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);