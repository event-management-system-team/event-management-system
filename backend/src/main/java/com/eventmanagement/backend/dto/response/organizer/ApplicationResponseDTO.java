package com.eventmanagement.backend.dto.response.organizer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponseDTO {
    private UUID id;
    //user
    private String name;
    private String email;
    private String phone;
    private String avatar;
    //recruitment
    private String position;
    //application
    private String cvUrl;
    private Map<String, Object> customAnswers;
    private List<Map<String, Object>> formSchema; // schema để map question ID → label
    private String status; 
    private Map<String, Object> applicationData;
    // dinh dang lai ngay gio
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime appliedAt; 
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime reviewedAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;  
}