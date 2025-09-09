import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Public Pages
import HomePage from './Components/MainPage/MainPage';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import ResetPassword from './Components/Login/ForgotPassword';

// Dashboards
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import DoctorDashboard from './Components/DoctorDashboard/DoctorDashboard';
import PatientDashboard from './Components/PatientDashboard/PatientDashboard';

// Admin Components
import Doctor from './Components/AdminDashboard/Doctors/Doctor';
import AddDoctor from './Components/AdminDashboard/Doctors/AddDoctor';
import UpdateDoctor from './Components/AdminDashboard/Doctors/UpdateDoctor';
import Appointment from './Components/AdminDashboard/Appointments/Appointment';
import Patient from './Components/AdminDashboard/Patient/Patient';
import AddPatient from './Components/AdminDashboard/Patient/AddPatient';
import UpdatePatient from './Components/AdminDashboard/Patient/UpdatePatient';

// Patient Components
import Doctors from './Components/PatientDashboard/ViewAllDoctors/Doctors'; 
import BookAppointment from './Components/PatientDashboard/ViewAllDoctors/BookAppoinment/BookApppointment';
import ViewAppointments from './Components/PatientDashboard/ViewAppoinments/ViewAppointments';
import MedicalRecords from './Components/PatientDashboard/ViewMedicalRecords/ViewMedicalRecords';
import ViewPrescriptionDetails from './Components/PatientDashboard/ViewMedicalRecords/ViewPrescription';

// Doctor Components
import DAppointment from './Components/DoctorDashboard/ViewDoctorAppointments/ViewDoctorAppointments';
import GenerateMedicalRecords from './Components/DoctorDashboard/ViewDoctorAppointments/WriteMedicalRecords/WriteMedicalRecords';
import CreatePrescription from './Components/DoctorDashboard/Prescription/CreatePrescription';
import UpdatePrescriptions from './Components/DoctorDashboard/Prescription/UpdatePrescription';
import MedicalRecordByAppointment from './Components/DoctorDashboard/MedicalRecords/MedicalRecordsByAppointmentId';

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot_password" element={<ResetPassword />} />

                {/* Admin Routes */}
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/toDoctors" element={<Doctor />} />
                <Route path="/addDoctor" element={<AddDoctor />} />
                <Route path="/updateDoctor/:doctorId" element={<UpdateDoctor />} />
                <Route path="/toAdminViewAppointments" element={<Appointment />} />
                <Route path="/toPatientInfoAdmin" element={<Patient />} />
                <Route path="/addPatient" element={<AddPatient />} />
                <Route path="/updatePatient/:patientId" element={<UpdatePatient />} />

                {/* Doctor Routes */}
                <Route path="/doctor-dashboard/:doctorId" element={<DoctorDashboard />} />
                <Route path="/doctorappointment/:doctorId" element={<DAppointment />} />
                <Route path="/doctorappointment/:doctorId/generate-medical-record/:appointmentId" element={<GenerateMedicalRecords />} />
                <Route path="/medicalhistory/:doctorId" element={<MedicalRecordByAppointment />} />
                <Route path="/medicalhistory/:doctorId/create-prescription/:recordId" element={<CreatePrescription />} />
                <Route path="/medicalhistory/:doctorId/update-prescription/:recordId" element={<UpdatePrescriptions />} />

                {/* Patient Routes */}
                <Route path="/patient-dashboard/:patientId" element={<PatientDashboard />} />
                <Route path="/doctors/:patientId" element={<Doctors />} />
                <Route path="/book-appointment/:patientId/:doctorId" element={<BookAppointment />} />
                <Route path="/appointments/:patientId" element={<ViewAppointments />} />
                <Route path="/medical-history/:patientId" element={<MedicalRecords />} />
                <Route path="/medical-history/:patientId/view-record/:recordId" element={<ViewPrescriptionDetails />} />
            </Routes>
        </Router>
    );
}

export default App;
