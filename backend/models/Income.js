const mongoose = require("mongoose");
const incomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0.01 },
  source: { type: String, required: true, enum: ["Salary","Freelance","Business","Investment Returns","Rental Income","Bonus","Gift","Other"], default: "Salary" },
  date: { type: Date, default: Date.now },
  notes: { type: String, trim: true, default: "" }
}, { timestamps: true });
module.exports = mongoose.model("Income", incomeSchema);