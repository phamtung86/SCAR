package com.t2.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationSettingsDTO {
    private Boolean emailNewComments;
    private Boolean emailNewLikes;
    private Boolean emailNewFollowers;
    private Boolean pushNewMessages;
    private Boolean pushEvents;
}
