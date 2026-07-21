const Investment = require("../models/Investment");
const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.user._id }).sort({ date: -1 });
    const totalInvested = investments.reduce((sum, i) => sum + i.investedAmount, 0);
    const totalCurrentValue = investments.reduce((sum, i) => sum + i.currentValue, 0);
    const totalProfitLoss = totalCurrentValue - totalInvested;
    res.json({ investments, totalInvested, totalCurrentValue, totalProfitLoss });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const addInvestment = async (req, res) => {
  try {
    const { title, investedAmount, currentValue, type, date, notes } = req.body;
    if (!title || investedAmount === undefined || currentValue === undefined || !type)
      return res.status(400).json({ message: "All fields required" });
    const investment = await Investment.create({ userId: req.user._id, title, investedAmount, currentValue, type, date: date || Date.now(), notes });
    res.status(201).json(investment);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const updateInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOne({ _id: req.params.id, userId: req.user._id });
    if (!investment) return res.status(404).json({ message: "Investment not found" });
    const updated = await Investment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const deleteInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOne({ _id: req.params.id, userId: req.user._id });
    if (!investment) return res.status(404).json({ message: "Investment not found" });
    await investment.deleteOne();
    res.json({ message: "Investment deleted successfully" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
module.exports = { getInvestments, addInvestment, updateInvestment, deleteInvestment };