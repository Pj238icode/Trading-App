package com.zosh;

import com.zosh.domain.USER_ROLE;
import com.zosh.model.User;
import com.zosh.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class TreadingPlateformApplication implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(TreadingPlateformApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@123.com";

        // Check if admin already exists
        if (userRepository.findByEmail(adminEmail) == null) {
            User admin = new User();
            admin.setFullName("Admin User");
            admin.setEmail(adminEmail);
            admin.setMobile("9999999999");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(USER_ROLE.ROLE_ADMIN);
            admin.setVerified(true);

            userRepository.save(admin);

            System.out.println("✅ Default admin created: " + adminEmail);
        } else {
            System.out.println("ℹ️ Admin user already exists.");
        }
    }
}
