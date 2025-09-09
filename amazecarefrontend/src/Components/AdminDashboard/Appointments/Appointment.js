import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Appointment.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import NavBar from '../../NavBar/navbar';

const token = sessionStorage.getItem('token');

const Appointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get("http://localhost:9090/api/appointments/all", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = appointments.filter(app => app.id.toString().includes(query));
        setFilteredAppointments(filtered);
    };

    const handleCancel = async (appointmentId) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            try {
                await axios.put(`http://localhost:9090/api/appointments/cancel/${appointmentId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchAppointments();
            } catch (error) {
                console.error('Error cancelling appointment:', error);
            }
        }
    };

    const handleRescheduleDoctor = async (appointmentId) => {
        const confirmReschedule = window.confirm("Reschedule doctor for this appointment?");
        if (confirmReschedule) {
            const newDoctorId = prompt("Enter new Doctor ID:");
            if (newDoctorId) {
                try {
                    await axios.put("http://localhost:9090/api/appointments/rescheduleDoctor", {
                        id: appointmentId,
                        doctorId: newDoctorId
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    await axios.put(`http://localhost:9090/api/appointments/rescheduleStatus/${appointmentId}`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    fetchAppointments();
                } catch (error) {
                    alert("Doctor rescheduling failed.");
                    console.error(error);
                }
            }
        }
    };

    const handleRescheduleDateTime = (appointmentId) => {
        setSelectedAppointment(appointmentId);
        setShowDateTimePicker(true);
    };

    const handleConfirmDateTime = async () => {
        if (selectedDateTime < new Date()) {
            alert("Please choose a future date.");
            return;
        }

        try {
            await axios.put("http://localhost:9090/api/appointments/rescheduleDate", {
                id: selectedAppointment,
                appointmentDate: selectedDateTime
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await axios.put(`http://localhost:9090/api/appointments/rescheduleStatus/${selectedAppointment}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            fetchAppointments();
            setShowDateTimePicker(false);
            alert("Appointment rescheduled.");
        } catch (error) {
            console.error("Error rescheduling:", error);
            alert("Rescheduling failed.");
        }
    };

    useEffect(() => {
        if (selectedStatus) {
            const filtered = appointments.filter(a => a.status === selectedStatus);
            setFilteredAppointments(filtered);
        } else {
            setFilteredAppointments(appointments);
        }
    }, [appointments, selectedStatus]);

    const displayAppointments = filteredAppointments.length > 0 ? filteredAppointments : appointments;

    return (
        <div className="appointment-page">
            <NavBar />
            <div className="appointment-container">
                <div className="appointments-box">
                    <h1 className="text-center">All Appointments</h1>

                    <div className="filter-dropdown">
                        <label htmlFor="statusFilter">Filter by Status:</label>
                        <select id="statusFilter" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                            <option value="">All</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Rescheduled">Rescheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="appointment-search-bar">
                        <input
                            type="text"
                            placeholder="Search by Appointment ID"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Appointment ID</th>
                                <th>Doctor Name</th>
                                <th>Patient Name</th>
                                <th>Date</th>
                                <th>Symptoms</th>
                                <th>Status</th>
                                <th>Nature of Visit</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayAppointments.length > 0 ? displayAppointments.map(appt => (
                                <tr key={appt.id}>
                                    <td>{appt.id}</td>
                                    <td>{appt.doctorName}</td>
                                    <td>{appt.patientName}</td>
                                    <td>{new Date(appt.appointmentDate).toLocaleString()}</td>
                                    <td>{appt.symptomsDescription}</td>
                                    <td>{appt.status}</td>
                                    <td>{appt.natureOfVisit}</td>
                                    <td>
                                        {(appt.status !== "Cancelled" && appt.status !== "Completed") && (
                                            <>
                                                <button className="btn btn-danger" onClick={() => handleCancel(appt.id)}>Cancel</button>
                                                <button className="btn btn-info" onClick={() => handleRescheduleDoctor(appt.id)}>Reschedule Doctor</button>
                                                <button className="btn btn-info" onClick={() => handleRescheduleDateTime(appt.id)}>Reschedule Date</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="8" className="text-center">No appointments found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showDateTimePicker && (
                <div className="date-time-picker-container">
                    <DatePicker
                        selected={selectedDateTime}
                        onChange={date => setSelectedDateTime(date)}
                        showTimeSelect
                        timeIntervals={15}
                        dateFormat="yyyy-MM-dd HH:mm"
                        minDate={new Date()}
                    />
                    <button onClick={handleConfirmDateTime}>Confirm</button>
                </div>
            )}
        </div>
    );
};

export default Appointment;
