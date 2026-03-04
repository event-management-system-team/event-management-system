package com.eventmanagement.backend.repository;

import com.eventmanagement.backend.model.EventStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventStaffRepository extends JpaRepository<EventStaff, UUID> {
    @Query("SELECT es FROM EventStaff es JOIN FETCH es.user JOIN FETCH es.event " +
            "WHERE es.event.eventSlug = :eventSlug AND es.user.userId = :userId")
    Optional<EventStaff> findWorkspaceAccess(@Param("eventSlug") String eventSlug, @Param("userId") UUID userId);
}
