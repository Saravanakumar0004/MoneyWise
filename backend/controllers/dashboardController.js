const Expense = require("../models/Expense");
const Income = require("../models/Income");
const Investment = require("../models/Investment");
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const [monthExpenses, monthIncomes, allInvestments] = await Promise.all([
      Expense.find({ userId, date: { $gte: startOfMonth, $lte: endOfMonth } }),
      Income.find({ userId, date: { $gte: startOfMonth, $lte: endOfMonth } }),
      Investment.find({ userId })
    ]);
    const totalMonthExpense = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalMonthIncome = monthIncomes.reduce((sum, i) => sum + i.amount, 0);
    const totalInvested = allInvestments.reduce((sum, i) => sum + i.investedAmount, 0);
    const totalCurrentValue = allInvestments.reduce((sum, i) => sum + i.currentValue, 0);
    const totalProfitLoss = totalCurrentValue - totalInvested;
    const netSavings = totalMonthIncome - totalMonthExpense;
    const categoryBreakdown = {};
    monthExpenses.forEach(e => { categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + e.amount; });
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      const [exps, incs] = await Promise.all([
        Expense.find({ userId, date: { $gte: start, $lte: end } }),
        Income.find({ userId, date: { $gte: start, $lte: end } })
      ]);
      last6Months.push({ month: d.toLocaleString("default", { month: "short", year: "2-digit" }), expense: exps.reduce((s, e) => s + e.amount, 0), income: incs.reduce((s, i) => s + i.amount, 0) });
    }
    const recentExpenses = await Expense.find({ userId }).sort({ date: -1 }).limit(5);
    const recentIncomes = await Income.find({ userId }).sort({ date: -1 }).limit(5);
    res.json({ summary: { totalMonthIncome, totalMonthExpense, netSavings, totalInvested, totalCurrentValue, totalProfitLoss }, categoryBreakdown, last6Months, recentExpenses, recentIncomes });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
module.exports = { getDashboardData };