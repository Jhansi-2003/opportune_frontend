import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserShield } from "react-icons/fa";
import './LoginRegister.css';
import { signInWithEmailAndPassword } from 'firebase/auth';


// Firebase Auth
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebase'; // ✅ Make sure this is the correct path

function LoginRegister() {
    const [isActive, setIsActive] = useState(false);
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const toggleActiveState = () => setIsActive(!isActive);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adminUsername, setAdminUsername] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const ADMIN_CREDENTIALS = {
        username: "admin",
        password: "admin123",
    };

    const register = async (event) => {
        event.preventDefault();

        try {
            // Step 1: Save to MySQL
            const res = await axios.post("http://localhost:3000/register", {
                username,
                email,
                password
            });
            console.log("MySQL registration:", res.data);

            // Step 2: Create Firebase account
            await createUserWithEmailAndPassword(auth, email, password);
            console.log("Firebase registration successful");

            // Step 3: Sign in immediately
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Signed in after registration:", userCredential.user);

            // Step 4: Navigate
            navigate("/home");
        } catch (err) {
            console.error("Registration or login error:", err.response ? err.response.data : err.message);
            alert("Error during registration. Maybe email is already in use.");
        }
    };


    // const register = async (event) => {
    //     event.preventDefault();

    //     try {
    //         // Step 1: Save to your backend (MySQL)
    //         const res = await axios.post("http://localhost:3000/register", {
    //             username,
    //             email,
    //             password
    //         });
    //         console.log("MySQL registration:", res.data);

    //         // Step 2: Create user in Firebase Auth
    //         await createUserWithEmailAndPassword(auth, email, password);
    //         console.log("Firebase Auth registration: success");

    //         navigate("/home");
    //     } catch (err) {
    //         console.error("Registration error:", err.response ? err.response.data : err.message);
    //         alert("Error during registration. Maybe email is already in use.");
    //     }
    // };

    const login = async (event) => {
        event.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Firebase login success:", userCredential.user);
            // You can now fetch extra info from MySQL if needed
            navigate("/home");
        } catch (error) {
            console.error("Firebase login failed:", error.message);
            alert("Invalid login. Please check your email and password.");
        }
    };


    const handleAdminLogin = () => {
        if (adminUsername === ADMIN_CREDENTIALS.username && adminPassword === ADMIN_CREDENTIALS.password) {
            navigate("/admin");
        } else {
            setError("Invalid Admin Credentials!");
        }
    };

    return (
        <div className="login-register">
            <div
                className="login-container-image"
                style={{ backgroundImage: "url('/assets/images/login_background.jpg')" }}
            >
                <a href="/" className="logo-link">
                    <img src="assets/images/logo.png" alt="Logo" className="logo" />
                </a>
            </div>

            <div className={`content justify-content-center align-items-center shadow-lg ${isActive ? "active" : ""}`} id="admin-background">
                {/* Admin Icon */}
                <div
                    className="admin-icon"
                    onClick={() => {
                        setIsAdminLogin(!isAdminLogin);
                        setError("");
                    }}
                    style={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        fontSize: "1.8rem",
                        cursor: "pointer",
                        color: isAdminLogin ? "#007bff" : "#000"
                    }}
                    title="Admin Login"
                >
                    <FaUserShield />
                </div>

                {/* Admin Login Form */}
                {isAdminLogin && (
                    <div className="admin-login-form" style={{ width: "100%", padding: "1rem" }}>
                        <div className="header-text mb-3">
                            <h2>Admin Login</h2>
                        </div>
                        <input
                            type="text"
                            placeholder="Admin Username"
                            value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Admin Password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                        />
                        <button onClick={handleAdminLogin}>Login as Admin</button>
                        {error && <p className="error" style={{ color: "red" }}>{error}</p>}
                    </div>
                )}

                {/* User Login/Register Forms */}
                {!isAdminLogin && (
                    <>
                        <div className="left-box">
                            {!isActive ? (
                                <form onSubmit={register}>
                                    <div className="header-text mb-4">
                                        <h1>Create Account</h1>
                                    </div>
                                    <input type="text" placeholder="Enter Name" onChange={e => setUsername(e.target.value)} />
                                    <input type="email" placeholder=" Enter your Email" onChange={e => setEmail(e.target.value)} />
                                    <input type="password" placeholder="Enter 6 digit Password" onChange={e => setPassword(e.target.value)} />
                                    <button type="submit">Register</button>
                                </form>
                            ) : (
                                <form onSubmit={login}>
                                    <div className="header-text mb-4">
                                        <h1>Sign In</h1>
                                    </div>
                                    <input type="email" placeholder="Enter Email" value={email} onChange={e => setEmail(e.target.value)} />
                                    <input type="password" placeholder="Enter 6 digit Password" value={password} onChange={e => setPassword(e.target.value)} />
                                    <button type="submit">Login</button>
                                    <p className="forgot-password" onClick={() => navigate("/forgot-password")}>
                                        Forgot Password?
                                    </p>
                                </form>
                            )}
                        </div>

                        <div className="right-box">
                            {isActive && (
                                <form onSubmit={login}>
                                    <div className="header-text mb-4"></div>
                                </form>
                            )}
                        </div>

                        <div className="switch-content">
                            {!isActive ? (
                                <>
                                    <h1>Welcome!</h1>
                                    <p>Enter your personal details and start your journey with us.</p>
                                    <button onClick={toggleActiveState}>Sign In</button>
                                </>
                            ) : (
                                <>
                                    <h1>Hello, Again!</h1>
                                    <p>We are happy to see you back.</p>
                                    <button onClick={toggleActiveState}>Register</button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default LoginRegister;
