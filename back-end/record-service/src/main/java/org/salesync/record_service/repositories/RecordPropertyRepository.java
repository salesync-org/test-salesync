package org.salesync.record_service.repositories;

import org.salesync.record_service.entities.RecordTypeProperty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RecordPropertyRepository extends JpaRepository<RecordTypeProperty, UUID> {
}
