package com.t2.controller;

import com.t2.dto.FeeDTO;
import com.t2.dto.FeeTypeNameDTO;
import com.t2.entity.Fees;
import com.t2.form.Fees.FeeCRUDForm;
import com.t2.service.IFeesService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/fees")
public class FeeController {

    @Autowired
    private IFeesService iFeesService;
    @Autowired
    private ModelMapper modelMapper;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createNewFee(@RequestBody FeeCRUDForm feeCRUDForm) {
        iFeesService.createNewFee(feeCRUDForm);
        return ResponseEntity.status(201).body("Create new fee success");
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<FeeDTO> findAllByCode(@PathVariable(name = "code") String code) {
        Fees fee = iFeesService.findByCode(code);
        FeeDTO feeDTOS = modelMapper.map(fee, FeeDTO.class);
        return ResponseEntity.status(200).body(feeDTOS);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<FeeDTO>> findAllByType(@PathVariable(name = "type") String type) {
        List<FeeDTO> feeDTOS = iFeesService.findAllByType(type);
        return ResponseEntity.status(200).body(feeDTOS);
    }

    @GetMapping
    public ResponseEntity<List<FeeDTO>> getAllFees() {
        List<FeeDTO> feeDTOS = iFeesService.getAllFees();
        return ResponseEntity.status(200).body(feeDTOS);
    }

    @GetMapping("/name-typename")
    public ResponseEntity< List<FeeTypeNameDTO>> getNameAndTypeName(){
        List<FeeTypeNameDTO> data = iFeesService.findTypeAndTypeName();
        return ResponseEntity.status(200).body(data);
    }
    @GetMapping("/codes")
    public List<String> getAllCodes() {
        return iFeesService.getAllCodes();
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable(name = "id") Integer id){
        iFeesService.deleteFeeById(id);
    }

}
