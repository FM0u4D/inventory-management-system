package com._4GI.InventoryManagementSystem.controller;

import com._4GI.InventoryManagementSystem.dto.LoginRequest;
import com._4GI.InventoryManagementSystem.dto.RegisterRequest;
import com._4GI.InventoryManagementSystem.dto.Response;
import com._4GI.InventoryManagementSystem.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Response> registerUser(@RequestBody @Valid RegisterRequest registerRequest) {
        return ResponseEntity.ok(userService.registerUser(registerRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<Response> loginUser(@RequestBody @Valid LoginRequest loginRequest) {
        return ResponseEntity.ok(userService.loginUser(loginRequest));
    }

    @GetMapping("/debug-auth")
    public ResponseEntity<String> debugAuthentication(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("No Authentication found.");
        }
        return ResponseEntity.ok("Username: " + authentication.getName()
                + " | Authorities: " + authentication.getAuthorities());
    }

}
