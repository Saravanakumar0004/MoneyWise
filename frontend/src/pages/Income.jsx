import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import axiosInstance from "../api/axiosInstance";
import SummaryCard from "../components/SummaryCard";
import TransactionList from "../components/TransactionList";

const SOURCES = [
  "Salary","Freelance","Business","Investment Returns",
  "Rental Income","Bonus","Gift","Other",
];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const YEARS = [2023, 2024, 2025, 2026];

const defaultForm = {
  title: "", amount: "", source: "Salary",
  date: new Date().toISOString().split("T")[0], notes: "",
};

const Income = () => {
  const [incomes, setIncomes] = useState([]);
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

  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/income?month=${filter.month}&year=${filter.year}`
      );
      setIncomes(data.incomes);
      setTotal(data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIncomes(); }, [filter]);

  const openAdd = () => {
    setForm(defaultForm);
    setEditId(null);
    setError("");
    setShowModal(true);
  };

  const openEdit = (item) => {
    setForm({
      title: item.title, amount: item.amount, source: item.source,
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
      if (editId) await axiosInstance.put(`/income/${editId}`, form);
      else await axiosInstance.post("/income", form);
      setShowModal(false);
      fetchIncomes();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this income?")) return;
    await axiosInstance.delete(`/income/${id}`);
    fetchIncomes();
  };

  const srcBreakdown = incomes.reduce((acc, i) => {
    acc[i.source] = (acc[i.source] || 0) + i.amount;
    return acc;
  }, {});
  const topSrc = Object.entries(srcBreakdown).sort((a, b) => b[1] - a[1])[0];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Income</h1>
          <p>Track all your income sources</p>
        </div>
        <button className="btn btn-success" onClick={openAdd}>
          <MdAdd size={18} /> Add
        </button>
      </div>

      <div className="filter-bar">
        <span className="filter-bar-label">📅 Filter:</span>
        <select
          className="filter-select"
          value={filter.month}
          onChange={(e) => setFilter({ ...filter, month: Number(e.target.value) })}
        >
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select
          className="filter-select"
          value={filter.year}
          onChange={(e) => setFilter({ ...filter, year: Number(e.target.value) })}
        >
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="summary-grid">
        <SummaryCard
          title="Total Income" value={`₹${total.toLocaleString("en-IN")}`}
          icon="💵" color="green"
          subText={`${MONTHS[filter.month - 1]} ${filter.year}`}
        />
        <SummaryCard
          title="Transactions" value={incomes.length}
          icon="📝" color="blue" subText="This period"
        />
        <SummaryCard
          title="Top Source" value={topSrc ? topSrc[0] : "—"}
          icon="🏆" color="purple"
          subText={topSrc ? `₹${topSrc[1].toLocaleString("en-IN")}` : "No data"}
        />
        <SummaryCard
          title="Avg Income"
          value={incomes.length ? `₹${Math.round(total / incomes.length).toLocaleString("en-IN")}` : "₹0"}
          icon="📊" color="teal" subText="Per transaction"
        />
      </div>

      <div className="card">
        <div className="chart-title">📋 Income Records</div>
        {loading ? (
          <div className="loading"><span className="spinner" /> Loading...</div>
        ) : (
          <TransactionList items={incomes} type="income" onDelete={handleDelete} onEdit={openEdit} />
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? "✏️ Edit Income" : "➕ Add Income"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input className="form-control" placeholder="e.g. Monthly Salary" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Amount (₹) *</label>
                  <input className="form-control" type="number" min="0.01" step="0.01" placeholder="0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Date *</label>
                  <input className="form-control" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Source *</label>
                <select className="form-control" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} required>
                  {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <input className="form-control" placeholder="Optional notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success" disabled={saving}>
                  {saving ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: "#fff" }} /> Saving...</> : editId ? "Update" : "Add Income"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Income;