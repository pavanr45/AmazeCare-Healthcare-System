package com.amazecare.backend.repository;

import com.amazecare.backend.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByAppointmentId(Long appointmentId);
}
