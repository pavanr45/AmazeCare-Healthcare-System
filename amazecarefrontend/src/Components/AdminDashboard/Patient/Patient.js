import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Patient.css';
import Navbar from '../../NavBar/navbar';

const token = sessionStorage.getItem('token');

const Patient = () => {
    const [patients, setPatients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get("http://localhost:9090/api/patients/all", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPatients(response.data);
            setFilteredPatients(response.data);
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = patients.filter(p =>
            p.patientId.toString().includes(query) ||
            p.patientName.toLowerCase().includes(query)
        );
        setFilteredPatients(filtered);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this patient?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:9090/api/patients/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchPatients(); // refresh
        } catch (error) {
            console.error("Error deleting patient:", error);
        }
    };

    return (
        <div className="patient-page">
            <Navbar />
            <div className="patient-container">
                <div className="appointments-box">
                    <h2 className="text-center">All Patients Details</h2>
                    <div className="appointment-search-bar row">
                        <input
                            type="text"
                            className="col-10"
                            placeholder="Search by Patient ID or Name"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <Link to="/addPatient" className="btn btn-primary addlink col-2">Add Patient</Link>
                    </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Patient ID</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>DOB</th>
                                <th>Contact</th>
                                <th>Username</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map(patient => (
                                    <tr key={patient.patientId}>
                                        <td>{patient.patientId}</td>
                                        <td>{patient.patientName}</td>
                                        <td>{patient.age}</td>
                                        <td>{patient.gender}</td>
                                        <td>{patient.dateOfBirth}</td>
                                        <td>{patient.contactNumber}</td>
                                        <td>{patient.username}</td>
                                        <td>
                                            <div className="button-container">
                                                <Link to={`/updatePatient/${patient.patientId}`} className="btn btn-info">Update</Link>
                                                <button className="btn btn-danger" onClick={() => handleDelete(patient.patientId)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">No Patients Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Patient;
