package com.t2.service;

import com.t2.dto.CommentsDTO;
import com.t2.entity.Comments;
import com.t2.entity.Posts;
import com.t2.repository.CommentRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class CommentService implements ICommentService {

    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private IPostService postService;
    @Autowired
    private ModelMapper modelMapper;

    @Transactional(readOnly = true)
    @Override
    public List<CommentsDTO> getCommentsByPostId(Integer postId) {
        Posts posts = postService.findPostById(postId);
        List<Comments> allComments = commentRepository.findCommentsByPostsOrderByCreatedDate(posts);

        Map<Integer, CommentsDTO> commentMap = new HashMap<>();
        List<CommentsDTO> rootComments = new ArrayList<>();

        for (Comments comment : allComments) {
            CommentsDTO dto = modelMapper.map(comment, CommentsDTO.class);
            dto.setReplies(new ArrayList<>()); // Đảm bảo danh sách reply không bị null
            commentMap.put(dto.getId(), dto);

            if (comment.getParentComment() == null) {
                rootComments.add(dto);
            } else {
                Integer parentId = comment.getParentComment().getId();
                CommentsDTO parent = commentMap.get(parentId);

                // Nếu parent chưa có trong map, thêm một DTO rỗng trước
                if (parent == null) {
                    parent = new CommentsDTO();
                    parent.setId(parentId);
                    parent.setReplies(new ArrayList<>());
                    commentMap.put(parentId, parent);
                }

                // Thêm comment con vào danh sách replies của cha
                parent.getReplies().add(dto);
            }
        }

        return rootComments;
    }

    @Override
    public void saveComment(CommentsDTO comment) {
        Comments comments = modelMapper.map(comment, Comments.class);
        if(comment.getParentCommentId() != null){
            Comments c = commentRepository.findById(comment.getParentCommentId()).orElse(null);
            comments.setParentComment(c);
        }

        comments.setCreatedDate(new Date());
        commentRepository.save(comments);
    }

    @Override
    public List<CommentsDTO> findCommentsById(Integer id) {
        Comments c = commentRepository.findById(id).orElse(null);
        List<Comments> comments =  commentRepository.findCommentsByParentComment(c);
        return modelMapper.map(comments, new TypeToken<List<CommentsDTO>>() {}.getType());
    }

//    @Override
//    public boolean existsByCommentId(Integer id) {
//        Optional<Comments> comments = Optional.ofNullable(commentRepository.findCommentsById(id));
//        return comments.isPresent();
//    }

}
