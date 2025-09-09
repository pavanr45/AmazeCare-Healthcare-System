package com.amazecare.backend.controller;

import com.amazecare.backend.model.Prescription;
import com.amazecare.backend.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @GetMapping("/record/{recordId}")
    public List<Prescription> getPrescriptionsByRecordId(@PathVariable Long recordId) {
        return prescriptionRepository.findByMedicalRecord_RecordId(recordId);
    }

    @PostMapping
    public Prescription addPrescription(@RequestBody Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    @GetMapping
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }
}
