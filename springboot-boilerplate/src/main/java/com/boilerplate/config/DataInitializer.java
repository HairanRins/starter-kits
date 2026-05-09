package com.boilerplate.config;

import com.boilerplate.user.Role;
import com.boilerplate.user.User;
import com.boilerplate.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@boilerplate.com").isEmpty()) {
            User admin = User.builder()
                    .email("admin@boilerplate.com")
                    .password(passwordEncoder.encode("admin123"))
                    .firstname("Admin")
                    .lastname("User")
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            log.info("Admin user created: admin@boilerplate.com / admin123");
        }
    }
}
