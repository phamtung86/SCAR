package com.t2.util;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
public class DateRange {
    private LocalDate start;
    private LocalDate end;
}