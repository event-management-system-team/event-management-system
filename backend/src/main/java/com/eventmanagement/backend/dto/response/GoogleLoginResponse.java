package com.eventmanagement.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GoogleLoginResponse {

    private String sub;

    private String email;

    private String name;

    private String picture;

    @JsonProperty("email_verified")
    private Boolean emailVerified;

    @JsonProperty("given_name")
    private String givenName;

    @JsonProperty("family_name")
    private String familyName;

    private String locale;
}