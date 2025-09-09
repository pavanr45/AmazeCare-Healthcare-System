import React, { useState } from "react";
import axios from "axios";
import "../../Register/Register.css";
import Navbar from "../../NavBar/navbar";
import { useNavigate } from "react-router-dom";

function AddPatient() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [patientName, setPatientName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [contactNumber, setContactNumber] = useState("");

    const [errors, setErrors] = useState({});

    const validate = () => {
        const errs = {};
        if (username.length < 3) errs.username = "Username must be at least 3 characters.";
        if (password.length < 6) errs.password = "Password must be at least 6 characters.";
        if (!patientName) errs.patientName = "Patient name is required.";
        if (!age || isNaN(age) || age < 0 || age > 120) errs.age = "Invalid age.";
        if (!gender) errs.gender = "Gender is required.";
        if (!dateOfBirth) errs.dateOfBirth = "Date of birth is required.";
        if (!/^\d{10}$/.test(contactNumber)) errs.contactNumber = "Contact number must be 10 digits.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const patient = {
            username,
            password,
            patientName,
            age,
            gender,
            dateOfBirth,
            contactNumber,
            role: "Patient"
        };

        try {
            await axios.post("http://localhost:9090/api/patients/register", patient);
            alert("Patient registered successfully!");
            navigate("/toPatientInfoAdmin");
        } catch (error) {
            alert("Registration failed.");
            console.error(error);
        }
    };

    return (
        <div className="Update-Doctor">
            <Navbar />
            <div className="Update-Container">
                <div className="divUpdate">
                    <h1 className="update-h1"><strong>Add Patient</strong></h1>

                    {[{ label: "Username", value: username, setValue: setUsername, name: "username" },
                      { label: "Password", value: password, setValue: setPassword, name: "password", type: "password" },
                      { label: "Name", value: patientName, setValue: setPatientName, name: "patientName" },
                      { label: "Age", value: age, setValue: setAge, name: "age" },
                      { label: "Contact Number", value: contactNumber, setValue: setContactNumber, name: "contactNumber" }]
                    .map(({ label, value, setValue, name, type = "text" }) => (
                        <div className="form-group" key={name}>
                            <label>{label}</label>
                            <input
                                type={type}
                                className="form-control"
                                value={value}
                                onChange={e => setValue(e.target.value)}
                            />
                            {errors[name] && <span className="text-danger">{errors[name]}</span>}
                        </div>
                    ))}

                    <div className="form-group">
                        <label>Gender</label>
                        <select
                            className="form-control"
                            value={gender}
                            onChange={e => setGender(e.target.value)}
                        >
                            <option value="">--Select Gender--</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Others">Others</option>
                        </select>
                        {errors.gender && <span className="text-danger">{errors.gender}</span>}
                    </div>

                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            className="form-control"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                        {errors.dateOfBirth && <span className="text-danger">{errors.dateOfBirth}</span>}
                    </div>

                    <button className="register-button" onClick={handleSubmit}>Add Patient</button>
                </div>
            </div>
        </div>
    );
}

export default AddPatient;
