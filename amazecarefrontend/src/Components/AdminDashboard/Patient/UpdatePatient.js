import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../Register/Register.css';
import Navbar from '../../NavBar/navbar';

const token = sessionStorage.getItem('token');

function UpdatePatient() {
    const navigate = useNavigate();
    const { patientId } = useParams();

    const [patient, setPatient] = useState({
        username: "",
        patientName: "",
        age: "",
        gender: "",
        dateOfBirth: "",
        contactNumber: "",
        password: "",
        role: "PATIENT"
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await axios.get(`http://localhost:9090/api/patients/${patientId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = res.data;
                setPatient({
                    username: data.username,
                    patientName: data.patientName,
                    age: data.age.toString(),
                    gender: data.gender,
                    dateOfBirth: data.dateOfBirth.split('T')[0],
                    contactNumber: data.contactNumber,
                    password: data.password || "",
                    role: data.role || "PATIENT"
                });
            } catch (err) {
                console.error("Failed to fetch patient:", err);
            }
        };
        fetchPatient();
    }, [patientId]);

    const validate = () => {
        const errs = {};
        if (!patient.patientName) errs.patientName = "Name required.";
        if (!patient.age || isNaN(patient.age) || patient.age < 1 || patient.age > 120) errs.age = "Invalid age.";
        if (!patient.gender) errs.gender = "Gender is required.";
        if (!patient.dateOfBirth) errs.dateOfBirth = "Date of birth is required.";
        if (!/^\d{10}$/.test(patient.contactNumber)) errs.contactNumber = "Contact number must be 10 digits.";
        if (!patient.password) errs.password = "Password is required.";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (field, value) => {
        setPatient({ ...patient, [field]: value });
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            await axios.put("http://localhost:9090/api/patients/update", {
                patientId: parseInt(patientId),
                ...patient
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Patient updated successfully!");
            navigate('/toPatientInfoAdmin');
        } catch (err) {
            console.error("Update failed:", err);
            alert("Update failed. Try again.");
        }
    };

    return (
        <div className="Update-Doctor">
            <Navbar />
            <div className="Update-Container">
                <div className="divUpdate">
                    <h1 className="update-h1"><strong>Update Patient</strong></h1>

                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" className="form-control" value={patient.username} disabled />
                    </div>

                    {[{ label: "Name", name: "patientName" },
                      { label: "Age", name: "age" },
                      { label: "Contact Number", name: "contactNumber" },
                      { label: "Password", name: "password", type: "password" }]
                      .map(({ label, name, type = "text" }) => (
                        <div className="form-group" key={name}>
                            <label>{label}</label>
                            <input
                                className="form-control"
                                type={type}
                                value={patient[name]}
                                onChange={(e) => handleChange(name, e.target.value)}
                            />
                            {errors[name] && <span className="text-danger">{errors[name]}</span>}
                        </div>
                    ))}

                    <div className="form-group">
                        <label>Gender</label>
                        <select
                            className="form-control"
                            value={patient.gender}
                            onChange={(e) => handleChange("gender", e.target.value)}
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
                            value={patient.dateOfBirth}
                            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                        />
                        {errors.dateOfBirth && <span className="text-danger">{errors.dateOfBirth}</span>}
                    </div>

                    <button className="register-button" onClick={handleSubmit}>Update Patient</button>
                </div>
            </div>
        </div>
    );
}

export default UpdatePatient;
