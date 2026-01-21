import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../Register/Register.css';
import api from "../../api";

function Login() {

    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ---------- DEMO USERS ----------
        const demoUsers = [
            { username: "admin@demo.com", password: "Admin@123", role: "ADMIN" },
            { username: "doctor@demo.com", password: "Doctor@123", role: "DOCTOR", userId: 101 },
            { username: "patient@demo.com", password: "Patient@123", role: "PATIENT", userId: 201 }
        ];

        const demoUser = demoUsers.find(
            u => u.username === username && u.password === password
        );

        // ---------- DEMO LOGIN ----------
        if (demoUser) {
            localStorage.setItem("token", "demo-token");
            localStorage.setItem("username", demoUser.username);
            localStorage.setItem("role", demoUser.role);
            localStorage.setItem("userId", demoUser.userId || "");

            alert("Demo Login Successful - " + demoUser.username);

            if (demoUser.role === "ADMIN") navigate("/admin-dashboard");
            if (demoUser.role === "DOCTOR") navigate(`/doctor-dashboard/${demoUser.userId}`);
            if (demoUser.role === "PATIENT") navigate(`/patient-dashboard/${demoUser.userId}`);
            return;
        }

        // ---------- BACKEND LOGIN ----------
        try {
            const response = await api.post("/api/users/login", { username, password });
            const data = response.data;

            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            localStorage.setItem("role", data.role);

            let userId = "";

            if (data.role === "DOCTOR") {
                const idRes = await api.get(`/api/doctors/GetDoctorIdByUsername?username=${data.username}`);
                userId = idRes.data;
            }
            else if (data.role === "PATIENT") {
                const idRes = await api.get(`/api/patients/GetPatientIdByUsername?username=${data.username}`);
                userId = idRes.data;
            }

            localStorage.setItem("userId", userId);

            alert("Login Success - " + data.username);

            if (data.role === "ADMIN") navigate("/admin-dashboard");
            if (data.role === "DOCTOR") navigate(`/doctor-dashboard/${userId}`);
            if (data.role === "PATIENT") navigate(`/patient-dashboard/${userId}`);

        } catch (error) {
            alert("Invalid credentials or backend not running. Try Demo Accounts.");
        }
    };

    return (
        <div>
            <div className='register-page'>
                <nav className="Register-navbar">
                    <a className="Register-navbar-brand" href="/">
                        <img src="images/logo-no-background.png" alt="Logo" />
                    </a>
                </nav>

                <div className='register-container'>
                    <div className="alert alert-success divregister">
                        <h1><strong>Login</strong></h1>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Username</label>
                                <input className="form-control"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input className="form-control"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required />
                            </div>

                            <button type="submit" className="register-button">Login</button>

                            <div style={{ marginTop: "12px", fontSize: "14px" }}>
                                <b>Demo Accounts</b><br />
                                Admin → admin@demo.com / Admin@123<br />
                                Doctor → doctor@demo.com / Doctor@123<br />
                                Patient → patient@demo.com / Patient@123
                            </div>

                            <p><Link to='/forgot_password'>Forgot Password</Link></p>
                            <p>Don't have an account? <Link to='/register'>Register</Link></p>
                        </form>
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default Login;
