package com.eventmanagement.backend.repository;
import com.eventmanagement.backend.model.EventStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface EventStaffRepository extends JpaRepository<EventStaff, UUID> {
    // Kiểm tra xem User đã là Staff của Event này chưa
    boolean existsByEvent_EventIdAndUser_UserId(UUID eventId, UUID userId);
}