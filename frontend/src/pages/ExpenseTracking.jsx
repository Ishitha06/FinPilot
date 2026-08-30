import "../css/expense.css";
import "../css/global.css";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

const incomeCategories = [
    { value: "salary", label: "Salary" },
    { value: "business", label: "Business Income" },
    { value: "rental", label: "Rental Income" },
    { value: "agriculture", label: "Agricultural Income" },
    { value: "freelance", label: "Freelance / Professional Income" },
    { value: "pension", label: "Pension" },
    { value: "investment", label: "Investment / Interest Income" },
    { value: "other", label: "Other Income" }
];

const expenseCategories = [
    "Rent / EMI",
    "Groceries",
    "Premiums / Insurance",
    "Education",
    "Food Delivery",
    "Transport",
    "Entertainment / Subscriptions",
    "Lifestyle / Shopping",
    "Health / Healthcare",
    "Utilities",
    "Other"
];

const createEmptyIncome = () => ({
    id: null,
    amount: "",
    source_type: "salary",
    description: ""
});

const createEmptyExpense = () => ({
    id: null,
    amount: "",
    category: "Groceries",
    description: ""
});

function ExpenseTracking() {
    const [incomes, setIncomes] = useState([createEmptyIncome()]);
    const [expenses, setExpenses] = useState([createEmptyExpense()]);
    const [deletedIncomeIds, setDeletedIncomeIds] = useState([]);
    const [deletedExpenseIds, setDeletedExpenseIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const getAuthHeaders = () => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
    });

    const getErrorMessage = async (response) => {
        try {
            const data = await response.json();
            return data.message || "Request failed";
        } catch {
            return "Request failed";
        }
    };

    const loadData = async () => {
        try {
            setLoading(true);

            const headers = {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            };

            const [incomeResponse, expenseResponse] = await Promise.all([
                fetch(`${API_URL}/api/income`, { headers }),
                fetch(`${API_URL}/api/expenses`, { headers })
            ]);

            if (!incomeResponse.ok) {
                throw new Error(await getErrorMessage(incomeResponse));
            }

            if (!expenseResponse.ok) {
                throw new Error(await getErrorMessage(expenseResponse));
            }

            const incomeData = await incomeResponse.json();
            const expenseData = await expenseResponse.json();

            setIncomes(
                Array.isArray(incomeData) && incomeData.length > 0
                    ? incomeData.map((item) => ({
                          id: item.id,
                          amount: item.amount ?? "",
                          source_type: item.source_type ?? "salary",
                          description: item.description ?? ""
                      }))
                    : [createEmptyIncome()]
            );

            setExpenses(
                Array.isArray(expenseData) && expenseData.length > 0
                    ? expenseData.map((item) => ({
                          id: item.id,
                          amount: item.amount ?? "",
                          category: item.category ?? "Groceries",
                          description: item.description ?? ""
                      }))
                    : [createEmptyExpense()]
            );

            setDeletedIncomeIds([]);
            setDeletedExpenseIds([]);
        } catch (error) {
            console.error("LOAD ERROR:", error);
            alert(error.message || "Failed to load income and expenses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const updateIncome = (index, field, value) => {
        setIncomes((current) =>
            current.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    const updateExpense = (index, field, value) => {
        setExpenses((current) =>
            current.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    const addIncomeRow = () => {
        setIncomes((current) => [...current, createEmptyIncome()]);
    };

    const addExpenseRow = () => {
        setExpenses((current) => [...current, createEmptyExpense()]);
    };

    const removeIncome = (index) => {
        const removedItem = incomes[index];

        if (removedItem.id) {
            setDeletedIncomeIds((current) => [...current, removedItem.id]);
        }

        setIncomes((current) =>
            current.length === 1
                ? [createEmptyIncome()]
                : current.filter((_, i) => i !== index)
        );
    };

    const removeExpense = (index) => {
        const removedItem = expenses[index];

        if (removedItem.id) {
            setDeletedExpenseIds((current) => [...current, removedItem.id]);
        }

        setExpenses((current) =>
            current.length === 1
                ? [createEmptyExpense()]
                : current.filter((_, i) => i !== index)
        );
    };

    const totalIncome = incomes.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
    );

    const totalExpenses = expenses.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0
    );

    const remainingAmount = totalIncome - totalExpenses;

    const saveIncome = async (item) => {
        const method = item.id ? "PUT" : "POST";
        const url = item.id
            ? `${API_URL}/api/income/${item.id}`
            : `${API_URL}/api/income`;

        const response = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify({
                source_type: item.source_type,
                amount: Number(item.amount),
                description: item.description || null
            })
        });

        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }
    };

    const saveExpense = async (item) => {
        const method = item.id ? "PUT" : "POST";
        const url = item.id
            ? `${API_URL}/api/expenses/${item.id}`
            : `${API_URL}/api/expenses`;

        const response = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify({
                category: item.category,
                amount: Number(item.amount),
                description: item.description || null
            })
        });

        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }
    };

    const deleteRecord = async (url) => {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }
    };

    const saveAll = async () => {
        const validIncomes = incomes.filter(
            (item) => item.amount !== "" && Number(item.amount) > 0
        );

        const validExpenses = expenses.filter(
            (item) =>
                item.amount !== "" &&
                Number(item.amount) > 0 &&
                item.category
        );

        const hasDeletedRecords =
            deletedIncomeIds.length > 0 || deletedExpenseIds.length > 0;

        if (
            validIncomes.length === 0 &&
            validExpenses.length === 0 &&
            !hasDeletedRecords
        ) {
            alert("Please enter at least one income or expense amount");
            return;
        }

        try {
            setSaving(true);

            for (const item of validIncomes) {
                await saveIncome(item);
            }

            for (const item of validExpenses) {
                await saveExpense(item);
            }

            for (const id of [...new Set(deletedIncomeIds)]) {
                await deleteRecord(`${API_URL}/api/income/${id}`);
            }

            for (const id of [...new Set(deletedExpenseIds)]) {
                await deleteRecord(`${API_URL}/api/expenses/${id}`);
            }

            alert("Income and expenses saved successfully");
            await loadData();
        } catch (error) {
            console.error("SAVE ERROR:", error);
            alert(error.message || "Failed to save income and expenses");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="expense-page">
                <Sidebar />
                <main className="expense-content">
                    <h1>Expense Tracking</h1>
                    <p>Loading...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="expense-page">
            <Sidebar />

            <main className="expense-content">
                <div className="expense-header">
                    <h1>Expense Tracking</h1>
                    <p>Add your monthly income and expenses.</p>
                </div>

                <section className="tracking-card">
                    <div className="section-heading">
                        <div>
                            <h2>Income</h2>
                            <p>Add all monthly income sources after tax deduction.</p>
                        </div>

                        <button
                            type="button"
                            className="add-button"
                            onClick={addIncomeRow}
                        >
                            + Add Income
                        </button>
                    </div>

                    <div className="entry-list">
                        {incomes.map((item, index) => (
                            <div
                                className="entry-row"
                                key={item.id ?? `income-new-${index}`}
                            >
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Amount"
                                    value={item.amount}
                                    onChange={(e) =>
                                        updateIncome(index, "amount", e.target.value)
                                    }
                                />

                                <select
                                    value={item.source_type}
                                    onChange={(e) =>
                                        updateIncome(
                                            index,
                                            "source_type",
                                            e.target.value
                                        )
                                    }
                                >
                                    {incomeCategories.map((category) => (
                                        <option
                                            key={category.value}
                                            value={category.value}
                                        >
                                            {category.label}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="text"
                                    placeholder="Description (optional)"
                                    value={item.description}
                                    onChange={(e) =>
                                        updateIncome(
                                            index,
                                            "description",
                                            e.target.value
                                        )
                                    }
                                />

                                <button
                                    type="button"
                                    className="remove-button"
                                    onClick={() => removeIncome(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="section-total">
                        <span>Total Monthly Income</span>
                        <strong>₹{totalIncome.toLocaleString("en-IN")}</strong>
                    </div>
                </section>

                <section className="tracking-card">
                    <div className="section-heading">
                        <div>
                            <h2>Expenses</h2>
                            <p>Add all your monthly expenses.</p>
                        </div>

                        <button
                            type="button"
                            className="add-button"
                            onClick={addExpenseRow}
                        >
                            + Add Expense
                        </button>
                    </div>

                    <div className="entry-list">
                        {expenses.map((item, index) => (
                            <div
                                className="entry-row"
                                key={item.id ?? `expense-new-${index}`}
                            >
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Amount"
                                    value={item.amount}
                                    onChange={(e) =>
                                        updateExpense(index, "amount", e.target.value)
                                    }
                                />

                                <select
                                    value={item.category}
                                    onChange={(e) =>
                                        updateExpense(
                                            index,
                                            "category",
                                            e.target.value
                                        )
                                    }
                                >
                                    {expenseCategories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="text"
                                    placeholder="Description (optional)"
                                    value={item.description}
                                    onChange={(e) =>
                                        updateExpense(
                                            index,
                                            "description",
                                            e.target.value
                                        )
                                    }
                                />

                                <button
                                    type="button"
                                    className="remove-button"
                                    onClick={() => removeExpense(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="section-total">
                        <span>Total Monthly Expenses</span>
                        <strong>₹{totalExpenses.toLocaleString("en-IN")}</strong>
                    </div>
                </section>

                <section className="summary-card">
                    <div>
                        <span>Total Income</span>
                        <strong>₹{totalIncome.toLocaleString("en-IN")}</strong>
                    </div>

                    <div>
                        <span>Total Expenses</span>
                        <strong>₹{totalExpenses.toLocaleString("en-IN")}</strong>
                    </div>

                    <div>
                        <span>Remaining Amount</span>
                        <strong>
                            ₹{remainingAmount.toLocaleString("en-IN")}
                        </strong>
                    </div>
                </section>

                <div className="save-section">
                    <button
                        type="button"
                        className="save-button"
                        onClick={saveAll}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Monthly Data"}
                    </button>
                </div>
            </main>
        </div>
    );
}

export default ExpenseTracking;
