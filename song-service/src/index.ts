import express from "express";
import doetnv from "dotenv";
import songRoutes from "./route.js";
import { createClient } from "redis";
import dotenv from "dotenv";
import cors from 'cors'
dotenv.config();

const redisOptions = {
  socket: {
    host: "redis-19143.c15.us-east-1-2.ec2.cloud.redislabs.com",
    port: 19143,
  },
} as const;

if (process.env.Redis_Password) {
  Object.assign(redisOptions, {
    password: process.env.Redis_Password,
  });
}

export const redisClient = createClient(redisOptions);

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

await redisClient.connect();
console.log("connected to redis");

const app = express();

app.use(cors());

app.use("/api/v1", songRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});