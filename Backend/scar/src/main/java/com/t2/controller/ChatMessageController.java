package com.t2.controller;

import com.t2.dto.CarDTO;
import com.t2.dto.ChatMessageDTO;
import com.t2.dto.ChatRoomDTO;
import com.t2.dto.UserDTO;
import com.t2.entity.ChatMessage;
import com.t2.entity.ChatNotification;
import com.t2.form.ChatMessage.ChatMessageCRUDForm;
import com.t2.form.ChatMessage.ChatMessageForm;
import com.t2.form.ChatMessage.DeleteChatMessageForm;
import com.t2.form.ChatMessage.EditChatMessageForm;
import com.t2.form.UploadImageForm;
import com.t2.service.ICarService;
import com.t2.service.IChatMessageService;
import com.t2.service.IUserService;
import com.t2.util.ImageUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/chat-messages")
public class ChatMessageController {

    @Autowired
    private IChatMessageService chatMessageService;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private IUserService userService;
    @Autowired
    private ICarService iCarService;
    @Autowired
    private ImageUtils imageUtils;

    @Transactional
    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessageForm chatMessageForm) {
        try {
            ChatMessage baseMessage = modelMapper.map(chatMessageForm, ChatMessage.class);
            UserDTO sender = userService.findUserDTOById(baseMessage.getSender().getId());
            UserDTO recipient = userService.findUserDTOById(baseMessage.getRecipient().getId());
            CarDTO carDTO = modelMapper.map(iCarService.getCarById(baseMessage.getCar().getId()), CarDTO.class);
            if (chatMessageForm.getParentChatId() != null){
                ChatMessage chatMessage = chatMessageService.findById(Long.valueOf(chatMessageForm.getParentChatId()));
                baseMessage.setParentChat(chatMessage);
            }

            List<UploadImageForm> images = chatMessageForm.getFiles();
            if (images != null && !images.isEmpty()) {
                for (UploadImageForm imgUrl : images) {
                    ChatMessage message = new ChatMessage();
                    BeanUtils.copyProperties(baseMessage, message);
                    message.setContent(imgUrl.getUrl());
                    message.setContentImageId(imgUrl.getPublicId());
                    ChatMessage saveMsg = chatMessageService.saveChatMessage(message);
                    sendMessageToRecipient(saveMsg, sender, recipient, carDTO, "/queue/messages");
                }
            } else {
                ChatMessage saveMsg = chatMessageService.saveChatMessage(baseMessage);
                sendMessageToRecipient(saveMsg, sender, recipient, carDTO, "/queue/messages");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void sendMessageToRecipient(ChatMessage saveMsg, UserDTO sender, UserDTO recipient, CarDTO carDTO, String destination) {
        ChatRoomDTO chatRoomDTO = Optional.ofNullable(saveMsg.getChatRoom())
                .map(room -> modelMapper.map(room, ChatRoomDTO.class)).orElse(null);

        simpMessagingTemplate.convertAndSendToUser(
                recipient.getId().toString(),
                destination,
                new ChatNotification(
                        saveMsg.getId(),
                        chatRoomDTO,
                        saveMsg.getChatId(),
                        sender,
                        recipient,
                        saveMsg.getContent(),
                        saveMsg.getCreatedAt(),
                        saveMsg.getUpdateAt(),
                        carDTO,
                        saveMsg.getType().toString(),
                        saveMsg.isRead()
                )
        );
    }


    @PostMapping("/chat")
    public ResponseEntity<?> saveMessage(@RequestBody ChatMessageForm chatMessageForm) {
        ChatMessage chatMessage = modelMapper.map(chatMessageForm, ChatMessage.class);

        // Lưu tin nhắn vào cơ sở dữ liệu
        ChatMessage saveMsg = chatMessageService.saveChatMessage(chatMessage);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/sender/{senderId}/recipient/{recipientId}/car/{carId}")
    public List<ChatMessageDTO> findChatMessagesBySenderAndRecipient(@PathVariable(name = "senderId") Integer senderId,
                                                                     @PathVariable(name = "recipientId") Integer recipientId,
                                                                     @PathVariable(name = "carId") Integer carId
    ) {
        return chatMessageService.findChatMessagesBySenderAndRecipient(senderId, recipientId, carId);
    }

    @GetMapping("/recipient/{recipientId}")
    public List<ChatMessageDTO> findChatMessagesBySenderAndRecipient(
            @PathVariable(name = "recipientId") Integer recipientId) {
        return chatMessageService.findChatMessagesByReceiver(recipientId);
    }

    private void sendListMessageToRecipient(List<ChatMessage> messages, UserDTO sender, UserDTO recipient, CarDTO carDTO) {
        if (messages == null || messages.isEmpty()) return;

        ChatRoomDTO chatRoomDTO = Optional.ofNullable(messages.get(0).getChatRoom())
                .map(room -> modelMapper.map(room, ChatRoomDTO.class)).orElse(null);

        List<ChatNotification> notifications = messages.stream().map(msg ->
                new ChatNotification(
                        msg.getId(),
                        chatRoomDTO,
                        msg.getChatId(),
                        sender,
                        recipient,
                        msg.getContent(),
                        msg.getCreatedAt(),
                        msg.getUpdateAt(),
                        carDTO,
                        msg.getType().toString(),
                        msg.isRead()
                )
        ).toList();

        simpMessagingTemplate.convertAndSendToUser(
                recipient.getId().toString(),
                "/queue/seen",
                notifications // Gửi list
        );
    }


    @Transactional
    @MessageMapping("/seen")
    public void markMessagesAsRead(@Payload ChatMessageCRUDForm form) {
        UserDTO sender = userService.findUserDTOById(form.getSenderId());
        UserDTO recipient = userService.findUserDTOById(form.getRecipientId());
        CarDTO carDTO = modelMapper.map(iCarService.getCarById(form.getCarId()), CarDTO.class);

        List<ChatMessage> updatedMessages = chatMessageService.changeStatusRead(
                form.getRecipientId(),
                form.getSenderId(),
                form.getCarId(),
                true
        );

        sendListMessageToRecipient(updatedMessages, sender, recipient, carDTO);
    }

    @Transactional
    @MessageMapping("/edit")
    public void editChatMessage(@Payload EditChatMessageForm editChatMessageForm) {

        UserDTO sender = userService.findUserDTOById(editChatMessageForm.getSenderId());
        UserDTO recipient = userService.findUserDTOById(editChatMessageForm.getRecipientId());
        CarDTO carDTO = modelMapper.map(iCarService.getCarById(editChatMessageForm.getCarId()), CarDTO.class);
        ChatMessage chatMessage = chatMessageService.editMessage(editChatMessageForm.getId(), editChatMessageForm.getMessage());
        sendMessageToRecipient(chatMessage, sender, recipient, carDTO,"/queue/edit");
    }

    @Transactional
    @MessageMapping("/delete")
    public void delete(@Payload DeleteChatMessageForm deleteChatMessageForm) {

        UserDTO sender = userService.findUserDTOById(deleteChatMessageForm.getSenderId());
        UserDTO recipient = userService.findUserDTOById(deleteChatMessageForm.getRecipientId());
        CarDTO carDTO = modelMapper.map(iCarService.getCarById(deleteChatMessageForm.getCarId()), CarDTO.class);
        ChatMessage chatMessage = chatMessageService.deleteMessage(deleteChatMessageForm.getId());
        sendMessageToRecipient(chatMessage, sender, recipient, carDTO,"/queue/delete");
    }

}


