package com.leavemanagement.backend.controller;

import com.leavemanagement.backend.dto.LoginRequest;
import com.leavemanagement.backend.dto.LoginResponse;
import com.leavemanagement.backend.dto.RegisterRequest;
import com.leavemanagement.backend.dto.UserResponse;
import com.leavemanagement.backend.entity.User;
import com.leavemanagement.backend.security.JwtUtil;
import com.leavemanagement.backend.service.UserService;
import jakarta.validation.Valid;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    // @PostMapping("/register")
    // public ResponseEntity<UserResponse> register(@Valid @RequestBody
    // RegisterRequest request) {
    // User user = userService.registerUser(request.getName(), request.getEmail(),
    // request.getPassword());
    // UserResponse response = new UserResponse(
    // user.getId(), user.getName(), user.getEmail(), user.getRole(),
    // user.getCreatedAt());
    // return ResponseEntity.status(HttpStatus.CREATED).body(response);
    // }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        User user = userService.registerUser(request.getName(), request.getEmail(), request.getPassword(),
                request.getRole(), request.getAdminCode());
        UserResponse response = new UserResponse(
                user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getCreatedAt());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = userService.login(request.getEmail(), request.getPassword());
        String token = jwtUtil.generateToken(user.getEmail());
        LoginResponse response = new LoginResponse(token, user.getId(), user.getName(),
                user.getEmail(), user.getRole());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserResponse response = new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(),
                user.getCreatedAt());
        return ResponseEntity.ok(response);
    }

}
