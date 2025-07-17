package com.t2.form.ChatMessage;

import com.t2.form.UploadImageForm;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class ChatMessageForm extends ChatMessageCRUDForm {
    private Long id;

    private String content;

    private Date timestamp;

    private String type;

    private List<UploadImageForm> files;

}
