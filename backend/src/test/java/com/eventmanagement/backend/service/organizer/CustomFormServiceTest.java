package com.eventmanagement.backend.service.organizer;

import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.eventmanagement.backend.constants.FormType;
import com.eventmanagement.backend.dto.request.CustomFormRequestDTO;
import com.eventmanagement.backend.model.CustomForm;
import com.eventmanagement.backend.repository.CustomFormRepository;
import com.eventmanagement.backend.repository.EventRepository;

@ExtendWith(MockitoExtension.class)
public class CustomFormServiceTest {

    @Mock
    private CustomFormRepository customFormRepository;

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private CustomFormService customFormService;

    private UUID eventId;
    private CustomFormRequestDTO requestDTO;
    private CustomForm existingForm;

    @BeforeEach
    void setUp() {
        eventId = UUID.randomUUID();
        
        requestDTO = new CustomFormRequestDTO();
        requestDTO.setFormType(FormType.FEEDBACK); 
        requestDTO.setFormName("Feedback Sự Kiện 2026");
        requestDTO.setFormSchema(new ArrayList<>()); 
        requestDTO.setIsActive(false);
        existingForm = new CustomForm();
        existingForm.setFormId(UUID.randomUUID()); 
        existingForm.setFormName("Form cũ");
        existingForm.setActive(false);
    }

    @Test
    void testSaveCustomForm_CreateNew_Success() {
        when(customFormRepository.findByEvent_EventIdAndFormType(eventId, FormType.FEEDBACK))
                .thenReturn(Optional.empty());      
        when(customFormRepository.save(any(CustomForm.class))).thenAnswer(i -> i.getArguments()[0]);
        CustomForm result = customFormService.saveCustomForm(eventId, requestDTO);
        assertNotNull(result);
        assertEquals("Feedback Sự Kiện 2026", result.getFormName());
        assertEquals(FormType.FEEDBACK, result.getFormType());
        verify(customFormRepository, times(1)).save(any(CustomForm.class));
    }

    @Test
    void testSaveCustomForm_UpdateExisting_Success() {
        when(customFormRepository.findByEvent_EventIdAndFormType(eventId, FormType.FEEDBACK))
                .thenReturn(Optional.of(existingForm));
                
        when(customFormRepository.save(any(CustomForm.class))).thenAnswer(i -> i.getArguments()[0]);
        CustomForm result = customFormService.saveCustomForm(eventId, requestDTO);
        assertNotNull(result);
        assertEquals("Feedback Sự Kiện 2026", result.getFormName()); 
        assertEquals(existingForm.getFormId(), result.getFormId()); 
        verify(customFormRepository, times(1)).save(existingForm);
    }

    @Test
    void testSaveCustomForm_UpdateExisting_ThrowsExceptionWhenActive() {
        existingForm.setActive(true);
        when(customFormRepository.findByEvent_EventIdAndFormType(eventId, FormType.FEEDBACK))
                .thenReturn(Optional.of(existingForm));
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            customFormService.saveCustomForm(eventId, requestDTO);
        });
        assertEquals("Form này đã được Publish. Không thể lưu hoặc chỉnh sửa thêm!", exception.getMessage());
        verify(customFormRepository, never()).save(any(CustomForm.class));
    }


    //Recruitment Form
    @Test
    void testGetFormByType_Found() {

        when(customFormRepository.findByEvent_EventIdAndFormType(eventId, FormType.RECRUITMENT))
                .thenReturn(Optional.of(existingForm));

        CustomForm result = customFormService.getFormByType(eventId, FormType.RECRUITMENT);

        assertNotNull(result);
        assertEquals(existingForm.getFormId(), result.getFormId());
        verify(customFormRepository, times(1)).findByEvent_EventIdAndFormType(eventId, FormType.RECRUITMENT);
    }

    @Test
    void testGetFormByType_NotFound() {
        
        when(customFormRepository.findByEvent_EventIdAndFormType(eventId, FormType.RECRUITMENT))
                .thenReturn(Optional.empty());

        CustomForm result = customFormService.getFormByType(eventId, FormType.RECRUITMENT);

        assertNull(result); 
        verify(customFormRepository, times(1)).findByEvent_EventIdAndFormType(eventId, FormType.RECRUITMENT);
    }    
}