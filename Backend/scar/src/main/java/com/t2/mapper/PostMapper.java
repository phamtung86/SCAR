package com.t2.mapper;

import com.t2.dto.PostsDTO;
import com.t2.entity.Posts;
import org.mapstruct.*;
import java.util.List;

@Mapper(componentModel = "spring", uses = {PostImageMapper.class, UserMapper.class, CommentsMapper.class})
public interface PostMapper {

//    @Mapping(target = "totalLikes", expression = "java(post.getLikes() != null ? post.getLikes().size() : 0)")
//    PostsDTO toDTO(Posts post);
//
//    List<PostsDTO> toDTOs(List<Posts> posts);
}
