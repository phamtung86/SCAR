package com.t2;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ScarApplication {
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure()
                .directory("./scar")
                .filename(".env")
                .load();

        System.setProperty("DB_URL", dotenv.get("DB_URL"));
        System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
        System.setProperty("GOOGLE_CLIENT_ID", dotenv.get("GOOGLE_CLIENT_ID"));
        System.setProperty("GOOGLE_CLIENT_SECRET", dotenv.get("GOOGLE_CLIENT_SECRET"));
        System.setProperty("RABBIT_USERNAME", dotenv.get("RABBIT_USERNAME"));
        System.setProperty("RABBIT_PASSWORD", dotenv.get("RABBIT_PASSWORD"));
        System.setProperty("EMAIL_USERNAME", dotenv.get("EMAIL_USERNAME"));
        System.setProperty("EMAIL_PASSWORD", dotenv.get("EMAIL_PASSWORD"));
        System.setProperty("VNP_TMNCODE", dotenv.get("VNP_TMNCODE"));
        System.setProperty("VN_PAY_SECRET", dotenv.get("VN_PAY_SECRET"));

        SpringApplication.run(ScarApplication.class, args);
    }
}
