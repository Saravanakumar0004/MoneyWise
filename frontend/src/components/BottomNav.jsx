import React from "react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard, MdAttachMoney,
  MdTrendingDown, MdShowChart
} from "react-icons/md";

const navItems = [
  { path: "/", icon: MdDashboard, label: "Home" },
  { path: "/income", icon: MdAttachMoney, label: "Income" },
  { path: "/expenses", icon: MdTrendingDown, label: "Expenses" },
  { path: "/investments", icon: MdShowChart, label: "Invest" },
];

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `bottom-nav-item ${isActive ? "active" : ""}`
            }
          >
            <Icon size={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;