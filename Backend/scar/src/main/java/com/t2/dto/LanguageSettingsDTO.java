package com.t2.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LanguageSettingsDTO {
    private String language; // vi, en
    private String timezone;
}
