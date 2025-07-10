package com.t2.exception;

public class AlreadyExistException extends RuntimeException {
    public AlreadyExistException(String messgae) {
        super(messgae);
    }
}
