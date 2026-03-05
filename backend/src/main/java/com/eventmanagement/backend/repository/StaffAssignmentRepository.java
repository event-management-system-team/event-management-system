package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.StaffAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface  StaffAssignmentRepository extends JpaRepository<StaffAssignment, UUID> {

}
