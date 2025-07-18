import express from "express";
import { loginUser, addUser, getAllUsers, deleteUser, getUserSale, updateUserSale } from "../Controller/UserController.js";

const router = express.Router();

// Login route
router.post("/login", loginUser);

// Admin: Add user
router.post("/add", addUser);

// Admin: Get all users
router.get("/all", getAllUsers);

// Admin: Delete user
router.delete("/delete/:id", deleteUser);

// Get user sale
router.get("/sale/:id", getUserSale);
// Update user sale
router.put("/sale/:id", updateUserSale);

export default router;
