

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './Doctor.css';
import Navbar from '../../NavBar/navbar';

const token = sessionStorage.getItem('token');

const Doctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const { patientId } = useParams(); // ✅ fetch patientId from route

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get("http://localhost:9090/api/doctors/all", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDoctors(response.data);
            setFilteredDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        if (query === '') {
            setFilteredDoctors(doctors);
        } else {
            const filtered = doctors.filter(doctor =>
                doctor.id.toString().includes(query) ||
                doctor.doctorName.toLowerCase().includes(query)
            );
            setFilteredDoctors(filtered);
        }
    };

    const handleDelete = async (doctorId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this doctor?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:9090/api/doctors/delete/${doctorId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                fetchDoctors();
            } catch (error) {
                console.error('Error deleting doctor:', error);
            }
        }
    };

    return (
        <div className="doctor-page">
            <Navbar />
            <div className="doctor-container">
                <div className="doctors-box">
                    <h2 className="text-center">All Doctors Details</h2>
                    <div className="appointment-search-bar row">
                        <input
                            type="text"
                            className='col-10'
                            placeholder="Search by Doctor ID or Name"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <Link to="/addDoctor" className="btn btn-primary addlink col-2">Add Doctor</Link>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Doctor ID</th>
                                <th>Name</th>
                                <th>Speciality</th>
                                <th>Experience</th>
                                <th>Qualification</th>
                                <th>Designation</th>
                                <th>Username</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDoctors.length > 0 ? (
                                filteredDoctors.map(doctor => (
                                    <tr key={doctor.id}>
                                        <td>{doctor.id}</td>
                                        <td>{doctor.doctorName}</td>
                                        <td>{doctor.speciality}</td>
                                        <td>{doctor.experience}</td>
                                        <td>{doctor.qualification}</td>
                                        <td>{doctor.designation}</td>
                                        <td>{doctor.username}</td>
                                        <td className='button-container d-flex flex-column gap-1'>
                                            <Link to={`/updateDoctor/${doctor.id}`} className="btn btn-info mb-1">Update</Link>
                                            <button className="btn btn-danger mb-1" onClick={() => handleDelete(doctor.id)}>Delete</button>

                                            {patientId && (
                                                <Link
                                                    to={`/bookappointment/${patientId}/${doctor.id}`}
                                                    className="btn btn-success"
                                                >
                                                    Book Appointment
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="8" className="text-center">No Doctors found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Doctor;
