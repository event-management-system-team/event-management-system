package com.eventmanagement.backend.service;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.eventmanagement.backend.dto.response.FeedbackResponseDTO;
import com.eventmanagement.backend.repository.FeedbackRepository;

@ExtendWith(MockitoExtension.class)
public class FeedbackServiceTest {

    @Mock
    private FeedbackRepository feedbackRepository;

    @InjectMocks
    private FeedbackService feedbackService;

    private UUID mockEventId;

    @BeforeEach
    void setUp() {
        mockEventId = UUID.randomUUID(); // Tạo ID ngẫu nhiên chuẩn UUID
    }

    @Test

    @DisplayName("Nên trả về danh sách FeedbackResponseDTO thành công khi ID đúng")
    void testGetFeedbacksByEvent_Success() {
        FeedbackResponseDTO mockF1 = mock(FeedbackResponseDTO.class);
        FeedbackResponseDTO mockF2 = mock(FeedbackResponseDTO.class);
        // GIVEN
        when(mockF1.getRating()).thenReturn(5);
    when(mockF1.getComment()).thenReturn("Sự kiện rất tuyệt!");
        when(mockF2.getRating()).thenReturn(4);
    when(mockF2.getComment()).thenReturn("Khá tốt");
        when(feedbackRepository.findFeedbacksByEventId(mockEventId)).thenReturn(Arrays.asList(mockF1, mockF2));

        // WHEN
        // Truyền UUID vào hàm xử lý
        List<FeedbackResponseDTO> result = feedbackService.getFeedbacksByEvent(mockEventId);

        // THEN
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(feedbackRepository, times(1)).findFeedbacksByEventId(mockEventId);
    }
}