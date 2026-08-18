package com.leavemanagement.backend.service;

import com.leavemanagement.backend.entity.User;
import com.leavemanagement.backend.exception.ConflictException;
import com.leavemanagement.backend.exception.ForbiddenException;
import com.leavemanagement.backend.exception.InvalidCredentialsException;
import com.leavemanagement.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${admin.registration.code}")
    private String adminRegistrationCode;

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User registerUser(String name, String email, String rawPassword, String requestedRole, String adminCode) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ConflictException("Email already registered");
        }

        String role = "EMPLOYEE";
        if ("ADMIN".equalsIgnoreCase(requestedRole)) {
            if (adminCode == null || !adminCode.equals(adminRegistrationCode)) {
                throw new ForbiddenException("Invalid admin registration code");
            }
            role = "ADMIN";
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(role);
        return userRepository.save(user);
    }

    public User login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }
        return user;
    }

}
