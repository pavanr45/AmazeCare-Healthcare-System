package com.amazecare.backend.controller;

import com.amazecare.backend.dto.LoginRequest;
import com.amazecare.backend.dto.LoginResponse;
import com.amazecare.backend.model.Doctor;
import com.amazecare.backend.model.Patient;
import com.amazecare.backend.repository.DoctorRepository;
import com.amazecare.backend.repository.PatientRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    private final String ADMIN_USERNAME = "admin";
    private final String ADMIN_PASSWORD = "admin123";

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();

        // Admin login
        if (ADMIN_USERNAME.equals(username) && ADMIN_PASSWORD.equals(password)) {
            LoginResponse adminResponse = new LoginResponse(
                    0L, ADMIN_USERNAME, "ADMIN", "dummy-admin-token"
            );
            return ResponseEntity.ok(adminResponse);
        }

        // Doctor login
        Doctor doctor = doctorRepository.findByUsernameAndPassword(username, password);
        if (doctor != null) {
            LoginResponse doctorResponse = new LoginResponse(
                    doctor.getId(),
                    doctor.getUsername(),
                    doctor.getRole(),
                    "dummy-doctor-token"
            );
            return ResponseEntity.ok(doctorResponse);
        }

        // Patient login
        Patient patient = patientRepository.findByUsernameAndPassword(username, password);
        if (patient != null) {
            LoginResponse patientResponse = new LoginResponse(
                    patient.getPatientId(), // ✅ FIXED HERE
                    patient.getUsername(),
                    patient.getRole(),
                    "dummy-patient-token"
            );
            return ResponseEntity.ok(patientResponse);
        }

        // Invalid credentials
        return ResponseEntity.status(401).body("Invalid username or password");
    }
}
