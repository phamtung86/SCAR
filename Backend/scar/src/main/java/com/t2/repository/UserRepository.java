package com.t2.repository;

import com.t2.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUserName(String username);

    User findAllById(Integer id);

    List<User> findUserByStatus(String status);
}
