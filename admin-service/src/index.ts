import express from "express";
import dotenv from "dotenv";
import { sql } from "./config/db.js";
import adminRoutes from "./route.js";
import { v2 as cloudinary } from "cloudinary";
import cors from 'cors'
dotenv.config();
const {
  Cloud_Name,
  Cloud_Api_key,
  Cloud_Api_Secret,
} = process.env;

if (!Cloud_Name || !Cloud_Api_key || !Cloud_Api_Secret) {
  throw new Error("Missing Cloudinary environment variables");
}

cloudinary.config({
  cloud_name: Cloud_Name,
  api_key: Cloud_Api_key,
  api_secret: Cloud_Api_Secret,
});

const app = express();
app.use(cors());
app.use(express.json())
async function initDB() {
    try {
        await sql`
       CREATE TABLE IF NOT EXISTS albums (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`

         await sql`
       CREATE TABLE IF NOT EXISTS songs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255),
        audio VARCHAR(255) NOT NULL,
        album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
        console.log("Database initialized successfully")
    } catch (error) {
        console.log("Error initDb", error)
    }
}
app.use("/api/v1", adminRoutes);
const port = process.env.PORT;
initDB().then(()=>{
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
})
