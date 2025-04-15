package com.t2.config;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.stereotype.Component;

@Component
@Getter
public class DotEnvConfig {
    private static Dotenv dotenv;

    @PostConstruct
    public void init() {
        try {
            dotenv = Dotenv.configure().directory("./scar").load();
        } catch (Exception e) {
            System.err.println("Failed to load DotENV: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public static String getSecret() {
        return dotenv != null ? dotenv.get("SECRET") : null;
    }
    public static String getCloudName() {
        return dotenv != null ? dotenv.get("CLOUD_NAME") : null;
    }

    public static String getCloudApiKey() {
        return dotenv != null ? dotenv.get("CLOUD_API_KEY") : null;
    }

    public static String getCloudApiSecret() {
        return dotenv != null ? dotenv.get("CLOUD_API_SECRET") : null;
    }

    public static String getDbUrl(){
        return dotenv != null ? dotenv.get("DB_URL") : null;
    }
    public static String getDbUsername(){
        return dotenv != null ? dotenv.get("DB_USERNAME") : null;
    }
    public static String getDbPassword(){
        return dotenv != null ? dotenv.get("DB_PASSWORD") : null;
    }

}
