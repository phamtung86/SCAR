package com.t2.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtRequestModel implements Serializable {
    private static final long serialVersionUID = 2636936156391265891L;
    private String username;
    private String password;

}
