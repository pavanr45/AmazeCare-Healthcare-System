import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import PatientNavbar from '../../../NavBar/navbar-patient';
import './ViewAppointments.css';

const token = sessionStorage.getItem('token');

function ViewPatientAppointments() {
    const { patientId } = useParams();
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, [patientId]);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get(`http://localhost:9090/ViewAppointmentsByPatientId?patientId=${patientId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAppointments(response.data);
            setFilteredAppointments(response.data);
        } catch (error) {
            console.error('Error fetching patient appointments:', error);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = appointments.filter(appointment =>
            appointment.appointmentId.toString().includes(query)
        );
        setFilteredAppointments(filtered);
    };

    const handleFilterChange = (status) => {
        setSelectedStatus(status);
        if (status) {
            const filtered = appointments.filter(appointment => appointment.status === status);
            setFilteredAppointments(filtered);
        } else {
            setFilteredAppointments(appointments);
        }
    };

    return (
        <div className="appointment-page">
            <PatientNavbar />
            <div className="appointment-container">
                <div className="appointments-box">
                    <h2 className="text-center"><strong>My Appointments</strong></h2>

                    <div className="filter-dropdown">
                        <label htmlFor="statusFilter">Filter by Status:</label>
                        <select id="statusFilter" value={selectedStatus} onChange={(e) => handleFilterChange(e.target.value)}>
                            <option value="">All</option>
                            <option value="Rescheduled">Rescheduled</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div className="appointment-search-bar">
                        <input
                            type="text"
                            placeholder="Search by appointment ID"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Appointment ID</th>
                                <th scope="col">Doctor Name</th>
                                <th scope="col">Appointment Date</th>
                                <th scope="col">Symptoms</th>
                                <th scope="col">Status</th>
                                <th scope="col">Nature of Visit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.length > 0 ? (
                                filteredAppointments.map(appointment => (
                                    <tr key={appointment.appointmentId}>
                                        <td>{appointment.appointmentId}</td>
                                        <td>{appointment.doctorName}</td>
                                        <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                                        <td>{appointment.symptomsDescription}</td>
                                        <td>{appointment.status}</td>
                                        <td>{appointment.natureOfVisit}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">No appointments found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ViewPatientAppointments;
