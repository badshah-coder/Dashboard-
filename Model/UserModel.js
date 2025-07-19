import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [
        "admin",
        "manager",
        "Gerente",
        "Finanaceiro",
        "Engenharia",
        "RH",
        "Comercial",
        "Compras",
      ],
      default: "null",
    },
    lastLoginAt: { type: Date, default: null },
    sale: { type: String, default: '' },
    saleHistory: [{
      value: Number,
      date: { type: Date, default: Date.now },
      totalExpenses: { type: Number, default: 0 },
      netProfit: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 }
    }],
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
