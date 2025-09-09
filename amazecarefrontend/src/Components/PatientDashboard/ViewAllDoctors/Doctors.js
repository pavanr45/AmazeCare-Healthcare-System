import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import PatientNavbar from '../../NavBar/navbar-patient';

const token = sessionStorage.getItem('token');

const Doctors = () => {
    const { patientId } = useParams();
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [specialityFilter, setSpecialityFilter] = useState('');
    const [allSpecialities, setAllSpecialities] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchDoctors();
        fetchAllSpecialities();
    }, [patientId]);

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

    const fetchAllSpecialities = async () => {
        try {
            const response = await axios.get("http://localhost:9090/api/doctors/specialities");
            setAllSpecialities(response.data);
        } catch (error) {
            console.error('Error fetching specialities:', error);
        }
    };

    const filterDoctors = () => {
        if (specialityFilter === "All" || specialityFilter === "") {
            setFilteredDoctors(doctors);
        } else {
            const filtered = doctors.filter(doctor =>
                doctor.speciality.toLowerCase() === specialityFilter.toLowerCase()
            );
            setFilteredDoctors(filtered);
        }
    };

    const resetFilter = () => {
        setSpecialityFilter('');
        setSearchQuery('');
        setFilteredDoctors(doctors);
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = doctors.filter(doctor =>
            doctor.id.toString().includes(query) || doctor.doctorName.toLowerCase().includes(query)
        );
        setFilteredDoctors(filtered);
    };

    return (
        <div className="patient-page">
            <PatientNavbar />

            <div className="patient-container">
                <div className="appointments-box">
                    <h2 className="text-center">All Doctors Details</h2>

                    <div className="filter-container">
                        <label>Filter by Speciality:</label>
                        <select
                            value={specialityFilter}
                            onChange={(e) => setSpecialityFilter(e.target.value)}
                        >
                            <option value="">Select Speciality</option>
                            <option value="All">All Specialities</option>
                            {allSpecialities.map((speciality, index) => (
                                <option key={index} value={speciality}>
                                    {speciality}
                                </option>
                            ))}
                        </select>

                        <button className="btn btn-primary" onClick={filterDoctors}>
                            Filter
                        </button>
                        <button className="btn btn-secondary" onClick={resetFilter}>
                            Reset
                        </button>
                    </div>

                    <div className="appointment-search-bar">
                        <input
                            type="text"
                            placeholder="Search by Doctor ID or Name"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
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
                                        <td>
                                            <Link to={`/book-appointment/${patientId}/${doctor.id}`} className="btn btn-info">
                                                Book Appointment
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">No Doctors found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Doctors;
