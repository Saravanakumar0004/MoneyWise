const mongoose = require("mongoose");
const investmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true, trim: true },
  investedAmount: { type: Number, required: true, min: 0.01 },
  currentValue: { type: Number, required: true, min: 0 },
  type: { type: String, required: true, enum: ["Stocks","Mutual Funds","Fixed Deposit","Real Estate","Gold","Cryptocurrency","Bonds","PPF/NPS","Other"], default: "Other" },
  date: { type: Date, default: Date.now },
  notes: { type: String, trim: true, default: "" }
}, { timestamps: true });
investmentSchema.virtual("profitLoss").get(function() { return this.currentValue - this.investedAmount; });
investmentSchema.virtual("returnPercentage").get(function() {
  if (this.investedAmount === 0) return 0;
  return (((this.currentValue - this.investedAmount) / this.investedAmount) * 100).toFixed(2);
});
investmentSchema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("Investment", investmentSchema);