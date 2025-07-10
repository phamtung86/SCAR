package com.t2.validation.Car;


import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import static java.lang.annotation.ElementType. *;

import java.lang.annotation.Documented;
import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Target;

@Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE})
@Retention(RUNTIME)
@Documented
@Constraint(validatedBy = {YearNotGTNowValidator.class})
@Repeatable(YearNotGTNow.List.class)
public @interface YearNotGTNow {
    String message = "{Car.createCar.form.year.gt}";
    Class<?>[] groups() default {};

    Class<? extends Payload> [] payload() default {};
    @Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
    @Retention(RUNTIME)
    @Documented
    @interface List {
        YearNotGTNow[] value();
    }


}
