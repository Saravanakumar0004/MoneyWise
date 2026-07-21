import React from "react";

const colorMap = {
  blue:   { bg: "#ebf8ff", border: "#bee3f8" },
  green:  { bg: "#f0fff4", border: "#c6f6d5" },
  red:    { bg: "#fff5f5", border: "#fed7d7" },
  purple: { bg: "#faf5ff", border: "#e9d8fd" },
  orange: { bg: "#fffaf0", border: "#feebc8" },
  teal:   { bg: "#e6fffa", border: "#b2f5ea" },
  yellow: { bg: "#fffff0", border: "#fefcbf" },
};

const SummaryCard = ({ title, value, icon, color = "blue", subText }) => {
  const c = colorMap[color] || colorMap.blue;

  return (
    <div
      className="summary-card"
      style={{ borderColor: c.border }}
    >
      <div className="summary-card-inner">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="summary-card-label">{title}</div>
          <div className="summary-card-value">{value}</div>
          {subText && (
            <div className="summary-card-sub">{subText}</div>
          )}
        </div>
        <div
          className="summary-card-icon"
          style={{ background: c.bg }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;