package com.t2.form.ChatMessage;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChatMessageCRUDForm {

    private Integer senderId;

    private Integer recipientId;

    private Integer carId;
}
