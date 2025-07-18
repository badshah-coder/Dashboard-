import mongoose from "mongoose";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import ConnectDB from "./Config/db.js";
import cors from "cors";
import UserRoute from "./Route/UserRoute.js";

const app = express();

dotenv.config();

ConnectDB();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/users", UserRoute);

app.get("/", (req, res) => {
  res.send("Welcome to web");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
