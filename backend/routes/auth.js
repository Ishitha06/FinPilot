const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const pool = require('../db');

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users
            (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email`,
            [
                name,
                email,
                hashedPassword
            ]
        );

        res.status(201).json({
            message: "Registration successful",
            user: result.rows[0]
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Registration failed"
        });

    }
});


router.post("/login", async (req, res) => {
    try {
         const { email, password } = req.body;

        const result = await pool.query(`SELECT * FROM users WHERE email = $1`,
            [email]
        );

        if(result.rows.length === 0) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if(!passwordMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign({
            userId: user.id },
            process.env.JWT_SECRET,
            {expiresIn: "1h"}
        );

        res.json({
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Login failed"
        });
    }
});

module.exports = router;