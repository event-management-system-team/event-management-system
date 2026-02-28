package com.eventmanagement.backend.util;

import org.springframework.stereotype.Component;

@Component
public class GenerateAvatarUrl {
    public String generateAvatarUrl(String fullName) {
        String encodedName = fullName.replace(" ", "+");
        return "https://ui-avatars.com/api/?name=" + encodedName +
                "&background=random&size=200";
    }
}
