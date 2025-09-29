package com._4GI.InventoryManagementSystem.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Added annotations for automatic timestamp management
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Sku is required")
    @Column(unique = true)
    private String sku;

    @Positive(message = "Product price must be a positive value")
    private BigDecimal price;

    @Min(value = 0, message = "Stock quantity cannot be lesser than zero")
    private Integer stockQuantity;

    private String description;

    private String imageUrl;

    private LocalDateTime expiryDate;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Min(value = 0, message = "Position must be a positive value")
    @Column(name = "position")
    private Integer position;

    @Override
    public String toString() {
        return "Product{"
                + "id=" + id
                + ", position='" + position + '\''
                + ", name='" + name + '\''
                + ", sku='" + sku + '\''
                + ", price=" + price
                + ", stockQuantity=" + stockQuantity
                + ", description='" + description + '\''
                + ", imageUrl='" + imageUrl + '\''
                + ", expiryDate=" + expiryDate
                + ", updatedAt=" + updatedAt
                + ", createdAt=" + createdAt
                + '}';
    }
    
}
