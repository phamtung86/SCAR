package com.t2.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.http.HttpStatus;

@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceResponse {

    private String status;
    private int statusCode;
    private String message;
    private Object data;

    public static ServiceResponse RESPONSE_SUCCESS(Object data) {
        ServiceResponse response = new ServiceResponse();
        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage(ErrorCodes.SUCCESS.message());
        response.setStatus(ErrorCodes.SUCCESS.status());
        response.setData(data);
        return response;
    }

    public static ServiceResponse RESPONSE_SUCCESS(String message, Object data) {
        ServiceResponse response = new ServiceResponse();
        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage(message);
        response.setStatus(ErrorCodes.SUCCESS.status());
        response.setData(data);
        return response;
    }

    public static ServiceResponse RESPONSE_ERROR(Object data) {
        ServiceResponse response = new ServiceResponse();
        response.setStatusCode(HttpStatus.BAD_REQUEST.value());
        response.setMessage(ErrorCodes.BAD_REQUEST.message());
        response.setStatus(ErrorCodes.BAD_REQUEST.status());
        response.setData(data);
        return response;
    }

    public static ServiceResponse RESPONSE_ERROR(String message, Object data) {
        ServiceResponse response = new ServiceResponse();
        response.setStatusCode(HttpStatus.BAD_REQUEST.value());
        response.setMessage(message);
        response.setStatus(ErrorCodes.BAD_REQUEST.status());
        response.setData(data);
        return response;
    }

    public static ServiceResponse RESPONSE_FORBIDDEN(Object data) {
        ServiceResponse response = new ServiceResponse();
        response.setStatusCode(HttpStatus.FORBIDDEN.value());
        response.setMessage(ErrorCodes.FORBIDDEN.message());
        response.setStatus(ErrorCodes.FORBIDDEN.status());
        response.setData(data);
        return response;
    }
}
