package com._4GI.InventoryManagementSystem.repository;

import com._4GI.InventoryManagementSystem.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findAllByOrderByPositionAsc();
}
