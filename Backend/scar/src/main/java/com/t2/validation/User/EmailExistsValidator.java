package com.t2.validation.User;

import com.t2.service.IUserService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;


public class EmailExistsValidator implements ConstraintValidator<EmailExists, String> {

    @Autowired
    private IUserService userService;

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (StringUtils.isEmpty(value)) {
            return true;
        }

        return !userService.isExistEmail(value);
    }

}
