const Income = require("../models/Income");
const getIncomes = async (req, res) => {
  try {
    const { month, year } = req.query;
    let filter = { userId: req.user._id };
    if (month && year) {
      filter.date = { $gte: new Date(year, month - 1, 1), $lte: new Date(year, month, 0, 23, 59, 59) };
    }
    const incomes = await Income.find(filter).sort({ date: -1 });
    const total = incomes.reduce((sum, i) => sum + i.amount, 0);
    res.json({ incomes, total });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const addIncome = async (req, res) => {
  try {
    const { title, amount, source, date, notes } = req.body;
    if (!title || !amount || !source) return res.status(400).json({ message: "Title, amount, and source are required" });
    const income = await Income.create({ userId: req.user._id, title, amount, source, date: date || Date.now(), notes });
    res.status(201).json(income);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const updateIncome = async (req, res) => {
  try {
    const income = await Income.findOne({ _id: req.params.id, userId: req.user._id });
    if (!income) return res.status(404).json({ message: "Income not found" });
    const updated = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOne({ _id: req.params.id, userId: req.user._id });
    if (!income) return res.status(404).json({ message: "Income not found" });
    await income.deleteOne();
    res.json({ message: "Income deleted successfully" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
module.exports = { getIncomes, addIncome, updateIncome, deleteIncome };