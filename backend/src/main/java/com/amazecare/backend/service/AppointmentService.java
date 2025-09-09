package com.amazecare.backend.service;

import com.amazecare.backend.dto.AppointmentDTO;
import com.amazecare.backend.model.Appointment;
import com.amazecare.backend.model.Doctor;
import com.amazecare.backend.model.Patient;
import com.amazecare.backend.repository.AppointmentRepository;
import com.amazecare.backend.repository.DoctorRepository;
import com.amazecare.backend.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    public Appointment createAppointment(Appointment appointment) {
        Doctor doctor = doctorRepository.findById(appointment.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Patient patient = patientRepository.findById(appointment.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setDoctorName(doctor.getDoctorName());
        appointment.setPatientName(patient.getPatientName());
        appointment.setStatus("Upcoming");

        return appointmentRepository.save(appointment);
    }

    public List<AppointmentDTO> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        List<AppointmentDTO> dtoList = new ArrayList<>();
        for (Appointment appt : appointments) {
            dtoList.add(convertToDTO(appt));
        }
        return dtoList;
    }

    public List<AppointmentDTO> getAppointmentsDTOByPatientId(Long patientId) {
        List<Appointment> appointments = patientRepository.findById(patientId)
                .map(appointmentRepository::findByPatient)
                .orElse(new ArrayList<>());

        List<AppointmentDTO> dtoList = new ArrayList<>();
        for (Appointment appt : appointments) {
            dtoList.add(convertToDTO(appt));
        }
        return dtoList;
    }

    public List<Appointment> getAppointmentsByDoctorId(Long doctorId) {
        return doctorRepository.findById(doctorId)
                .map(appointmentRepository::findByDoctor)
                .orElse(new ArrayList<>());
    }

    public List<Appointment> getAppointmentsByPatientId(Long patientId) {
        return patientRepository.findById(patientId)
                .map(appointmentRepository::findByPatient)
                .orElse(new ArrayList<>());
    }

    public Appointment rescheduleAppointment(Appointment updatedAppointment) {
        return appointmentRepository.findById(updatedAppointment.getId())
                .map(existing -> {
                    existing.setAppointmentDate(updatedAppointment.getAppointmentDate());
                    return appointmentRepository.save(existing);
                }).orElse(null);
    }

    public Appointment updateDoctorInAppointment(Appointment updatedAppointment) {
        return appointmentRepository.findById(updatedAppointment.getId())
                .map(existing -> {
                    Doctor doctor = doctorRepository.findById(updatedAppointment.getDoctorId()).orElse(null);
                    existing.setDoctor(doctor);
                    return appointmentRepository.save(existing);
                }).orElse(null);
    }

    public void updateStatus(Long appointmentId, String status) {
        appointmentRepository.findById(appointmentId).ifPresent(app -> {
            app.setStatus(status);
            appointmentRepository.save(app);
        });
    }

    private AppointmentDTO convertToDTO(Appointment appt) {
        AppointmentDTO dto = new AppointmentDTO();
        dto.setAppointmentId(appt.getId());
        dto.setStatus(appt.getStatus());
        dto.setDoctorName(appt.getDoctorName()); // Use stored name
        dto.setPatientName(appt.getPatientName()); // Use stored name
        dto.setSymptomsDescription(appt.getSymptomsDescription());
        dto.setNatureOfVisit(appt.getNatureOfVisit());
        dto.setAppointmentDate(appt.getAppointmentDate());
        return dto;
    }
}
