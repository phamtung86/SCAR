package com.t2.models;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EnumResponse {
    private String value;
    private String label;
}
