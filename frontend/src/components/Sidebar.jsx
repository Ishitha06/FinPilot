import { useState } from "react";
import "../css/sidebar.css";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    return (
        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

            <div className="logo-section">
                {!collapsed && <div className="logo">FinPilot</div>}

                <button
                    className="collapse-button"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? "▶" : "◀"}
                </button>
            </div>

            <nav className="sidebar-menu">

                <Link
                    to="/dashboard"
                    className={`sidebar-item ${
                        location.pathname === "/dashboard" ? "active" : ""
                    }`}
                >
                    <span>⌂</span>
                    {!collapsed && "Dashboard"}
                </Link>

                <Link
                    to="/expenses"
                    className={`sidebar-item ${
                        location.pathname === "/expenses" ? "active" : ""
                    }`}
                >
                    <span>◷</span>
                    {!collapsed && "Expense Tracking"}
                </Link>

                <Link
                    to="/savings"
                    className={`sidebar-item ${
                        location.pathname === "/savings" ? "active" : ""
                    }`}
                >
                    <span>₹</span>
                    {!collapsed && "Savings & Investments"}
                </Link>

                <Link
                    to="/goals"
                    className={`sidebar-item ${
                        location.pathname === "/goals" ? "active" : ""
                    }`}
                >
                    <span>◎</span>
                    {!collapsed && "Goal Planner"}
                </Link>

                <Link
                    to="/fire"
                    className={`sidebar-item ${
                        location.pathname === "/fire" ? "active" : ""
                    }`}
                >
                    <span>◈</span>
                    {!collapsed && "FIRE Engine"}
                </Link>

            </nav>

            <div className="sidebar-bottom">

                <Link
                    to="/settings"
                    className={`sidebar-item ${
                        location.pathname === "/settings" ? "active" : ""
                    }`}
                >
                    <span>⚙</span>
                    {!collapsed && "Settings"}
                </Link>

                <Link
                    to="/profile"
                    className={`sidebar-item ${
                        location.pathname === "/profile" ? "active" : ""
                    }`}
                >
                    <span>👤</span>
                    {!collapsed && "View Profile"}
                </Link>

            </div>

        </aside>
    );
}

export default Sidebar;