package com._4GI.InventoryManagementSystem.repository;

import com._4GI.InventoryManagementSystem.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;


public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}
