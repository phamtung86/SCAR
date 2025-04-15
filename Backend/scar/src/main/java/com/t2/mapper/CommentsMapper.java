package com.t2.mapper;

import com.t2.dto.CommentsDTO;
import com.t2.entity.Comments;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentsMapper {

    @Mapping(source = "parentComment.id", target = "parentCommentId")
    CommentsDTO toCommentsDTO(Comments comments);
}
