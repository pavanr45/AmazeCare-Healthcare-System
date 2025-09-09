package com.amazecare.backend.service;

import com.amazecare.backend.model.Patient;
import com.amazecare.backend.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public Patient createPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public Optional<Patient> getPatientByUsername(String username) {
        return patientRepository.findByUsername(username);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }

    public boolean existsByUsername(String username) {
        return patientRepository.existsByUsername(username);
    }
}
