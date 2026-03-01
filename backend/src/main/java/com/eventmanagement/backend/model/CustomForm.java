package com.eventmanagement.backend.model;

import com.eventmanagement.backend.constants.FormType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "custom_forms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomForm {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "form_id", nullable = false, updatable = false)
    private UUID formId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @Column(name = "form_name")
    private String formName;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "form_type")
    private FormType formType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "form_schema", columnDefinition = "jsonb")
    private List<Map<String, Object>> formSchema;

    @Column(name = "is_active")
    private boolean isActive;
}