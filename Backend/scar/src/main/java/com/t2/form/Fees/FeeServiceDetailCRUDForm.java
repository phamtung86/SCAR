package com.t2.form.Fees;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class FeeServiceDetailCRUDForm {

    private List<String> name;

    private Integer feeId;
}
