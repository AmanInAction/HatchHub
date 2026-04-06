import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";
import path from "path";
dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.Frontend_URL,
  "http://localhost:3000", // for local dev
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT = process.env.PORT || 8080;

//Routes
app.use("/", postRoutes);
app.use("/", userRoutes);

//Test Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//MongoDB Connection
const start = async () => {
  try {
    const connect = mongoose.connect(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

start();
