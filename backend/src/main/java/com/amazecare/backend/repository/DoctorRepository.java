package com.amazecare.backend.repository;

import com.amazecare.backend.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    @Query("SELECT DISTINCT d.speciality FROM Doctor d")
    List<String> findAllSpecialities();

    Doctor findByUsernameAndPassword(String username, String password);

    Optional<Doctor> findByUsername(String username);
}
