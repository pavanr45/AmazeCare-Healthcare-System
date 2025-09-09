package com.amazecare.backend.controller;

import com.amazecare.backend.dto.AppointmentDTO;
import com.amazecare.backend.model.Appointment;
import com.amazecare.backend.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired private AppointmentService appointmentService;

    @PostMapping("/BookAnAppointment")
    public Appointment bookAppointment(@RequestBody Appointment appointment) {
        return appointmentService.createAppointment(appointment);
    }

    @GetMapping("/all")
    public List<AppointmentDTO> viewAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/byDoctor/{id}")
    public List<Appointment> getAppointmentsByDoctorId(@PathVariable Long id) {
        return appointmentService.getAppointmentsByDoctorId(id);
    }

    // Keep this for internal usage or debugging
    @GetMapping("/byPatientRaw/{id}")
    public List<Appointment> getAppointmentsByPatientIdRaw(@PathVariable Long id) {
        return appointmentService.getAppointmentsByPatientId(id);
    }

    // ✅ This is used by the frontend: http://localhost:9090/api/appointments/byPatient?patientId=1
    @GetMapping("/byPatient")
    public List<AppointmentDTO> getAppointmentsByPatientIdDTO(@RequestParam Long patientId) {
        return appointmentService.getAppointmentsDTOByPatientId(patientId);
    }

    @PutMapping("/cancel/{id}")
    public void cancelAppointment(@PathVariable Long id) {
        appointmentService.updateStatus(id, "Cancelled");
    }

    @PutMapping("/rescheduleStatus/{id}")
    public void rescheduleStatus(@PathVariable Long id) {
        appointmentService.updateStatus(id, "Rescheduled");
    }

    @PutMapping("/rescheduleDate")
    public Appointment rescheduleDate(@RequestBody Appointment appointment) {
        return appointmentService.rescheduleAppointment(appointment);
    }

    @PutMapping("/rescheduleDoctor")
    public Appointment updateDoctor(@RequestBody Appointment appointment) {
        return appointmentService.updateDoctorInAppointment(appointment);
    }

    @PutMapping("/complete/{id}")
    public void completeAppointment(@PathVariable Long id) {
        appointmentService.updateStatus(id, "Completed");
    }
}
