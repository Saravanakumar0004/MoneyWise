const mongoose = require("mongoose");
const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0.01 },
  category: { type: String, required: true, enum: ["Food & Dining","Transportation","Housing & Rent","Utilities","Healthcare","Entertainment","Shopping","Education","Personal Care","Travel","Insurance","Other"], default: "Other" },
  date: { type: Date, default: Date.now },
  notes: { type: String, trim: true, default: "" }
}, { timestamps: true });
module.exports = mongoose.model("Expense", expenseSchema);