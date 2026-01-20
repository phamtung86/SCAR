package com.t2.controller;

import com.t2.common.ServiceResponse;
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
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PreAuthorize("hasAuthority('USER_READ')")
    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponse> getUserById(@PathVariable Integer id) {
        UserDTO userDTO = userService.findUserDTOById(id);
        if (userDTO == null) {
            return ResponseEntity.ok(ServiceResponse.RESPONSE_ERROR("User not found", null));
        }
        UserResponse userResponse = modelMapper.map(userDTO, UserResponse.class);
        userResponse.setRating(iUserReviewService.calculateRateByUserId(id));
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(userResponse));
    }

    @PreAuthorize("hasAuthority('USER_UPDATE') and @securityExpr.isSelfOrAdmin(#id)")
    @PutMapping("/{id}")
    public ResponseEntity<ServiceResponse> updateUser(@ModelAttribute UpdateProfileForm updateProfileForm,
            @PathVariable(name = "id") Integer id) throws IOException {
        updateProfileForm.setId(id);
        boolean isUpdate = userService.updateUser(updateProfileForm);
        return isUpdate
                ? ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS("Updated profile successfully", null))
                : ResponseEntity.ok(ServiceResponse.RESPONSE_ERROR("Edit profile failed", null));
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

    // Yêu cầu quyền CHAT_READ để xem danh sách user đã chat
    @PreAuthorize("hasAuthority('CHAT_READ')")
    @GetMapping("/chatted/{userId}")
    public ResponseEntity<ServiceResponse> findUserChatted(
            @PathVariable(name = "userId") Integer userId) {
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(userService.findUserChatted(userId)));
    }

    @GetMapping("/me")
    public ResponseEntity<ServiceResponse> getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(principal.getAttributes()));
    }

    // Yêu cầu quyền USER_UPDATE để nâng cấp rank và phải là owner hoặc admin
    @PreAuthorize("hasAuthority('USER_UPDATE') and @securityExpr.isSelfOrAdmin(#id)")
    @PutMapping("/{id}/upgrade-rank")
    public ResponseEntity<ServiceResponse> upgradeRankUser(@PathVariable(name = "id") Integer id,
            @RequestBody String rank) {
        userService.upgradeRankUser(id, rank);
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS("Rank upgraded", null));
    }

    // Yêu cầu quyền USER_MANAGE để xem user theo role (chỉ ADMIN)
    @PreAuthorize("hasAuthority('USER_MANAGE')")
    @GetMapping("/role/{role}")
    public ResponseEntity<ServiceResponse> getAllByRole(@PathVariable(name = "role") String role) {
        List<UserDTO> userDTOS = userService.findByRole(role);
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(userDTOS));
    }

    // Yêu cầu quyền USER_MANAGE để xem user theo account status (chỉ ADMIN)
    @PreAuthorize("hasAuthority('USER_MANAGE')")
    @GetMapping("/account-status/{accountStatus}")
    public ResponseEntity<ServiceResponse> getAllByAccountStatus(
            @PathVariable(name = "accountStatus") String accountStatus) {
        List<UserDTO> userDTOS = userService.findByRole(accountStatus);
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS(userDTOS));
    }

    // Yêu cầu quyền USER_LOCK để khóa/mở khóa tài khoản (ADMIN/MODERATOR)
    @PreAuthorize("hasAuthority('USER_LOCK')")
    @PutMapping("/{id}/change-account-status")
    public ResponseEntity<ServiceResponse> updateAccountStatus(@PathVariable(name = "id") Integer id,
            @RequestParam(value = "accountStatus") String status) {
        userService.changeAccountStatusUser(id, status);
        return ResponseEntity.ok(ServiceResponse.RESPONSE_SUCCESS("Account status updated", null));
    }

}
