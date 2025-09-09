package com.amazecare.backend.repository;

import com.amazecare.backend.model.Prescription;
import com.amazecare.backend.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByMedicalRecord(MedicalRecord medicalRecord);  // ✅ This matches your entity
    List<Prescription> findByMedicalRecord_RecordId(Long recordId);
}
