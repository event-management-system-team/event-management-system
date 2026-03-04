package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.StaffAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StaffAssignmentRepository extends JpaRepository<StaffAssignment, UUID> {
    @Query("SELECT a FROM StaffAssignment a JOIN FETCH a.schedule " +
            "WHERE a.eventStaff.eventStaffId = :eventStaffId " +
            "ORDER BY a.schedule.startTime ASC")
    List<StaffAssignment> findAssignmentsByStaffId(@Param("eventStaffId") UUID eventStaffId);
}