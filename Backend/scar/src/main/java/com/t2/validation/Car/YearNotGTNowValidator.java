package com.t2.validation.Car;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;

public class YearNotGTNowValidator implements ConstraintValidator<YearNotGTNow, Integer> {

    LocalDate date = LocalDate.now();

    @Override
    public boolean isValid(Integer year, ConstraintValidatorContext context) {
        return year < date.getYear();
    }
}
