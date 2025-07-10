package com.t2.service;

import com.t2.entity.User;
import com.t2.repository.FriendShipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FriendShipService implements IFriendShipService{

    @Autowired
    private FriendShipRepository friendShipRepository;

    @Override
    public boolean isFriendShip(User user, User friendshipId) {

        return friendShipRepository.existsFriendShipsByUserAndFriend(user, friendshipId);
    }
}
