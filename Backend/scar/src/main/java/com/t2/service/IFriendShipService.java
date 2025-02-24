package com.t2.service;

import com.t2.entity.User;

public interface IFriendShipService {
    boolean isFriendShip(User user, User friendshipId);
}
