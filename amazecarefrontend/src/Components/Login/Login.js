

import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import '../Register/Register.css';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = {
            username: username,
            password: password,
            role: "",
            token: "",
        };

        try {
            const response = await axios.post("http://localhost:9090/api/users/login", user);
            const data = response.data;

            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("username", data.username);
            sessionStorage.setItem("role", data.role);

            alert("Login success - " + data.username);

            // Get userId based on role
            let apiUrl = "";
            if (data.role.toUpperCase() === 'DOCTOR') {
                apiUrl = `http://localhost:9090/api/doctors/GetDoctorIdByUsername?username=${data.username}`;
            } else if (data.role.toUpperCase() === 'PATIENT') {
                apiUrl = `http://localhost:9090/api/patients/GetPatientIdByUsername?username=${data.username}`;
            }

            let userId = null;
            if (apiUrl !== "") {
                const idResponse = await axios.get(apiUrl);
                userId = idResponse.data;
                sessionStorage.setItem("userId", userId);
            }

            // Final redirect logic
            switch (data.role.toUpperCase()) {
                case 'ADMIN':
                    window.location.href = `/admin-dashboard`;
                    break;
                case 'DOCTOR':
                    window.location.href = `/doctor-dashboard/${userId}`;
                    break;
                case 'PATIENT':
                    window.location.href = `/patient-dashboard/${userId}`;
                    break;
                default:
                    console.log("Unknown role:", data.role);
            }

        } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            alert(error.response?.data || "Login failed. Please try again.");
        }
    };

    return (
        <div>
            <div className='register-page '>
                <nav className="Register-navbar navbar-expand-lg ">
                    <a className="Register-navbar-brand" href="/">
                        <img src="images/logo-no-background.png" className="d-inline-block align-top" alt="Logo" />
                    </a>
                </nav>

                <div className='register-container'>
                    <div className="alert alert-success divregister ">
                        <h1 className="heading-tag-h1"><strong>Login</strong></h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label><i className="fa-solid fa-hospital-user"></i> Username</label>
                                <input className="form-control" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            </div>

                            <div className="form-group">
                                <label><i className="fa fa-unlock"></i> Password</label>
                                <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>

                            <button type="submit" className="register-button">Login</button>

                            <p><Link to='/forgot_password' style={{ padding: '1%' }}> Forgot Password</Link></p>
                            <p className="w3l-register-p">Don't have an account?<Link to='/register'> Register</Link></p>
                        </form>
                    </div>
                </div>
            </div>
            <Outlet />
        </div>
    );
}

export default Login;






