import { createClient } from "redis";

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

if (process.env.NODE_ENV === "development") {
    client.on("error", (error) => {
        console.error(error);
    });
}

if (client.status !== "ready") {
    await client.connect();
}

export { client };