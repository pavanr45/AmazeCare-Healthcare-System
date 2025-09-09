// MedicalRecordController.java
package com.amazecare.backend.controller;

import com.amazecare.backend.model.MedicalRecord;
import com.amazecare.backend.repository.MedicalRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/MedicalRecord")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordRepository recordRepository;

    @PostMapping("/AddMedicalRecord")
    public MedicalRecord addRecord(@RequestBody MedicalRecord record) {
        return recordRepository.save(record);
    }

    @GetMapping("/ViewAllMedicalRecords")
    public List<MedicalRecord> getAllRecords() {
        return recordRepository.findAll();
    }

    @GetMapping("/ViewMedicalRecordByAppointmentId")
    public List<MedicalRecord> getByAppointmentId(@RequestParam Long Id) {
        return recordRepository.findByAppointmentId(Id);
    }
}
