package com.t2.service;

import com.t2.dto.UserDTO;
import com.t2.entity.ChatRoom;
import com.t2.entity.User;
import com.t2.repository.ChatRoomRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ChatRoomService implements IChatRoomService {
	@Autowired
	private ChatRoomRepository chatRoomRepository;

	@Lazy
	@Autowired
	private UserService userService;
	@Autowired
	private ModelMapper modelMapper;

	@Override
	public Optional<String> getChatRoomId(Integer senderId, Integer receiverId, boolean createIfNotExist) {
		if (senderId == null || receiverId == null) {
			throw new IllegalArgumentException("Sender ID and Receiver ID must not be null");
		}
		UserDTO senderDto = userService.findUserDTOById(senderId);
		UserDTO receiverDto = userService.findUserDTOById(receiverId);

		if (senderDto == null || receiverDto == null) {
			throw new IllegalArgumentException("Sender or receiver not found");
		}
		User sender = modelMapper.map(senderDto, User.class);
		User receiver = modelMapper.map(receiverDto, User.class);
		try {
			return chatRoomRepository.findChatRoomBySenderAndRecipient(sender, receiver).map(ChatRoom::getChatId)
					.or(() -> {
						if (createIfNotExist) {
							var chatId = createChatId(senderId, receiverId);
							return Optional.of(chatId);
						}
						return Optional.empty();
					});
		} catch (Exception e) {
			return Optional.empty();
		}
	}

	@Override
	public String createChatId(Integer senderId, Integer receiverId) {
		UserDTO senderDto = userService.findUserDTOById(senderId);
		UserDTO receiverDto = userService.findUserDTOById(receiverId);
		User sender = modelMapper.map(senderDto, User.class);
		User receiver = modelMapper.map(receiverDto, User.class);

		var chatId = String.format("%d_%d", sender.getId(), receiver.getId());

		ChatRoom senderRecipient = ChatRoom.builder().chatId(chatId).sender(sender).recipient(receiver).build();

		ChatRoom recipientSender = ChatRoom.builder().chatId(chatId).sender(receiver).recipient(sender).build();

		chatRoomRepository.save(senderRecipient);
		chatRoomRepository.save(recipientSender);

		return chatId;
	}
}
