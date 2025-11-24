package com.t2.controller;

import com.t2.dto.UserDTO;
import com.t2.form.User.UpdateProfileForm;
import com.t2.models.UserResponse;
import com.t2.service.IUserReviewService;
import com.t2.service.IUserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/v1/users")
@Validated
public class UserController {

    @Autowired
    private IUserService userService;
    @Autowired
    private IUserReviewService iUserReviewService;
    @Autowired
    private ModelMapper modelMapper;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Integer id) {
        UserDTO userDTO = userService.findUserDTOById(id);
        UserResponse userResponse = modelMapper.map(userDTO, UserResponse.class);
        userResponse.setRating(iUserReviewService.calculateRateByUserId(id));
        if (userDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@ModelAttribute UpdateProfileForm updateProfileForm, @PathVariable(name = "id") Integer id) throws IOException {
        updateProfileForm.setId(id);
        boolean isUpdate = userService.updateUser(updateProfileForm);
        return isUpdate ? ResponseEntity.ok().build() : ResponseEntity.status(500).body("Edit profile failed");
    }

    @MessageMapping("/user-status/online")
    @SendTo("/topic/status")
    public List<UserDTO> updateUserStatusOnline(Integer id) {
        try {
            userService.updateStatusUser(id, "ONLINE");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return userService.findUserByStaus("ONLINE");
    }

    @MessageMapping("/user-status/offline")
    @SendTo("/topic/status")
    public List<UserDTO> updateUserStatusOffline(Integer id) {
        try {
            userService.updateStatusUser(id, "OFFLINE");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return userService.findUserByStaus("ONLINE");
    }

    @GetMapping("/chatted/{userId}")
    public List<Map<String, Object>> findUserChatted(
            @PathVariable(name = "userId") Integer userId) {
        return userService.findUserChatted(userId);
    }

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        return principal.getAttributes();
    }

    @PutMapping("/{id}/upgrade-rank")
    public void upgradeRankUser(@PathVariable(name = "id") Integer id, @RequestBody String rank) {
        userService.upgradeRankUser(id, rank);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserDTO>> getAllByRole(@PathVariable(name = "role") String role){
        List<UserDTO> userDTOS = userService.findByRole(role);
        return ResponseEntity.status(200).body(userDTOS);
    }

    @GetMapping("/account-status/{accountStatus}")
    public ResponseEntity<List<UserDTO>> getAllByAccountStatus(@PathVariable(name = "accountStatus") String accountStatus){
        List<UserDTO> userDTOS = userService.findByRole(accountStatus);
        return ResponseEntity.status(200).body(userDTOS);
    }

    @PutMapping("/{id}/change-account-status")
    public void updateAccountStatus(@PathVariable(name = "id") Integer id, @RequestParam(value = "accountStatus") String status){
        userService.changeAccountStatusUser(id, status);
    }

}
