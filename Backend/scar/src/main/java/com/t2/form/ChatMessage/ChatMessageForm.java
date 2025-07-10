package com.t2.form.ChatMessage;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class ChatMessageForm extends ChatMessageCRUDForm {
    private Long id;

    private String content;

    private Date timestamp;

    private String type;
}
