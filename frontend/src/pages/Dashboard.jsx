import Sidebar from "../components/Sidebar";
import "../css/dashboard.css";
import "../css/global.css";

function Dashboard() {
    return (
        <div className="dashboard">

            <Sidebar />

            <main className="dashboard-content">

                <div className="dashboard-header">
                    <div>
                        <h1>Financial Dashboard</h1>
                        <p>
                            Get an overview of your financial health.
                        </p>
                    </div>

                   
                </div>


                {/* Summary Cards */}

                <div className="summary-cards">

                    <div className="summary-card">
                        <p className="card-title">
                            Financial Safety
                        </p>

                        <h2>74</h2>

                        <span className="positive">
                            Good
                        </span>
                    </div>


                    <div className="summary-card">
                        <p className="card-title">
                            Monthly Savings
                        </p>

                        <h2>₹25,000</h2>

                        <span className="positive">
                            28% of income
                        </span>
                    </div>


                    <div className="summary-card">
                        <p className="card-title">
                            Total Investments
                        </p>

                        <h2>₹4.2 L</h2>

                        <span className="card-description">
                            Across 4 categories
                        </span>
                    </div>


                    <div className="summary-card">
                        <p className="card-title">
                            Goal Progress
                        </p>

                        <h2>62%</h2>

                        <span className="positive">
                            On track
                        </span>
                    </div>

                </div>


                {/* Main Dashboard Section */}

                <div className="dashboard-grid">

                    <div className="dashboard-card safety-card">

                        <div className="card-header">
                            <div>
                                <h2>Financial Safety Index</h2>

                                <p>
                                    Your financial stability based on
                                    income, expenses, savings and
                                    obligations.
                                </p>
                            </div>

                            <span className="info-icon">
                                ?
                            </span>
                        </div>


                        <div className="safety-score">
                            <div className="score-circle">
                                <span>74</span>
                                <small>/ 100</small>
                            </div>

                            <div>
                                <h3>Good Financial Position</h3>

                                <p>
                                    Your current financial position
                                    is relatively stable.
                                </p>
                            </div>
                        </div>

                    </div>


                    <div className="dashboard-card">

                        <div className="card-header">
                            <div>
                                <h2>Goal Progress</h2>

                                <p>
                                    Your current financial goals
                                </p>
                            </div>
                        </div>


                        <div className="goal">

                            <div className="goal-info">
                                <span>Car Purchase</span>
                                <span>62%</span>
                            </div>

                            <div className="progress-bar">
                                <div
                                    className="progress"
                                    style={{ width: "62%" }}
                                ></div>
                            </div>

                            <p>
                                ₹3.1L saved of ₹5L
                            </p>

                        </div>

                    </div>

                </div>


                {/* Quick Actions */}

                <div className="dashboard-card quick-actions">

                    <h2>Quick Actions</h2>

                    <div className="action-buttons">

                        <button>
                            + Add Income
                        </button>

                        <button>
                            + Add Expense
                        </button>

                        <button>
                            + Add Investment
                        </button>

                        <button>
                            + Add Goal
                        </button>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;