package com.t2.service;

import com.t2.dto.FeeDTO;
import com.t2.entity.Fees;
import com.t2.form.Fees.FeeCRUDForm;

import java.util.List;

public interface IFeesService {

    void createNewFee(FeeCRUDForm feeCRUDForm);

    Fees findById(Integer id);

    Fees findByCode(String code);

    List<FeeDTO> findAllByType(String type);

}
