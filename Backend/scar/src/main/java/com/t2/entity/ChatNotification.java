package com.t2.entity;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatNotification {
	
    private Integer id;
    
    private Integer senderId;
    
    private String senderFristName;

    private String senderLastName;

    private Integer recipientId;
    
    private String recipientName;
    
    private String content;
    
    private Date timestamp;
}

