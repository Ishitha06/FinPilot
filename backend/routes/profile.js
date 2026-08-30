const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// GET PROFILE
router.get("/", authMiddleware, async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT 
                id,
                name,
                email,
                age,
                family_size,
                city,
                city_type,
                profession_type
             FROM users
             WHERE id = $1`,
            [req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to get profile"
        });
    }
});


// UPDATE PROFILE
router.put("/", authMiddleware, async (req, res) => {
    try {

        const {
            name,
            age,
            family_size,
            city,
            city_type,
            profession_type
        } = req.body;

        const result = await pool.query(
            `UPDATE users
             SET
                name = $1,
                age = $2,
                family_size = $3,
                city = $4,
                city_type = $5,
                profession_type = $6
             WHERE id = $7
             RETURNING
                id,
                name,
                email,
                age,
                family_size,
                city,
                city_type,
                profession_type`,
            [
                name,
                age,
                family_size,
                city,
                city_type,
                profession_type,
                req.userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Profile updated successfully",
            user: result.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to update profile"
        });
    }
});


module.exports = router;