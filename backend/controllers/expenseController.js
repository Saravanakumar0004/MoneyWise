const Expense = require("../models/Expense");
const getExpenses = async (req, res) => {
  try {
    const { month, year } = req.query;
    let filter = { userId: req.user._id };
    if (month && year) {
      filter.date = { $gte: new Date(year, month - 1, 1), $lte: new Date(year, month, 0, 23, 59, 59) };
    }
    const expenses = await Expense.find(filter).sort({ date: -1 });
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    res.json({ expenses, total });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date, notes } = req.body;
    if (!title || !amount || !category) return res.status(400).json({ message: "Title, amount, and category are required" });
    const expense = await Expense.create({ userId: req.user._id, title, amount, category, date: date || Date.now(), notes });
    res.status(201).json(expense);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    await expense.deleteOne();
    res.json({ message: "Expense deleted successfully" });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
module.exports = { getExpenses, addExpense, updateExpense, deleteExpense };