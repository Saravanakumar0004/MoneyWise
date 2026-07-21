import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const titles = {
  "/": "Dashboard",
  "/income": "Income",
  "/expenses": "Expenses",
  "/investments": "Investments",
};

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const title = titles[location.pathname] || "MoneyWise";
  const now = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric",
    month: "long", day: "numeric",
  });

  return (
    <div className="desktop-navbar">
      <div className="desktop-navbar-title">
        <h2>{title}</h2>
        <p>{now}</p>
      </div>
      <div className="desktop-navbar-user">
        <div className="desktop-navbar-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <span className="desktop-navbar-name">{user?.name}</span>
      </div>
    </div>
  );
};

export default Navbar;