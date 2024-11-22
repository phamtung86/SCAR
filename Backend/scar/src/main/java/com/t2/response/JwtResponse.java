package com.t2.response;

public class JwtResponse {
    private int userId;
    private String token;
    private String iat; // Dạng String (yyyy-MM-dd HH:mm:ss)
    private String exp; // Dạng String (yyyy-MM-dd HH:mm:ss)

    public JwtResponse(int userId, String token, String iat, String exp) {
        this.userId = userId;
        this.token = token;
        this.iat = iat;
        this.exp = exp;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getIat() {
        return iat;
    }

    public void setIat(String iat) {
        this.iat = iat;
    }

    public String getExp() {
        return exp;
    }

    public void setExp(String exp) {
        this.exp = exp;
    }
}
