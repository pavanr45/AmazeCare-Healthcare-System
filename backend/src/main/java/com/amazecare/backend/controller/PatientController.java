package com.amazecare.backend.controller;

import com.amazecare.backend.model.Patient;
import com.amazecare.backend.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping("/register")
    public ResponseEntity<?> registerPatient(@RequestBody Patient patient) {
        if (patientService.existsByUsername(patient.getUsername())) {
            return ResponseEntity.badRequest().body("Username already taken.");
        }
        return ResponseEntity.ok(patientService.createPatient(patient));
    }
    
    @GetMapping("/GetPatientIdByUsername")
    public ResponseEntity<Long> getPatientIdByUsername(@RequestParam String username) {
        Optional<Patient> patient = patientService.getPatientByUsername(username);
        return patient.map(value -> ResponseEntity.ok(value.getPatientId()))
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/all")
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return patientService.getPatientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update")
    public ResponseEntity<Patient> updatePatient(@RequestBody Patient patient) {
        return ResponseEntity.ok(patientService.createPatient(patient));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok("Patient deleted successfully.");
    }
}
