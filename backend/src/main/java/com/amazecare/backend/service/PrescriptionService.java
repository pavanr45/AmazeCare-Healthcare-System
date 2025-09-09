package com.amazecare.backend.service;

import com.amazecare.backend.model.Prescription;
import com.amazecare.backend.model.MedicalRecord;
import com.amazecare.backend.repository.PrescriptionRepository;
import com.amazecare.backend.repository.MedicalRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    public Prescription addPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public Optional<Prescription> getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id);
    }

    public List<Prescription> getPrescriptionsByRecordId(Long recordId) {
        return medicalRecordRepository.findById(recordId)
                .map(record -> prescriptionRepository.findByMedicalRecord(record))
                .orElse(new ArrayList<>());
    }

    public Prescription updatePrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    public void deletePrescription(Long id) {
        prescriptionRepository.deleteById(id);
    }
}
