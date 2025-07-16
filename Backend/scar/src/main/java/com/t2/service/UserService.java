package com.t2.service;

import com.t2.dto.CarDTO;
import com.t2.dto.ChatMessageDTO;
import com.t2.dto.UserDTO;
import com.t2.entity.User;
import com.t2.form.CreateUserForm;
import com.t2.form.UpdateProfileForm;
import com.t2.form.UploadImageForm;
import com.t2.models.CarResponse;
import com.t2.models.UserResponse;
import com.t2.repository.UserRepository;
import com.t2.util.ImageUtils;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserRepository repository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private ImageUtils imageUtils;
    @Autowired
    private IChatMessageService iChatMessageService;
    @Autowired
    private IUserReviewService iUserReviewService;

    @Override
    public User findUserByUsername(String username) {
        return repository.findByUsername(username);
    }


    @Override
    public void createUser(CreateUserForm createUserForm) {
        User user = modelMapper.map(createUserForm, User.class);
        if (user != null) {
            user.setProfilePicture("https://res.cloudinary.com/dspqk9rl9/image/upload/v1737165699/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL_dkutwd.jpg");
            user.setRole(User.Role.USER);
            user.setStatus("ACTIVE");
            user.setRank(User.Rank.NORMAL);
            user.setPassword(passwordEncoder.encode(createUserForm.getPassword()));
            repository.save(user);
        }
    }

    @Override
    public UserDTO findUserDTOById(Integer id) {
        User user = repository.findById(id).orElse(null);
        if (user != null) {
            return modelMapper.map(user, UserDTO.class);
        }
        return null;
    }

    @Override
    public boolean isExistEmail(String email) {
        return repository.existsByEmail(email);
    }

    @Override
    public boolean isExistUsername(String username) {
        return repository.existsByUsername(username);
    }

    @Override
    public User findUserById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public boolean updateUser(UpdateProfileForm updateProfileForm) throws IOException {
        User user = findUserById(updateProfileForm.getId());
        try {
            // Nếu có ảnh mới
            if (updateProfileForm.getProfilePicture() != null) {

                // Nếu user đã có ảnh cũ thì xóa trước
                if (user.getProfilePicture() != null && !user.getProfilePicture().isEmpty()) {
                    String oldPublicId = user.getPicturePublicId();
                    if (oldPublicId != null) {
                        imageUtils.deleteFile(oldPublicId);
                    }
                }
                // Upload ảnh mới
                UploadImageForm uploadImageForm = imageUtils.uploadFile(updateProfileForm.getProfilePicture());
                user.setProfilePicture(uploadImageForm.getUrl());
                user.setPicturePublicId(uploadImageForm.getPublicId());
            }

            // Update các thông tin còn lại
            user.setFirstName(updateProfileForm.getFirstName());
            user.setLastName(updateProfileForm.getLastName());
            user.setEmail(updateProfileForm.getEmail());

            repository.save(user);
            return true;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public void updateStatusUser(Integer userId, String status) {
        User u = repository.findById(userId).orElse(null);
        if (u != null){
            u.setStatus(status);
            u.setUpdateAt(new Date());
            repository.save(u);
        }
    }

    @Override
    public List<UserDTO> findUserByStaus(String status) {
        List<User> users = repository.findByStatus(status);

        return modelMapper.map(users, new TypeToken<List<UserDTO>>(){}.getType());
    }

    @Override
    public List<Map<String, Object>> findUserChatted(Integer receiver) {
        List<ChatMessageDTO> chatMessageDTOS = iChatMessageService.findChatMessagesByReceiver(receiver);
        Set<String> seen = new HashSet<>();
        List<Map<String, Object>> result = new ArrayList<>();

        for (ChatMessageDTO c : chatMessageDTOS) {
            UserDTO sender = c.getSender();
            CarDTO car = c.getCar();
            String key = sender.getId() + "-" + car.getId();

            if (!seen.contains(key)) {
                seen.add(key);
                UserResponse userResponse = modelMapper.map(sender, UserResponse.class);
                CarResponse carResponse = modelMapper.map(car, CarResponse.class);

                Double rate = iUserReviewService.calculateRateByUserId(userResponse.getId());
                userResponse.setRating(rate);

                Map<String, Object> map = new HashMap<>();
                map.put("sender", userResponse);
                map.put("car", carResponse);

                result.add(map);
            }
        }

        return result;
    }

}
