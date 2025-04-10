package com.t2.config.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {

    @NonNull
    private String message;

    @NonNull
    private String detailMessage;

    private Object error;

    @NonNull
    private Integer code;

    @NonNull
    private String moreInformation;
}
