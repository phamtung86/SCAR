package com.t2.form.ChatMessage;

import com.t2.form.UploadImageForm;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ChatMessageForm extends ChatMessageCRUDForm {
    private Long id;

    private String content;

    private Date timestamp;

    private String type;

    private List<UploadImageForm> files;

    private Integer parentChatId;
}
