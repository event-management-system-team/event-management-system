package com.eventmanagement.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "event_agendas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventAgenda {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "agenda_id", updatable = false, nullable = false)
    private UUID agendaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    private String location;

    @Column(name = "order_index")
    private Integer orderIndex;
}
