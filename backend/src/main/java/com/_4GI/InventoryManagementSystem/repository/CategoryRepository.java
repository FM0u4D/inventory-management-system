package com._4GI.InventoryManagementSystem.repository;

import com._4GI.InventoryManagementSystem.entity.Category;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("SELECT c FROM Category c ORDER BY c.position ASC")
    List<Category> findAllOrdered();

    @Modifying
    @Transactional
    @Query("UPDATE Category c SET c.position = :position WHERE c.id = :id")
    void updatePosition(@Param("id") Long id, @Param("position") Integer position);

}
