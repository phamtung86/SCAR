package com.t2.service;

import com.t2.dto.CommentsDTO;
import com.t2.entity.Comments;
import com.t2.entity.Posts;
import com.t2.repository.CommentRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class CommentService implements ICommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional(readOnly = true)
    @Override
    public List<CommentsDTO> getCommentsByPostId(Integer postId) {
        List<Comments> allComments = commentRepository.findCommentsByPostsIdOrderByCreatedDate(postId);

        Map<Integer, CommentsDTO> commentMap = new HashMap<>();
        List<CommentsDTO> rootComments = new ArrayList<>();

        for (Comments comment : allComments) {
            CommentsDTO dto = modelMapper.map(comment, CommentsDTO.class);
            dto.setReplies(new ArrayList<>());
            commentMap.put(dto.getId(), dto);

            if (comment.getParentComment() == null) {
                rootComments.add(dto);
            } else {
                Integer parentId = comment.getParentComment().getId();
                CommentsDTO parent = commentMap.get(parentId);

                if (parent == null) {
                    parent = new CommentsDTO();
                    parent.setId(parentId);
                    parent.setReplies(new ArrayList<>());
                    commentMap.put(parentId, parent);
                }

                parent.getReplies().add(dto);
            }
        }

        for (CommentsDTO dto : rootComments) {
            dto.getReplies().sort(Comparator.comparing(CommentsDTO::getCreatedDate).reversed());
        }
         rootComments.sort(Comparator.comparing(CommentsDTO::getCreatedDate).reversed());
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
    public Comments findCommentById(Integer id) {

        return commentRepository.findById(id).orElse(null);
    }


}
