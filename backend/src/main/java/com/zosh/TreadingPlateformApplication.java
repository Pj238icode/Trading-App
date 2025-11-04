package com.zosh;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TreadingPlateformApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();

        // Set system properties so Spring Boot can read them
        System.setProperty("DB_URL", dotenv.get("DB_URL"));
        System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
        System.setProperty("MAIL_USERNAME", dotenv.get("MAIL_USERNAME"));
        System.setProperty("MAIL_PASSWORD", dotenv.get("MAIL_PASSWORD"));
        System.setProperty("STRIPE_API_KEY", dotenv.get("STRIPE_API_KEY"));
        System.setProperty("RAZORPAY_API_KEY", dotenv.get("RAZORPAY_API_KEY"));
        System.setProperty("RAZORPAY_API_SECRET", dotenv.get("RAZORPAY_API_SECRET"));
        System.setProperty("COINGECKO_API_KEY", dotenv.get("COINGECKO_API_KEY"));
        System.setProperty("GEMINI_API_KEY", dotenv.get("GEMINI_API_KEY"));
        System.setProperty("GOOGLE_CLIENT_ID", dotenv.get("GOOGLE_CLIENT_ID"));
        System.setProperty("GOOGLE_CLIENT_SECRET", dotenv.get("GOOGLE_CLIENT_SECRET"));
        System.setProperty("CORS_ALLOWED_ORIGINS", dotenv.get("CORS_ALLOWED_ORIGINS"));

        SpringApplication.run(TreadingPlateformApplication.class, args);
    }
}
