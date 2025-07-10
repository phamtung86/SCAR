package com.t2.models;

import com.t2.dto.UserDTO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse extends UserDTO {

    private Double rating;

}
