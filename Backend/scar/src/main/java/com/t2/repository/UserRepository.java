package com.t2.repository;

import com.t2.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUserName(String username);

    boolean existsByEmail(String email);

    boolean existsByUserName(String username);
}
