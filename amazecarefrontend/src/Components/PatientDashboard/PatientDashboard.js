import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PatientNavbar from '../NavBar/navbar-patient';
import './PatientDashboard.css';

const PatientDashboard = () => {
    const { patientId } = useParams();

    useEffect(() => {}, [patientId]);

    return (
        <div className="PatientDashboard">
            <PatientNavbar patientId={patientId} />
            <div className="patient-section">
                <div className="container">
                    <div className="patient-box">
                        <h2 className="heading">Welcome To AmazeCare</h2>
                        <div className="text-center">
                            <Link to={`/doctors/${patientId}`} className="btn btn-info button-spacing">
                                Doctors Info
                            </Link>
                            <Link to={`/appointments/${patientId}`} className="btn btn-success button-spacing">
                                View Appointments
                            </Link>
                            <Link to={`/medical-history/${patientId}`} className="btn btn-warning button-spacing">
                                Medical History
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
