package com._4GI.InventoryManagementSystem.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com._4GI.InventoryManagementSystem.entity.Product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductDTO {

    private Long id;
    private Long productId;
    private Long categoryId;
    private Long supplierId;
    private Integer position;
    private String name;
    private String sku;
    private BigDecimal price;
    private Integer stockQuantity;
    private String description;
    private String imageUrl;
    private LocalDateTime expiryDate;
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;

    // Custom Mapper Method from Entity to DTO
    public static ProductDTO fromEntity(Product product) {
        if (product == null) {
            return null;
        }

        ProductDTO dto = new ProductDTO();

        dto.setId(product.getId());
        dto.setProductId(product.getId());

        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
        }

        dto.setName(product.getName());
        dto.setSku(product.getSku());
        dto.setPrice(product.getPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setDescription(product.getDescription());
        dto.setImageUrl(product.getImageUrl());
        dto.setExpiryDate(product.getExpiryDate());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());

        // No supplierId mapping because supplier isn't available in the Product entity
        return dto;
    }
}
