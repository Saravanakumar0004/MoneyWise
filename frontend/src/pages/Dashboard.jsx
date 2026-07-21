import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import axiosInstance from "../api/axiosInstance";
import SummaryCard from "../components/SummaryCard";
import { useAuth } from "../context/AuthContext";

const PIE_COLORS = [
  "#667eea","#48bb78","#f6ad55","#fc8181",
  "#76e4f7","#b794f4","#fbd38d","#9ae6b4",
];

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get("/dashboard")
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="loading">
        <span className="spinner" />
        Loading dashboard...
      </div>
    );

  if (!data)
    return (
      <div className="empty-state">
        <div className="icon">⚠️</div>
        <p>Failed to load data</p>
      </div>
    );

  const { summary, last6Months, categoryBreakdown, recentExpenses, recentIncomes } = data;
  const categoryData = Object.entries(categoryBreakdown || {}).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2>Welcome back, {user?.name}! 👋</h2>
        <p>Here's your financial overview for this month.</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <SummaryCard
          title="Monthly Income"
          value={fmt(summary.totalMonthIncome)}
          icon="💵"
          color="green"
          subText="This month"
        />
        <SummaryCard
          title="Monthly Expenses"
          value={fmt(summary.totalMonthExpense)}
          icon="💸"
          color="red"
          subText="This month"
        />
        <SummaryCard
          title="Net Savings"
          value={fmt(summary.netSavings)}
          icon="🏦"
          color={summary.netSavings >= 0 ? "blue" : "red"}
          subText="Income − Expenses"
        />
        <SummaryCard
          title="Total Invested"
          value={fmt(summary.totalInvested)}
          icon="📈"
          color="purple"
          subText="All time"
        />
        <SummaryCard
          title="Portfolio Value"
          value={fmt(summary.totalCurrentValue)}
          icon="💼"
          color="teal"
          subText="Current value"
        />
        <SummaryCard
          title="Total P&L"
          value={`${summary.totalProfitLoss >= 0 ? "+" : ""}${fmt(summary.totalProfitLoss)}`}
          icon={summary.totalProfitLoss >= 0 ? "🚀" : "📉"}
          color={summary.totalProfitLoss >= 0 ? "green" : "red"}
          subText="Investment returns"
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Bar Chart */}
        <div className="card">
          <div className="chart-title">📊 6-Month Income vs Expense</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={last6Months} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="income" fill="#48bb78" name="Income" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#fc8181" name="Expense" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <div className="chart-title">🎯 Expense Categories</div>
          {categoryData.length === 0 ? (
            <div className="empty-state" style={{ padding: 32 }}>
              <p>No expenses this month</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="recent-grid">
        {/* Recent Income */}
        <div className="card">
          <div className="chart-title">💵 Recent Income</div>
          {!recentIncomes?.length ? (
            <div className="empty-state" style={{ padding: 28 }}>
              <p>No income records</p>
            </div>
          ) : (
            recentIncomes.map((item) => (
              <div className="recent-item" key={item._id}>
                <div className="recent-item-left">
                  <div className="recent-item-title">{item.title}</div>
                  <div className="recent-item-sub">
                    {item.source} ·{" "}
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>
                <div
                  className="recent-item-amount"
                  style={{ color: "#38a169" }}
                >
                  +₹{item.amount.toLocaleString("en-IN")}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recent Expenses */}
        <div className="card">
          <div className="chart-title">💸 Recent Expenses</div>
          {!recentExpenses?.length ? (
            <div className="empty-state" style={{ padding: 28 }}>
              <p>No expense records</p>
            </div>
          ) : (
            recentExpenses.map((item) => (
              <div className="recent-item" key={item._id}>
                <div className="recent-item-left">
                  <div className="recent-item-title">{item.title}</div>
                  <div className="recent-item-sub">
                    {item.category} ·{" "}
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>
                <div
                  className="recent-item-amount"
                  style={{ color: "#e53e3e" }}
                >
                  -₹{item.amount.toLocaleString("en-IN")}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;