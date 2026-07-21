import React from "react";
import { useLocation } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const titles = {
  "/": "Dashboard",
  "/income": "Income",
  "/expenses": "Expenses",
  "/investments": "Investments",
};

const Topbar = ({ open, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();
  const title = titles[location.pathname] || "MoneyWise";

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" onClick={onToggle}>
          {open ? <MdClose size={22} /> : <MdMenu size={22} />}
        </button>
        <div className="topbar-logo">
          <span className="topbar-logo-icon">💰</span>
          <span className="topbar-logo-text">{title}</span>
        </div>
      </div>
      <div className="topbar-right">
        <div className="topbar-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Topbar;