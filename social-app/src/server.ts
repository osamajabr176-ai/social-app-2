import http from "node:http";
import mongoose from "mongoose";
import { createApp } from "./app";
import { connectDB } from "./lib/db/connection";

const app = createApp();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
   
});

async function shutdown() {
    await mongoose.disconnect();
    server.close();
    process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
