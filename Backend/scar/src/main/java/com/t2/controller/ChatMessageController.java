package com.t2.controller;

import com.t2.dto.CarDTO;
import com.t2.dto.ChatMessageDTO;
import com.t2.dto.ChatRoomDTO;
import com.t2.dto.UserDTO;
import com.t2.entity.ChatMessage;
import com.t2.entity.ChatNotification;
import com.t2.form.ChatMessage.ChatMessageCRUDForm;
import com.t2.form.ChatMessage.ChatMessageForm;
import com.t2.service.ICarService;
import com.t2.service.IChatMessageService;
import com.t2.service.IUserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    @Transactional
    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessageForm chatMessageForm) {
        ChatMessage chatMessage = modelMapper.map(chatMessageForm, ChatMessage.class);

        // Lưu tin nhắn vào cơ sở dữ liệu
        ChatMessage saveMsg = chatMessageService.saveChatMessage(chatMessage);
        UserDTO sender = userService.findUserDTOById(chatMessage.getSender().getId());
        UserDTO recipient = userService.findUserDTOById(chatMessage.getRecipient().getId());

        ChatRoomDTO chatRoomDTO = Optional.ofNullable(saveMsg.getChatRoom())
                .map(room -> modelMapper.map(room, ChatRoomDTO.class)).orElse(null);

        CarDTO carDTO = modelMapper.map(iCarService.getCarById(saveMsg.getCar().getId()), CarDTO.class);

        simpMessagingTemplate.convertAndSendToUser(
                chatMessage.getRecipient().getId().toString(),
//                "/car/" + chatMessageForm.getCarId() +
                        "/queue/messages",
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

    @PutMapping("/change-status-read")
    public void changeStatusRead(@RequestBody ChatMessageCRUDForm chatMessageCRUDForm) {

        chatMessageService.changeStatusRead(
                chatMessageCRUDForm.getRecipientId(),
                chatMessageCRUDForm.getSenderId(),
                chatMessageCRUDForm.getCarId(),
                true
        );

//        List<ChatMessage> updatedMessages = chatMessageService.changeStatusRead(
//                chatMessageCRUDForm.getRecipientId(),
//                chatMessageCRUDForm.getSenderId(),
//                chatMessageCRUDForm.getCarId(),
//                true
//        );
//
//        UserDTO sender = userService.findUserDTOById(chatMessageCRUDForm.getSenderId());
//        UserDTO recipient = userService.findUserDTOById(chatMessageCRUDForm.getRecipientId());
//        CarDTO carDTO = modelMapper.map(iCarService.getCarById(chatMessageCRUDForm.getCarId()), CarDTO.class);
//
//        for (ChatMessage saveMsg : updatedMessages) {
//            ChatRoomDTO chatRoomDTO = Optional.ofNullable(saveMsg.getChatRoom())
//                    .map(room -> modelMapper.map(room, ChatRoomDTO.class))
//                    .orElse(null);
//
//            ChatNotification notification = new ChatNotification(
//                    saveMsg.getId(),
//                    chatRoomDTO,
//                    saveMsg.getChatId(),
//                    sender,
//                    recipient,
//                    saveMsg.getContent(),
//                    saveMsg.getCreatedAt(),
//                    saveMsg.getUpdateAt(),
//                    carDTO,
//                    saveMsg.getType().toString(),
//                    true // Trạng thái đã đọc
//            );
//
//            simpMessagingTemplate.convertAndSendToUser(
//                    sender.getId().toString(),
//                    "/queue/messages",
//                    notification
//            );
//        }
    }
}
