const express = require("express");
const router = express.Router();

const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

function validateExpense(category, amount) {
    if (!category || amount === undefined || amount === null) {
        return "Expense category and amount are required";
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return "Please enter a valid expense amount";
    }

    return null;
}

function getCurrentMonthDate() {
    const now = new Date();

    return new Date(
        Date.UTC(now.getFullYear(), now.getMonth(), 1)
    ).toISOString().slice(0, 10);
}

// GET CURRENT MONTH EXPENSES FOR LOGGED-IN USER
router.get("/", authMiddleware, async (req, res) => {
    try {
        const month = getCurrentMonthDate();

        const result = await pool.query(
            `SELECT id, user_id, category, amount, description, month, created_at
             FROM expenses
             WHERE user_id = $1
               AND month = $2
             ORDER BY id ASC`,
            [req.userId, month]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("GET EXPENSES ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch expenses"
        });
    }
});

// ADD EXPENSE
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { category, amount, description } = req.body;

        const validationError = validateExpense(category, amount);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const month = getCurrentMonthDate();

        const result = await pool.query(
            `INSERT INTO expenses
             (user_id, category, amount, description, month)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, user_id, category, amount, description, month, created_at`,
            [
                req.userId,
                category,
                Number(amount),
                description?.trim() || null,
                month
            ]
        );

        res.status(201).json({
            message: "Expense added successfully",
            expense: result.rows[0]
        });
    } catch (error) {
        console.error("ADD EXPENSE ERROR:", error);

        res.status(500).json({
            message: "Failed to add expense"
        });
    }
});

// UPDATE EXPENSE
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { category, amount, description } = req.body;

        const validationError = validateExpense(category, amount);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const result = await pool.query(
            `UPDATE expenses
             SET category = $1,
                 amount = $2,
                 description = $3
             WHERE id = $4 AND user_id = $5
             RETURNING id, user_id, category, amount, description, month, created_at`,
            [
                category,
                Number(amount),
                description?.trim() || null,
                req.params.id,
                req.userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Expense record not found"
            });
        }

        res.json({
            message: "Expense updated successfully",
            expense: result.rows[0]
        });
    } catch (error) {
        console.error("UPDATE EXPENSE ERROR:", error);

        res.status(500).json({
            message: "Failed to update expense"
        });
    }
});

// DELETE EXPENSE
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `DELETE FROM expenses
             WHERE id = $1 AND user_id = $2
             RETURNING id`,
            [req.params.id, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Expense record not found"
            });
        }

        res.json({
            message: "Expense deleted successfully"
        });
    } catch (error) {
        console.error("DELETE EXPENSE ERROR:", error);

        res.status(500).json({
            message: "Failed to delete expense"
        });
    }
});

module.exports = router;
