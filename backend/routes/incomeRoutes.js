const express = require("express");
const router = express.Router();

const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

function validateIncome(source_type, amount) {
    if (!source_type || amount === undefined || amount === null) {
        return "Income source and amount are required";
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return "Please enter a valid income amount";
    }

    return null;
}

// GET CURRENT MONTH INCOME FOR LOGGED-IN USER
router.get("/", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, user_id, source_type, amount, description, created_at
             FROM income
             WHERE user_id = $1
               AND created_at >= date_trunc('month', CURRENT_DATE)
               AND created_at < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
             ORDER BY id ASC`,
            [req.userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("GET INCOME ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch income"
        });
    }
});

// ADD INCOME
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { source_type, amount, description } = req.body;

        const validationError = validateIncome(source_type, amount);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const result = await pool.query(
            `INSERT INTO income
             (user_id, source_type, amount, description)
             VALUES ($1, $2, $3, $4)
             RETURNING id, user_id, source_type, amount, description, created_at`,
            [
                req.userId,
                source_type,
                Number(amount),
                description?.trim() || null
            ]
        );

        res.status(201).json({
            message: "Income added successfully",
            income: result.rows[0]
        });
    } catch (error) {
        console.error("ADD INCOME ERROR:", error);

        res.status(500).json({
            message: "Failed to add income"
        });
    }
});

// UPDATE INCOME
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { source_type, amount, description } = req.body;

        const validationError = validateIncome(source_type, amount);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const result = await pool.query(
            `UPDATE income
             SET source_type = $1,
                 amount = $2,
                 description = $3
             WHERE id = $4 AND user_id = $5
             RETURNING id, user_id, source_type, amount, description, created_at`,
            [
                source_type,
                Number(amount),
                description?.trim() || null,
                req.params.id,
                req.userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Income record not found"
            });
        }

        res.json({
            message: "Income updated successfully",
            income: result.rows[0]
        });
    } catch (error) {
        console.error("UPDATE INCOME ERROR:", error);

        res.status(500).json({
            message: "Failed to update income"
        });
    }
});

// DELETE INCOME
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query(
            `DELETE FROM income
             WHERE id = $1 AND user_id = $2
             RETURNING id`,
            [req.params.id, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Income record not found"
            });
        }

        res.json({
            message: "Income deleted successfully"
        });
    } catch (error) {
        console.error("DELETE INCOME ERROR:", error);

        res.status(500).json({
            message: "Failed to delete income"
        });
    }
});

module.exports = router;
