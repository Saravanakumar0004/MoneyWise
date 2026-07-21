import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axiosInstance from "../api/axiosInstance";
import SummaryCard from "../components/SummaryCard";
import TransactionList from "../components/TransactionList";

const TYPES = ["Stocks","Mutual Funds","Fixed Deposit","Real Estate","Gold","Cryptocurrency","Bonds","PPF/NPS","Other"];

const defaultForm = {
  title: "", investedAmount: "", currentValue: "",
  type: "Stocks", date: new Date().toISOString().split("T")[0], notes: "",
};

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [summary, setSummary] = useState({ totalInvested: 0, totalCurrentValue: 0, totalProfitLoss: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/investments");
      setInvestments(data.investments);
      setSummary({
        totalInvested: data.totalInvested,
        totalCurrentValue: data.totalCurrentValue,
        totalProfitLoss: data.totalProfitLoss,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvestments(); }, []);

  const openAdd = () => {
    setForm(defaultForm);
    setEditId(null);
    setError("");
    setShowModal(true);
  };

  const openEdit = (item) => {
    setForm({
      title: item.title, investedAmount: item.investedAmount,
      currentValue: item.currentValue, type: item.type,
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
      if (editId) await axiosInstance.put(`/investments/${editId}`, form);
      else await axiosInstance.post("/investments", form);
      setShowModal(false);
      fetchInvestments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this investment?")) return;
    await axiosInstance.delete(`/investments/${id}`);
    fetchInvestments();
  };

  const chartData = Object.values(
    investments.reduce((acc, inv) => {
      if (!acc[inv.type]) acc[inv.type] = { type: inv.type, invested: 0, current: 0 };
      acc[inv.type].invested += inv.investedAmount;
      acc[inv.type].current += inv.currentValue;
      return acc;
    }, {})
  );

  const returnPct = summary.totalInvested > 0
    ? ((summary.totalProfitLoss / summary.totalInvested) * 100).toFixed(2)
    : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Investments</h1>
          <p>Track your portfolio & profits</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <MdAdd size={18} /> Add
        </button>
      </div>

      <div className="summary-grid">
        <SummaryCard title="Total Invested" value={`₹${summary.totalInvested.toLocaleString("en-IN")}`} icon="💰" color="purple" subText="All investments" />
        <SummaryCard title="Current Value" value={`₹${summary.totalCurrentValue.toLocaleString("en-IN")}`} icon="📈" color="teal" subText="Market value" />
        <SummaryCard
          title="Total P&L"
          value={`${summary.totalProfitLoss >= 0 ? "+" : ""}₹${summary.totalProfitLoss.toLocaleString("en-IN")}`}
          icon={summary.totalProfitLoss >= 0 ? "🚀" : "📉"}
          color={summary.totalProfitLoss >= 0 ? "green" : "red"}
          subText={`${returnPct}% return`}
        />
        <SummaryCard title="Holdings" value={investments.length} icon="📊" color="blue" subText="Active investments" />
      </div>

      {chartData.length > 0 && (
        <div className="card">
          <div className="chart-title">📊 Portfolio by Type</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="type" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString("en-IN")}`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="invested" name="Invested" fill="#805ad5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="current" name="Current Value" fill="#48bb78" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <div className="chart-title">📋 Investment Records</div>
        {loading ? (
          <div className="loading"><span className="spinner" /> Loading...</div>
        ) : (
          <TransactionList items={investments} type="investment" onDelete={handleDelete} onEdit={openEdit} />
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editId ? "✏️ Edit Investment" : "➕ Add Investment"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Investment Title *</label>
                <input className="form-control" placeholder="e.g. Reliance Stocks" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Invested Amount (₹) *</label>
                  <input className="form-control" type="number" min="0.01" step="0.01" placeholder="0.00" value={form.investedAmount} onChange={(e) => setForm({ ...form, investedAmount: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Current Value (₹) *</label>
                  <input className="form-control" type="number" min="0" step="0.01" placeholder="0.00" value={form.currentValue} onChange={(e) => setForm({ ...form, currentValue: e.target.value })} required />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Type *</label>
                  <select className="form-control" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required>
                    {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date *</label>
                  <input className="form-control" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <input className="form-control" placeholder="Optional notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: "#fff" }} /> Saving...</> : editId ? "Update" : "Add Investment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investments;