package com.t2.form;

import lombok.Data;

@Data
public class UploadImageForm {
    private String url;
    private String publicId;

    public UploadImageForm(String url, String publicId) {
        this.url = url;
        this.publicId = publicId;
    }
}
