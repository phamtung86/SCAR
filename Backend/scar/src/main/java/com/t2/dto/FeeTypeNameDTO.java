package com.t2.dto;

import com.t2.entity.Fees;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FeeTypeNameDTO {
    private String type;
    private String typeName;

    public FeeTypeNameDTO(Fees.Type type, String typeName) {
        this.type = type.toString();
        this.typeName = typeName;
    }

}
