import express from "express";
import { loginUser, addUser, getAllUsers } from "../Controller/UserController.js";

const router = express.Router();

// Login route
router.post("/login", loginUser);

// Admin: Add user
router.post("/add", addUser);

// Admin: Get all users
router.get("/all", getAllUsers);

export default router;
