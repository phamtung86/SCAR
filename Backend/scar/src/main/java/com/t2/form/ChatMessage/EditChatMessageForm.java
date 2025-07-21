package com.t2.form.ChatMessage;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class EditChatMessageForm extends ChatMessageCRUDForm{

    private Long id;

    private String message;

}
