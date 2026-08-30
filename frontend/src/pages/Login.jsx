import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../css/global.css";
import "../css/auth.css";

function Login({ setIsLoggedIn }) {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

   const handleLogin = async (e) => {
    e.preventDefault();

    try {

        const response = await fetch(
            "http://localhost:8080/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        localStorage.setItem("token", data.token);

        setIsLoggedIn(true);

        navigate("/dashboard");

    } catch (error) {

        console.log(error);

        alert("Cannot connect to server");
    }
};

    return (
        <div className="auth-page">

            <div className="auth-left">

                <div className="auth-logo">
                    FinPilot
                </div>

                <h1>
                    Take control of your
                    <span className="auth-highlight">
                        {" "}financial future.
                    </span>
                </h1>

                <p>
                    Track your expenses, understand your savings,
                    plan your goals and build a financially secure future
                    with FinPilot.
                </p>

            </div>


            <div className="auth-right">

                <div className="auth-card">

                    <h2>Welcome back</h2>

                    <p className="auth-subtitle">
                        Sign in to continue to your financial dashboard.
                    </p>


                    <form
                        className="auth-form"
                        onSubmit={handleLogin}
                    >

                        <div className="auth-group">

                            <label>Email</label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="auth-group">

                            <label>Password</label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                        </div>


                        <button
                            type="submit"
                            className="auth-button"
                        >
                            Login
                        </button>

                    </form>


                    <div className="auth-switch">

                        New user?{" "}

                        <Link to="/register">
                            Sign Up
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;