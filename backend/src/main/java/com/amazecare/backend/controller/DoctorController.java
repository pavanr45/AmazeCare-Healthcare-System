package com.amazecare.backend.controller;

import com.amazecare.backend.model.Doctor;
import com.amazecare.backend.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:3000")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @PostMapping("/register")
    public ResponseEntity<Doctor> registerDoctor(@RequestBody Doctor doctor) {
        return ResponseEntity.ok(doctorService.createDoctor(doctor));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }
    
    @GetMapping("/specialities")
    public ResponseEntity<List<String>> getAllSpecialities() {
        return ResponseEntity.ok(doctorService.getAllSpecialities());
    }

    @GetMapping("/GetDoctorIdByUsername")
    public ResponseEntity<Long> getDoctorIdByUsername(@RequestParam String username) {
        Optional<Doctor> doctor = doctorService.getDoctorByUsername(username);
        return doctor.map(value -> ResponseEntity.ok(value.getId()))
                     .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update")
    public ResponseEntity<Doctor> updateDoctor(@RequestBody Doctor doctor) {
        return ResponseEntity.ok(doctorService.createDoctor(doctor));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok("Deleted Successfully");
    }
}
