package com.t2.repository;

import com.t2.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    List<User> findByStatus(String status);

    Optional<User> findByEmail(String email);

    List<User> findByAccountStatus(User.AccountStatus accountStatus);

    List<User> findByRole(User.Role role);
}
