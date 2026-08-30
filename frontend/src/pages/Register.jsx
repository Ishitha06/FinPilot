import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../css/global.css";
import "../css/auth.css";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [familySize, setFamilySize] = useState("");
    const [city, setCity] = useState("");
    const [cityType, setCityType] = useState("metropolitan");
    const [professionType, setProfessionType] =
        useState("salaried");

    const handleRegister = async (e) => {
    e.preventDefault();

    try {

        const response = await fetch(
            "http://localhost:8080/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
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

        alert("Registration successful!");

        navigate("/");

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
                    Start your journey toward
                    <span className="auth-highlight">
                        {" "}financial confidence.
                    </span>
                </h1>

                <p>
                    Create your FinPilot account and get personalized
                    insights into your expenses, savings, investments
                    and financial goals.
                </p>

            </div>


            <div className="auth-right">

                <div className="auth-card">

                    <h2>Create your account</h2>

                    <p className="auth-subtitle">
                        Enter your details to get started.
                    </p>


                    <form
                        className="auth-form"
                        onSubmit={handleRegister}
                    >

                        <div className="auth-group">

                            <label>Name</label>

                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />

                        </div>


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
                                placeholder="Create a password"
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
                            Create Account
                        </button>

                    </form>


                    <div className="auth-switch">

                        Already have an account?{" "}

                        <Link to="/">
                            Login
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;