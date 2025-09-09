package com.amazecare.backend.repository;

import com.amazecare.backend.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    boolean existsByUsername(String username);
    Optional<Patient> findByUsername(String username);

    // ✅ Add this method to fix your login error
    Patient findByUsernameAndPassword(String username, String password);
}
