import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  MdDashboard, MdAttachMoney, MdTrendingDown,
  MdShowChart, MdLogout
} from "react-icons/md";

const navItems = [
  { path: "/", icon: MdDashboard, label: "Dashboard" },
  { path: "/income", icon: MdAttachMoney, label: "Income" },
  { path: "/expenses", icon: MdTrendingDown, label: "Expenses" },
  { path: "/investments", icon: MdShowChart, label: "Investments" },
];

const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${open ? "open" : ""}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">💰</span>
          <div className="sidebar-logo-text">
            <h1>MoneyWise</h1>
            <span>Finance Tracker</span>
          </div>
        </div>

        {/* User */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-name">{user?.name}</div>
          <div className="sidebar-user-email">{user?.email}</div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
              onClick={onClose}
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <MdLogout size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;