package com._4GI.InventoryManagementSystem.repository;


import com._4GI.InventoryManagementSystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
