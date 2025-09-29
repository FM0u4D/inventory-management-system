package com.phegondev.InventoryManagementSystem;

import com._4GI.InventoryManagementSystem.security.JwtUtils;
import com._4GI.InventoryManagementSystem.security.CustomUserDetailsService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;


@SpringBootTest
class InventoryManagementSystemApplicationTests {

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void contextLoads() {
        // No logic needed, just tests that Spring Boot app context loads successfully
    }
}
