package com.t2.mapper;

import com.t2.dto.PostImageDTO;
import com.t2.entity.PostImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PostImageMapper {

    @Mapping(source = "post.id", target = "postId")
    PostImageDTO toPostImageDTO(PostImage postImage);
}
