import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import axiosInstance from "../api/axiosInstance";
import SummaryCard from "../components/SummaryCard";
import TransactionList from "../components/TransactionList";

const CATEGORIES = [
  "Food & Dining","Transportation","Housing & Rent","Utilities",
  "Healthcare","Entertainment","Shopping","Education",
  "Personal Care","Travel","Insurance","Other",
];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const YEARS = [2023, 2024, 2025, 2026];

const defaultForm = {
  title: "", amount: "", category: "Other",
  date: new Date().toISOString().split("T")[0], notes: "",
};

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/expenses?month=${filter.month}&year=${filter.year}`
      );
      setExpenses(data.expenses);
      setTotal(data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, [filter]);

  const openAdd = () => {
    setForm(defaultForm);
    setEditId(null);
    setError("");
    setShowModal(true);
  };

  const openEdit = (item) => {
    setForm({
      title: item.title,
      amount: item.amount,
      category: item.category,
      date: new Date(item.date).toISOString().split("T")[0],
      notes: item.notes || "",
    });
    setEditId(item._id);
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (editId) {
        await axiosInstance.put(`/expenses/${editId}`, form);
      } else {
        await axiosInstance.post("/expenses", form);
      }
      setShowModal(false);
      fetchExpenses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    await axiosInstance.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  const catBreakdown = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const topCat = Object.entries(catBreakdown).sort((a, b) => b[1] - a[1])[0];

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Expenses</h1>
          <p>Track your monthly expenses</p>
        </div>
        <button className="btn btn-danger" onClick={openAdd}>
          <MdAdd size={18} /> Add
        </button>
      </div>

      {/* Filter */}
      <div className="filter-bar">
        <span className="filter-bar-label">📅 Filter:</span>
        <select
          className="filter-select"
          value={filter.month}
          onChange={(e) => setFilter({ ...filter, month: Number(e.target.value) })}
        >
          {MONTHS.map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={filter.year}
          onChange={(e) => setFilter({ ...filter, year: Number(e.target.value) })}
        >
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="summary-grid">
        <SummaryCard
          title="Total Expenses"
          value={`₹${total.toLocaleString("en-IN")}`}
          icon="💸" color="red"
          subText={`${MONTHS[filter.month - 1]} ${filter.year}`}
        />
        <SummaryCard
          title="Transactions"
          value={expenses.length}
          icon="🧾" color="blue"
          subText="This period"
        />
        <SummaryCard
          title="Top Category"
          value={topCat ? topCat[0].split(" ")[0] : "—"}
          icon="🎯" color="orange"
          subText={topCat ? `₹${topCat[1].toLocaleString("en-IN")}` : "No data"}
        />
        <SummaryCard
          title="Avg per Entry"
          value={expenses.length
            ? `₹${Math.round(total / expenses.length).toLocaleString("en-IN")}`
            : "₹0"}
          icon="📊" color="purple"
          subText="This period"
        />
      </div>

      {/* Table */}
      <div className="card">
        <div className="chart-title">📋 Expense Records</div>
        {loading ? (
          <div className="loading">
            <span className="spinner" /> Loading...
          </div>
        ) : (
          <TransactionList
            items={expenses}
            type="expense"
            onDelete={handleDelete}
            onEdit={openEdit}
          />
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? "✏️ Edit Expense" : "➕ Add Expense"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  className="form-control"
                  name="title"
                  placeholder="e.g. Monthly Rent"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Amount (₹) *</label>
                  <input
                    className="form-control"
                    name="amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    className="form-control"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select
                  className="form-control"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <input
                  className="form-control"
                  placeholder="Optional notes..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger" disabled={saving}>
                  {saving ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</> : editId ? "Update" : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;