package com.t2.controller;


import com.t2.exception.AlreadyExistException;
import com.t2.modal.User;
import com.t2.response.ApiResponse;
import com.t2.service.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

@RestController
@RequestMapping("${default.api}/User")
public class UserController {
    @Autowired
    private UserService userService;
    @PostMapping("/user")
    public ResponseEntity<ApiResponse> createUser(@RequestBody User createUser){
        try {
            userService.createUser(createUser);
            return ResponseEntity.ok(new ApiResponse("Successfull",createUser));
        } catch (AlreadyExistException e) {
            return ResponseEntity.unprocessableEntity().body(new ApiResponse(e.getMessage(),null));
        }
    }
}
