package com.eventmanagement.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "check_ins")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "checkin_id", updatable = false, nullable = false)
    private UUID checkinId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", referencedColumnName = "ticket_id")
    private Ticket ticket;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    private User staff;

    @Column(name = "checkin_time", updatable = false)
    private LocalDateTime checkinTime;



    @PrePersist
    protected void onCreate() {
        if (this.checkinTime == null) {
            this.checkinTime = LocalDateTime.now();
        }
    }
}