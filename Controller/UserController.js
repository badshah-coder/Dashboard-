import JWT from "jsonwebtoken";
import { ComparePassword, HashPassword } from "../Helper/UserHelper.js";
import UserModel from "../Model/UserModel.js";

// ---------------- LOGIN -------------------
export const loginUser = async (req, res) => {
  try {
    const { identifier, password, role } = req.body;
    if (!identifier || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email/username, password, and role are required",
      });
    }
    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        message: "Role does not match for this user.",
      });
    }
    const isMatch = await ComparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const token = JWT.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const userData = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ---------------- ADMIN: ADD USER -------------------
export const addUser = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;
    if (!userName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { userName }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await HashPassword(password);
    const newUser = new UserModel({
      userName,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    return res.status(201).json({ success: true, message: "User added successfully" });
  } catch (error) {
    console.error("Add user error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ---------------- ADMIN: GET ALL USERS -------------------
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, '-password'); // Exclude password
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ---------------- ADMIN: DELETE USER -------------------
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await UserModel.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ---------------- GET USER SALE -------------------
export const getUserSale = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Return all saleHistory fields (including new ones)
    return res.status(200).json({ success: true, sale: user.sale, saleHistory: user.saleHistory });
  } catch (error) {
    console.error('Get user sale error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ---------------- UPDATE USER SALE -------------------
export const updateUserSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { sale, totalExpenses, netProfit, revenue } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    if (typeof sale !== 'number') {
      return res.status(400).json({ success: false, message: 'Sale must be a number' });
    }
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    let newSaleString = user.sale ? user.sale + ',' + sale : String(sale);
    user.sale = newSaleString;
    user.saleHistory.push({
      value: sale,
      date: new Date(),
      totalExpenses: typeof totalExpenses === 'number' ? totalExpenses : 0,
      netProfit: typeof netProfit === 'number' ? netProfit : 0,
      revenue: typeof revenue === 'number' ? revenue : 0
    });
    await user.save();
    return res.status(200).json({ success: true, sale: user.sale, saleHistory: user.saleHistory });
  } catch (error) {
    console.error('Update user sale error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
