import { initializeServer, startServer } from "./server";

startServer().catch((error) => {
    console.error("Error while starting server: ", error);
});