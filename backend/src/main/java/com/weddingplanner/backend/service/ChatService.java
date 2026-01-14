package com.weddingplanner.backend.service;

import com.weddingplanner.backend.model.ChatRoom;
import com.weddingplanner.backend.model.Message;
import com.weddingplanner.backend.model.User;
import com.weddingplanner.backend.repository.ChatRoomRepository;
import com.weddingplanner.backend.repository.MessageRepository;
import com.weddingplanner.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    public Message saveMessage(Long chatRoomId, Long senderId, String content) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new RuntimeException("Chat room not found"));

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Message message = Message.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .content(content)
                .build();

        return messageRepository.save(message);
    }

    public List<Message> getChatHistory(Long chatRoomId) {
        return messageRepository.findByChatRoomIdOrderByTimestampAsc(chatRoomId);
    }

    public ChatRoom getOrCreateChatRoom(Long bookingId) {
        return chatRoomRepository.findByBookingId(bookingId)
                .orElseGet(() -> {
                    // This logic would ideally be triggered when a booking is CONFIRMED
                    // For now, we'll implement a fallback if needed
                    return null;
                });
    }
}
