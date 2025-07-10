package com.t2.mapper;

import com.t2.dto.UserDTO;
import com.t2.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toDTO(User user);
}
