import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";

const categoryColors = {
  "Food & Dining": "badge-orange",
  "Transportation": "badge-blue",
  "Housing & Rent": "badge-purple",
  "Utilities": "badge-yellow",
  "Healthcare": "badge-red",
  "Entertainment": "badge-purple",
  "Shopping": "badge-blue",
  "Education": "badge-green",
  "Personal Care": "badge-orange",
  "Travel": "badge-teal",
  "Insurance": "badge-yellow",
  "Other": "badge-blue",
  "Salary": "badge-green",
  "Freelance": "badge-blue",
  "Business": "badge-purple",
  "Investment Returns": "badge-green",
  "Rental Income": "badge-orange",
  "Bonus": "badge-yellow",
  "Gift": "badge-purple",
  "Stocks": "badge-blue",
  "Mutual Funds": "badge-green",
  "Fixed Deposit": "badge-yellow",
  "Real Estate": "badge-orange",
  "Gold": "badge-yellow",
  "Cryptocurrency": "badge-purple",
  "Bonds": "badge-blue",
  "PPF/NPS": "badge-green",
};

const TransactionList = ({ items, type, onDelete, onEdit }) => {
  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <div className="icon">📭</div>
        <p>No records found</p>
        <small>Click the button above to add your first one!</small>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>
              {type === "expense"
                ? "Category"
                : type === "income"
                ? "Source"
                : "Type"}
            </th>
            <th>Amount</th>
            {type === "investment" && <th>Current</th>}
            {type === "investment" && <th>P&L</th>}
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const tag =
              type === "expense"
                ? item.category
                : type === "income"
                ? item.source
                : item.type;

            const pl =
              type === "investment"
                ? item.currentValue - item.investedAmount
                : null;

            const amount =
              type === "investment"
                ? item.investedAmount
                : item.amount;

            return (
              <tr key={item._id}>
                <td>
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#1a202c",
                      fontSize: 13,
                    }}
                  >
                    {item.title}
                  </div>
                  {item.notes && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "#a0aec0",
                        marginTop: 2,
                      }}
                    >
                      {item.notes}
                    </div>
                  )}
                </td>
                <td>
                  <span
                    className={`badge ${
                      categoryColors[tag] || "badge-blue"
                    }`}
                  >
                    {tag}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      fontWeight: 700,
                      color:
                        type === "expense" ? "#e53e3e" : "#38a169",
                      fontSize: 13,
                    }}
                  >
                    {type === "expense" ? "-" : "+"}₹
                    {amount.toLocaleString("en-IN")}
                  </span>
                </td>
                {type === "investment" && (
                  <td
                    style={{
                      fontWeight: 700,
                      color: "#3182ce",
                      fontSize: 13,
                    }}
                  >
                    ₹{item.currentValue.toLocaleString("en-IN")}
                  </td>
                )}
                {type === "investment" && (
                  <td>
                    <span
                      style={{
                        fontWeight: 700,
                        color: pl >= 0 ? "#38a169" : "#e53e3e",
                        fontSize: 13,
                      }}
                    >
                      {pl >= 0 ? "+" : ""}₹
                      {pl.toLocaleString("en-IN")}
                      <span
                        style={{
                          fontSize: 10,
                          marginLeft: 3,
                          color: "#a0aec0",
                        }}
                      >
                        (
                        {item.investedAmount > 0
                          ? (
                              (pl / item.investedAmount) *
                              100
                            ).toFixed(1)
                          : 0}
                        %)
                      </span>
                    </span>
                  </td>
                )}
                <td
                  style={{
                    color: "#718096",
                    fontSize: 12,
                    whiteSpace: "nowrap",
                  }}
                >
                  {new Date(item.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    {onEdit && (
                      <button
                        className="btn btn-sm btn-icon"
                        onClick={() => onEdit(item)}
                        style={{
                          background: "#ebf8ff",
                          color: "#3182ce",
                          border: "1px solid #bee3f8",
                        }}
                        title="Edit"
                      >
                        <MdEdit size={15} />
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-danger btn-icon"
                      onClick={() => onDelete(item._id)}
                      title="Delete"
                    >
                      <MdDelete size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;