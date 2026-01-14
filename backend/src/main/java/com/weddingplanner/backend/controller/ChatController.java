package com.weddingplanner.backend.controller;

import com.weddingplanner.backend.controller.dto.MessageDTO;
import com.weddingplanner.backend.model.Message;
import com.weddingplanner.backend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/messages/{roomId}")
    public MessageDTO sendMessage(@DestinationVariable Long roomId, MessageDTO messageDTO) {
        Message saved = chatService.saveMessage(roomId, messageDTO.getSenderId(), messageDTO.getContent());

        return MessageDTO.builder()
                .id(saved.getId())
                .chatRoomId(saved.getChatRoom().getId())
                .senderId(saved.getSender().getId())
                .senderName(saved.getSender().getName())
                .content(saved.getContent())
                .timestamp(saved.getTimestamp())
                .build();
    }

    @GetMapping("/history/{roomId}")
    public List<MessageDTO> getHistory(@PathVariable Long roomId) {
        return chatService.getChatHistory(roomId).stream()
                .map(m -> MessageDTO.builder()
                        .id(m.getId())
                        .chatRoomId(m.getChatRoom().getId())
                        .senderId(m.getSender().getId())
                        .senderName(m.getSender().getName())
                        .content(m.getContent())
                        .timestamp(m.getTimestamp())
                        .build())
                .collect(Collectors.toList());
    }
}
