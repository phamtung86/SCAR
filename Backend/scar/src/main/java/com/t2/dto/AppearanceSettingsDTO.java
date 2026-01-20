package com.t2.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppearanceSettingsDTO {
    private String theme; // light, dark, system
    private String fontSize; // small, medium, large
}
