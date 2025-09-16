package com.t2.service;

import com.t2.entity.FeeServiceDetails;
import com.t2.entity.Fees;
import com.t2.form.Fees.FeeServiceDetailCRUDForm;
import com.t2.repository.IFeeServiceDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FeeServiceDetailsService implements IFeeServiceDetailsService {

    @Autowired
    private IFeeServiceDetailRepository iFeeServiceDetailRepository;
    @Autowired
    private IFeesService iFeesService;

    @Override
    public void createNewFeeService(FeeServiceDetailCRUDForm feeServiceDetailCRUDForm) {
        Fees fees = iFeesService.findById(feeServiceDetailCRUDForm.getFeeId());
        List<FeeServiceDetails> feeServiceDetails = new ArrayList<>();
        for (String s : feeServiceDetailCRUDForm.getName()) {
            FeeServiceDetails feeServiceDetail = new FeeServiceDetails();
            feeServiceDetail.setName(s);
            feeServiceDetail.setFee(fees);
            feeServiceDetail.setId(null);
            feeServiceDetails.add(feeServiceDetail);
        }
        iFeeServiceDetailRepository.saveAll(feeServiceDetails);
    }
}
