package com.amazecare.backend.service;

import com.amazecare.backend.model.MedicalRecord;
import com.amazecare.backend.repository.MedicalRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    public MedicalRecord addMedicalRecord(MedicalRecord record) {
        return medicalRecordRepository.save(record);
    }

    public List<MedicalRecord> getAllRecords() {	
        return medicalRecordRepository.findAll();
    }

    public Optional<MedicalRecord> getRecordById(Long id) {
        return medicalRecordRepository.findById(id);
    }

    public List<MedicalRecord> getRecordsByAppointmentId(Long appointmentId) {
        return medicalRecordRepository.findByAppointmentId(appointmentId);
    }
}
