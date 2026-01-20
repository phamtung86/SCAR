package com.t2.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PrivacySettingsDTO {
    private Boolean privateAccount;
    private Boolean showActivityStatus;
    private String allowMessagesFrom; // everyone, followers, none
}
