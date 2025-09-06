package com.t2.service;

import com.t2.entity.RefreshToken;
import com.t2.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RefreshTokenService implements IRefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;


    @Override
    public void createRefreshToken(RefreshToken refreshToken) {
        refreshTokenRepository.save(refreshToken);
    }
}
