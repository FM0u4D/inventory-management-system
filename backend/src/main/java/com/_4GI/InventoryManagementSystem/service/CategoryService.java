package com._4GI.InventoryManagementSystem.service;

import com._4GI.InventoryManagementSystem.dto.CategoryDTO;
import com._4GI.InventoryManagementSystem.dto.Response;
import java.util.List;


public interface CategoryService {
    Response createCategory(CategoryDTO categoryDTO);
    Response getAllCategories();
    Response getCategoryById(Long id);
    Response updateCategory(Long id, CategoryDTO categoryDTO);
    Response deleteCategory(Long id);
    // Persist re-ordered category IDs
    Response reorderCategories(List<Long> orderedIds);
}
