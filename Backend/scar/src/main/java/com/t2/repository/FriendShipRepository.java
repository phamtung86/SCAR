package com.t2.repository;

import com.t2.entity.FriendShips;
import com.t2.entity.FriendShips.FriendShipsKey;
import com.t2.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendShipRepository extends JpaRepository<FriendShips, FriendShipsKey> {
    boolean existsFriendShipsByUserAndFriend(User user, User friend);
}
