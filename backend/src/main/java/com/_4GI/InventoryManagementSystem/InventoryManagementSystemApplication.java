package com._4GI.InventoryManagementSystem;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class InventoryManagementSystemApplication {

    private static final String ANSI_GREEN = "\u001B[32m";
    private static final String ANSI_RESET = "\u001B[0m";
    
    public static void main(String[] args) {
        SpringApplication.run(InventoryManagementSystemApplication.class, args);
    }

    @PostConstruct
    public void logStartupInfo() {
        System.out.println(ANSI_GREEN + "Spring Boot user.dir = " + System.getProperty("user.dir") + ANSI_RESET);
    }

}
