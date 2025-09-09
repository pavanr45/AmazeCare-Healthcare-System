import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../PatientDashboard/ViewAppoinments/ViewAppointments.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../NavBar/navbar-doctor';

const token = sessionStorage.getItem('token');

function utcToIst(utcDateString) {
    const utcDate = new Date(utcDateString);
    const istTime = utcDate.getTime() + (5.5 * 60 * 60 * 1000);
    const istDate = new Date(istTime);
    return istDate.toISOString();
}

const DAppointment = () => {
    const { doctorId } = useParams();
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, [doctorId]);

    const fetchAppointments = async () => {
        try {
          

           const response = await axios.get(`http://localhost:9090/api/appointments/byDoctor/${doctorId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(response.data);
            setFilteredAppointments(response.data); // initialize
        } catch (error) {
            console.error('Error fetching appointments:', error);
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

    const handleCancel = async (appointmentId) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            try {
                await axios.put(`http://localhost:9090/StatusToCancelAppointment?id=${appointmentId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchAppointments();
                alert("Appointment cancelled.");
            } catch (error) {
                console.error('Error cancelling appointment:', error);
            }
        }
    };

    const handleFilterChange = (status) => {
        setSelectedStatus(status);
        if (status === '') {
            setFilteredAppointments(appointments);
        } else {
            const filtered = appointments.filter(appt => appt.status === status);
            setFilteredAppointments(filtered);
        }
    };

    const handleRescheduleDateTime = (appointmentId) => {
        setShowDateTimePicker(true);
        setSelectedAppointment(appointmentId);
    };

    const handleConfirmDateTime = async () => {
        const now = new Date();
        if (selectedDateTime < now) {
            alert("Please select a future time for rescheduling.");
            return;
        }
        try {
            await axios.put(`http://localhost:9090/RescheduleAppointment`, {
                id: selectedAppointment,
                appointmentDate: utcToIst(selectedDateTime.toISOString())
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await axios.put(`http://localhost:9090/StatusToRescheduleAppointment?id=${selectedAppointment}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            fetchAppointments();
            setShowDateTimePicker(false);
            alert("Appointment has been rescheduled.");
        } catch (error) {
            console.error('Error rescheduling appointment:', error);
            alert("Failed to reschedule.");
        }
    };

    // Sort by date
    const renderAppointments = [...filteredAppointments].sort((a, b) => 
        new Date(b.appointmentDate) - new Date(a.appointmentDate)
    );

    return (
        <div className="appointment-page">
            <Navbar />
            <div className="appointment-container">
                <div className="appointments-box">
                    <h2 className="text-center"><strong>My Appointments</strong></h2>

                    <div className="filter-dropdown">
                        <label htmlFor="statusFilter">Filter by Status:</label>
                        <select id="statusFilter" value={selectedStatus} onChange={(e) => handleFilterChange(e.target.value)}>
                            <option value="">All</option>
                            <option value="Rescheduled">Rescheduled</option>
                            <option value="Upcoming">Upcoming</option>
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
                                <th>Appointment ID</th>
                                <th>Patient Name</th>
                                <th>Date & Time</th>
                                <th>Symptoms</th>
                                <th>Status</th>
                                <th>Records</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderAppointments.length > 0 ? (
                                renderAppointments.map(appointment => (
                                    <tr key={appointment.appointmentId}>
                                        <td>{appointment.appointmentId}</td>
                                        <td>{appointment.patientName}</td>
                                        <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                                        <td>{appointment.symptomsDescription}</td>
                                        <td>{appointment.status}</td>
                                        <td>
                                            {appointment.status !== "Cancelled" && appointment.status !== "Completed" && (
                                                <Link className="btn btn-primary"
                                                    to={`/doctorappointment/${doctorId}/generate-medical-record/${appointment.appointmentId}`}>
                                                    Generate Medical Records
                                                </Link>
                                            )}
                                        </td>
                                        <td>
                                            {appointment.status !== "Cancelled" && appointment.status !== "Completed" && (
                                                <>
                                                    <button className="btn btn-danger me-2"
                                                        onClick={() => handleCancel(appointment.appointmentId)}>Cancel</button>
                                                    <button className="btn btn-info"
                                                        onClick={() => handleRescheduleDateTime(appointment.appointmentId)}>Reschedule</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">No appointments found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {showDateTimePicker && (
                        <div className="date-time-picker-modal">
                            <h5>Select New Date & Time</h5>
                            <DatePicker
                                selected={selectedDateTime}
                                onChange={date => setSelectedDateTime(date)}
                                showTimeSelect
                                timeIntervals={15}
                                timeFormat="h:mm aa"
                                dateFormat="MMMM d, yyyy h:mm aa"
                                minDate={new Date()}
                                className="form-control"
                            />
                            <div className="mt-2">
                                <button className="btn btn-success me-2" onClick={handleConfirmDateTime}>Confirm</button>
                                <button className="btn btn-secondary" onClick={() => setShowDateTimePicker(false)}>Cancel</button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default DAppointment;
