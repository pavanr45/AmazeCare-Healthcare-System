import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Register/Register.css';
import api from "../api";


function Login() {

    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ---------- DEMO USERS (Frontend only) ----------
        const demoUsers = [
            { username: "admin@demo.com", password: "Admin@123", role: "ADMIN" },
            { username: "doctor@demo.com", password: "Doctor@123", role: "DOCTOR", userId: 101 },
            { username: "patient@demo.com", password: "Patient@123", role: "PATIENT", userId: 201 }
        ];

        const demoUser = demoUsers.find(
            u => u.username === username && u.password === password
        );

        // ---------- If Demo Credentials ----------
        if (demoUser) {
            sessionStorage.setItem("token", "demo-token");
            sessionStorage.setItem("username", demoUser.username);
            sessionStorage.setItem("role", demoUser.role);
            sessionStorage.setItem("userId", demoUser.userId || "");

            alert("Demo Login Successful - " + demoUser.username);

            if (demoUser.role === "ADMIN") navigate("/admin-dashboard");
            if (demoUser.role === "DOCTOR") navigate(`/doctor-dashboard/${demoUser.userId}`);
            if (demoUser.role === "PATIENT") navigate(`/patient-dashboard/${demoUser.userId}`);

            return;
        }

        // ---------- Backend Login ----------
        const user = { username, password };

        try {
            // const response = await axios.post("http://localhost:9090/api/users/login", user);
            // const data = response.data;

            // sessionStorage.setItem("token", data.token);
            // sessionStorage.setItem("username", data.username);
            // sessionStorage.setItem("role", data.role);

            // let apiUrl = "";
            // if (data.role.toUpperCase() === 'DOCTOR')
            //     apiUrl = `http://localhost:9090/api/doctors/GetDoctorIdByUsername?username=${data.username}`;
            // else if (data.role.toUpperCase() === 'PATIENT')
            //     apiUrl = `http://localhost:9090/api/patients/GetPatientIdByUsername?username=${data.username}`;

            // let userId = "";
            // if (apiUrl !== "") {
            //     const idResponse = await axios.get(apiUrl);
            //     userId = idResponse.data;
            //     sessionStorage.setItem("userId", userId);
            // }

            // alert("Login Success - " + data.username);

            // if (data.role === "ADMIN") navigate("/admin-dashboard");
            // if (data.role === "DOCTOR") navigate(`/doctor-dashboard/${userId}`);
            // if (data.role === "PATIENT") navigate(`/patient-dashboard/${userId}`);
            const response = await api.post("/api/users/login", user);
            const data = response.data;

            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("username", data.username);
            sessionStorage.setItem("role", data.role);

            let userId = "";

            if (data.role === "DOCTOR") {
            const idRes = await api.get(`/api/doctors/GetDoctorIdByUsername?username=${data.username}`);
            userId = idRes.data;
            }
            else if (data.role === "PATIENT") {
            const idRes = await api.get(`/api/patients/GetPatientIdByUsername?username=${data.username}`);
            userId = idRes.data;
            }

            sessionStorage.setItem("userId", userId);

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
            <div className='register-page '>
                <nav className="Register-navbar navbar-expand-lg ">
                    <a className="Register-navbar-brand" href="/">
                        <img src="images/logo-no-background.png" alt="Logo" />
                    </a>
                </nav>

                <div className='register-container'>
                    <div className="alert alert-success divregister ">
                        <h1 className="heading-tag-h1"><strong>Login</strong></h1>

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

                            {/* ---- DEMO INFO ---- */}
                            <div style={{ marginTop: "12px", fontSize: "14px", color: "#000" }}>
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
