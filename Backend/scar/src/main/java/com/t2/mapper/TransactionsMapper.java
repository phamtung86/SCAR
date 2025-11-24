package com.t2.mapper;

import com.t2.dto.TransactionsDTO;
import com.t2.entity.Transactions;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class, CarMapper.class})
public interface TransactionsMapper {

    @Mapping(source = "notes", target = "note")
    TransactionsDTO toDTO(Transactions entity);

    @Mapping(source = "note", target = "notes")
    Transactions toEntity(TransactionsDTO dto);
}
