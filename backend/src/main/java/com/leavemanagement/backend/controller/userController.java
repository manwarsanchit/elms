package com.leavemanagement.backend.controller;

import com.leavemanagement.backend.entity.User;
import com.leavemanagement.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")

public class userController {
    @Autowired
    private UserService userService;

    // @PostMapping
    // public User createUser(@RequestBody User user) {
    //     return userService.saveUser(user);
    // }

    @GetMapping
    public List<User>getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserId(@PathVariable Long id) {
        return userService.getUserById(id);
    }
}



