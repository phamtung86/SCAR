package com.t2.specification;

import com.t2.entity.Comments;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.data.jpa.domain.Specification;

public class CommentSpecification {

    public Specification<Comments> buildWhere(){
        return new CommentsCustomSpecification("id", null);
    }

    @AllArgsConstructor
    class CommentsCustomSpecification implements Specification<Comments>{

        @NonNull
        private String field;
        @NonNull
        private Object value;


        @Override
        public Predicate toPredicate(Root<Comments> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
            if(field.equals("id")){
                query.groupBy(root.<String>get("id"));
                return criteriaBuilder.equal(root.get(field), value);
            }
            return null;
        }
    }

}
