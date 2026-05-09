package com.boilerplate.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProfileUpdateRequest {

    @NotBlank
    private String firstname;

    @NotBlank
    private String lastname;

    private String avatarUrl;
}
