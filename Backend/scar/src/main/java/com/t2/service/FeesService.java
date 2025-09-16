package com.t2.service;

import com.t2.dto.FeeDTO;
import com.t2.entity.Fees;
import com.t2.entity.User;
import com.t2.form.Fees.FeeCRUDForm;
import com.t2.form.Fees.FeeServiceDetailCRUDForm;
import com.t2.repository.IFeesRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class FeesService implements IFeesService {

    @Autowired
    private IFeesRepository iFeesRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private IUserService userService;
    @Lazy
    @Autowired
    private IFeeServiceDetailsService iFeeServiceDetailsService;

    @Transactional
    @Override
    public void createNewFee(FeeCRUDForm feeCRUDForm) {
        Fees fee = modelMapper.map(feeCRUDForm, Fees.class);
        User creator = userService.findUserById(feeCRUDForm.getCreatorId());
        fee.setId(null);
        fee.setCreator(creator);
        fee.setCreatedAt(new Date());
        Fees f = iFeesRepository.save(fee);
        if (!feeCRUDForm.getFeeServiceDetailName().isEmpty()) {
            FeeServiceDetailCRUDForm feeServiceDetailCRUDForm = new FeeServiceDetailCRUDForm(feeCRUDForm.getFeeServiceDetailName(), f.getId());
            iFeeServiceDetailsService.createNewFeeService(feeServiceDetailCRUDForm);
        }
    }

    @Override
    public Fees findById(Integer id) {
        return iFeesRepository.findById(id).orElse(null);
    }

    @Override
    public Fees findByCode(String code) {

        return iFeesRepository.findByCode(Fees.Code.valueOf(code));
    }

    @Override
    public List<FeeDTO> findAllByType(String type) {
        List<Fees> fees = iFeesRepository.findByType(Fees.Type.valueOf(type));
        return modelMapper.map(fees, new TypeToken<List<FeeDTO>>(){}.getType());
    }
}
