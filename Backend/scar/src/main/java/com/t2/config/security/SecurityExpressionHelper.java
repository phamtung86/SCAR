package com.t2.config.security;

import com.t2.common.UserRole;
import com.t2.jwtutils.CustomUserDetails;
import com.t2.repository.ICarRepository;
import com.t2.repository.PostRepository;
import com.t2.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component("securityExpr")
public class SecurityExpressionHelper {

    @Autowired
    private ICarRepository carRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    private Integer getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) auth.getPrincipal()).getUserId();
        }
        return null;
    }

    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            return auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals(UserRole.ROLE_ADMIN) || a.getAuthority().equals(UserRole.ADMIN));
        }
        return false;
    }

    private boolean isModerator() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            return auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals(UserRole.ROLE_MODERATOR) || a.getAuthority().equals(UserRole.MODERATOR));
        }
        return false;
    }

    // ==================== CAR ====================

    public boolean isCarOwnerOrAdmin(Integer carId) {
        if (isAdmin()) return true;

        Integer currentUserId = getCurrentUserId();
        if (currentUserId == null || carId == null) return false;

        return carRepository.findById(carId)
                .map(car -> car.getUser().getId().equals(currentUserId))
                .orElse(false);
    }

    public boolean isCarOwner(Integer carId) {
        Integer currentUserId = getCurrentUserId();
        if (currentUserId == null || carId == null) return false;

        return carRepository.findById(carId)
                .map(car -> car.getUser().getId().equals(currentUserId))
                .orElse(false);
    }

    // ==================== POST ====================

    public boolean isPostOwnerOrMod(Integer postId) {
        if (isAdmin() || isModerator()) return true;

        Integer currentUserId = getCurrentUserId();
        if (currentUserId == null || postId == null) return false;

        return postRepository.findById(postId)
                .map(post -> post.getUser().getId().equals(currentUserId))
                .orElse(false);
    }

    public boolean isPostOwner(Integer postId) {
        Integer currentUserId = getCurrentUserId();
        if (currentUserId == null || postId == null) return false;

        return postRepository.findById(postId)
                .map(post -> post.getUser().getId().equals(currentUserId))
                .orElse(false);
    }

    // ==================== USER ====================

    public boolean isSelfOrAdmin(Integer userId) {
        if (isAdmin()) return true;

        Integer currentUserId = getCurrentUserId();
        return currentUserId != null && currentUserId.equals(userId);
    }

    public boolean isSelf(Integer userId) {
        Integer currentUserId = getCurrentUserId();
        return currentUserId != null && currentUserId.equals(userId);
    }
    
    // ==================== COMMENT ====================

    public boolean isCommentOwnerOrMod(Integer commentId) {
        if (isAdmin() || isModerator()) return true;

        Integer currentUserId = getCurrentUserId();
        if (currentUserId == null || commentId == null) return false;

        return commentRepository.findById(commentId)
                .map(comment -> comment.getUser().getId().equals(currentUserId))
                .orElse(false);
    }
}
