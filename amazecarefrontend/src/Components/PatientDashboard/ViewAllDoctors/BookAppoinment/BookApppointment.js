import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../BookAppoinment/BookAppointment.css';
import PatientNavbar from '../../../NavBar/navbar-patient';

const token = sessionStorage.getItem('token');

function utcToIst(utcDateString) {
    const utcDate = new Date(utcDateString);
    const istTime = utcDate.getTime() + (5.5 * 60 * 60 * 1000);
    const istDate = new Date(istTime);
    return istDate.toISOString();
}

function BookAppointment() {
    const { patientId, doctorId } = useParams();
    const navigate = useNavigate();

    const [appointmentDate, setAppointmentDate] = useState(new Date());
    const [doctorName, setDoctorName] = useState("");
    const [patientName, setPatientName] = useState("");
    const [symptoms, setSymptoms] = useState("");
    const [natureOfVisit, setNatureOfVisit] = useState("");

    const [symptomsError, setSymptomsError] = useState("");
    const [natureOfVisitError, setNatureOfVisitError] = useState("");

    // Fetch doctor name
    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                

                const response = await axios.get(`http://localhost:9090/api/doctors/${doctorId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDoctorName(response.data.doctorName);
            } catch (error) {
                console.error('Error fetching doctor details:', error);
            }
        };
        fetchDoctorDetails();
    }, [doctorId]);

    // Fetch patient name
    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:9090/api/patients/${patientId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPatientName(response.data.patientName);
            } catch (error) {
                console.error('Error fetching patient details:', error);
            }
        };
        fetchPatientDetails();
    }, [patientId]);

    const validateSymptoms = () => {
        setSymptomsError(symptoms === "" ? "Please enter symptoms." : "");
    };

    const validateNatureOfVisit = () => {
        setNatureOfVisitError(natureOfVisit === "" ? "Please enter nature of visit." : "");
    };

    const bookAppointment = async (event) => {
        event.preventDefault();

        validateSymptoms();
        validateNatureOfVisit();

        if (symptoms === "" || natureOfVisit === "") {
            return;
        }

        const appointmentData = {
            patientId: patientId,
            doctorId: doctorId,
            appointmentDate: utcToIst(appointmentDate.toISOString()),
            symptomsDescription: symptoms,
            natureOfVisit: natureOfVisit
        };

        try {
            

            const response = await axios.post("http://localhost:9090/api/appointments/BookAnAppointment", appointmentData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert("Appointment booked successfully");
            navigate(`/appointments/${patientId}`);
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert("Failed to book. Choose a different time.");
        }
    };

    return (
        <div className="bookappointment-page">
            <PatientNavbar />
            <div className="bookappointment-container">
                <div className="bookappointments-box">
                    <h2 className="text-center">Book Appointment</h2>
                    <form onSubmit={bookAppointment}>
                        <div className="form-group">
                            <label>Doctor's Name:</label>
                            <input type="text" className="form-control" value={doctorName} readOnly />
                        </div>

                        <div className="form-group">
                            <label>Patient's Name:</label>
                            <input type="text" className="form-control" value={patientName} readOnly />
                        </div>

                        <div className="form-group">
                            <label>Symptoms</label>
                            <textarea
                                className="form-control"
                                placeholder="Enter symptoms"
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                            />
                            {symptomsError && <span className="text-danger">{symptomsError}</span>}
                        </div>

                        <div className="form-group">
                            <label>Preferred Appointment Date and Time:</label>
                            <DatePicker
                                selected={appointmentDate}
                                onChange={date => setAppointmentDate(date)}
                                showTimeSelect
                                timeFormat="h:mm aa"
                                timeIntervals={15}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                minDate={new Date()}
                            />
                        </div>

                        <div className="form-group">
                            <label>Nature of Visit</label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Enter nature of visit"
                                value={natureOfVisit}
                                onChange={(e) => setNatureOfVisit(e.target.value)}
                            />
                            {natureOfVisitError && <span className="text-danger">{natureOfVisitError}</span>}
                        </div>

                        <button type="submit" className="book-appointment-button btn btn-primary">
                            Book Appointment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BookAppointment;
