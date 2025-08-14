package com.t2.service;

import com.t2.dto.ChatMessageDTO;
import com.t2.entity.ChatMessage;
import com.t2.form.Appointment.CreateAppointmentForm;
import com.t2.repository.ChatMessageRepository;
import com.t2.util.AppointmentParser;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Service
public class ChatMessageService implements IChatMessageService {
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    @Autowired
    private IChatRoomService chatRoomService;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private IAppointmentService appointmentService;

    @Override
    public ChatMessage saveChatMessage(ChatMessage chatMessage) {
        var chatId = chatRoomService
                .getChatRoomId(chatMessage.getSender().getId(), chatMessage.getRecipient().getId(), true)
                .orElseThrow(() -> new IllegalArgumentException("Unable to find or create chat room"));
        chatMessage.setChatId(chatId);
        chatMessage.setCreatedAt(new Date());
        chatMessage.setRead(false);
        if (chatMessage.getType().equals(ChatMessage.MessageType.APPOINTMENT)) {
            AppointmentParser.AppointmentData appointmentData = AppointmentParser.parseMessage(chatMessage.getContent());
            CreateAppointmentForm createAppointmentForm = new CreateAppointmentForm(chatMessage.getSender().getId(), chatMessage.getRecipient().getId(), appointmentData.getAppointmentTime(), appointmentData.getContent());
            appointmentService.createAppointment(createAppointmentForm);

        }
        chatMessageRepository.save(chatMessage);
        return chatMessage;
    }

    @Override
    public List<ChatMessage> findChatMessages(Integer senderId, Integer receiverId) {
        var chatId = chatRoomService.getChatRoomId(senderId, receiverId, false);
        return chatId.map(chatMessageRepository::findByChatId).orElse(Collections.emptyList());

    }

    @Override
    public List<ChatMessageDTO> findChatMessagesBySenderAndRecipient(Integer senderId, Integer recipientId, Integer carId) {
        List<ChatMessage> chatMessage = chatMessageRepository.findMessagesBetweenTwoUsers(carId, senderId, recipientId);
        return modelMapper.map(chatMessage, new TypeToken<List<ChatMessageDTO>>() {
        }.getType());
    }

    @Override
    public List<ChatMessageDTO> findChatMessagesByReceiver(Integer receiverId) {
        List<ChatMessage> chatMessages = chatMessageRepository.findByRecipientIdOrderByCreatedAtDesc(receiverId);
        return modelMapper.map(chatMessages, new TypeToken<List<ChatMessageDTO>>() {
        }.getType());
    }

    @Override
    public List<ChatMessage> changeStatusRead(Integer recipientId, Integer senderId, Integer carId, boolean isRead) {
        List<ChatMessage> chatMessages = chatMessageRepository.findMessagesBetweenTwoUsersIsRead(recipientId, senderId, carId, false);
        List<ChatMessage> chatMessagesResponse = new ArrayList<>();
        if (!chatMessages.isEmpty()) {
            for (ChatMessage msg : chatMessages) {
                msg.setRead(true);
                msg.setStatus(ChatMessage.MessageStatus.READ);
                chatMessagesResponse.add(msg);
            }
            chatMessageRepository.saveAll(chatMessages);
        }
        return chatMessagesResponse;
    }

    @Override
    public ChatMessage editMessage(Long id, String message) {
        ChatMessage chatMessage = chatMessageRepository.findById(id).orElse(null);
        if (chatMessage != null) {
            chatMessage.setContent(message);
            chatMessage.setIsEdited(true);
            return chatMessageRepository.save(chatMessage);
        }
        return null;
    }

    @Override
    public ChatMessage deleteMessage(Long id) {
        ChatMessage chatMessage = chatMessageRepository.findById(id).orElse(null);
        if (chatMessage != null) {
            chatMessageRepository.deleteById(id);
            return chatMessage;
        }
        return null;
    }

    @Override
    public boolean hasUnreadMessagesByReceiver(Integer recipientId, Integer senderId, Integer carId, boolean isRead) {
        List<ChatMessage> chatMessages = chatMessageRepository.findByRecipientIdAndSenderIdAndCarIdAndIsRead(recipientId, senderId, carId, false);
        return chatMessages.isEmpty();
    }

    @Override
    public ChatMessage findById(Long id) {
        return chatMessageRepository.findById(id).orElse(null);
    }
}
