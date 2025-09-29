package com._4GI.InventoryManagementSystem.service.impl;

import com._4GI.InventoryManagementSystem.dto.ProductDTO;
import com._4GI.InventoryManagementSystem.dto.Response;
import com._4GI.InventoryManagementSystem.entity.Category;
import com._4GI.InventoryManagementSystem.entity.Product;
import com._4GI.InventoryManagementSystem.exceptions.NotFoundException;
import com._4GI.InventoryManagementSystem.repository.CategoryRepository;
import com._4GI.InventoryManagementSystem.repository.ProductRepository;
import com._4GI.InventoryManagementSystem.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;



@Service
@Slf4j
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;
    private final CategoryRepository categoryRepository;

    @Value("${product.image.upload-dir}")
    private String imageUploadDir;

    // Get Product
    private Product getProductOrThrow(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product Not Found"));
    }

    // Get Category
    private Category getCategoryOrThrow(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category Not Found with ID: " + categoryId));
    }

    @Transactional
    @Override
    public Response updateProductPositions(List<ProductDTO> products) {
        List<Product> updatedProducts = new ArrayList<>();

        for (int i = 0; i < products.size(); i++) {
            Long id = products.get(i).getId();

            // Load product entity
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id)); // <--- safer

            product.setPosition(i); // <--- set new position
            updatedProducts.add(product); // <--- collect for batch save
        }

        productRepository.saveAll(updatedProducts); // <--- persist all changes at once

        return Response.builder()
                .status(200)
                .message("Reordering successful")
                .build();
    }

    // Save Product with optional image
    @Override
    public Response saveProduct(ProductDTO productDTO, MultipartFile imageFile) {
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String filename = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
                Path imagePath = Paths.get(imageUploadDir, filename).toAbsolutePath();
                Files.createDirectories(imagePath.getParent());
                imageFile.transferTo(imagePath.toFile());
                productDTO.setImageUrl(filename);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image file: " + e.getMessage());
            }
        }

        Product product = new Product();
        product.setName(productDTO.getName());
        product.setSku(productDTO.getSku());
        product.setPrice(productDTO.getPrice());
        product.setStockQuantity(productDTO.getStockQuantity());
        product.setDescription(productDTO.getDescription());
        product.setCategory(getCategoryOrThrow(productDTO.getCategoryId()));
        product.setImageUrl(productDTO.getImageUrl());

        Product savedProduct = productRepository.save(product);
        ProductDTO savedDto = ProductDTO.fromEntity(savedProduct);

        return Response.builder()
                .status(200)
                .message("Product saved successfully")
                .product(savedDto)
                .build();
    }

    @Override
    public Response updateProduct(ProductDTO productDTO, MultipartFile imageFile) {
        Product existingProduct = getProductOrThrow(productDTO.getProductId());

        if (imageFile != null && !imageFile.isEmpty()) {
            try {

                String rawFilename = imageFile.getOriginalFilename();
                String filename = System.currentTimeMillis() + "_" + rawFilename.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
                Path imagePath = Paths.get(imageUploadDir, filename).toAbsolutePath();

                Files.createDirectories(imagePath.getParent());
                imageFile.transferTo(imagePath.toFile());
                productDTO.setImageUrl(filename);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image file: " + e.getMessage());
            }
        }

        existingProduct.setName(productDTO.getName());
        existingProduct.setSku(productDTO.getSku());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setStockQuantity(productDTO.getStockQuantity());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setCategory(getCategoryOrThrow(productDTO.getCategoryId()));

        if (productDTO.getImageUrl() != null) {
            existingProduct.setImageUrl(productDTO.getImageUrl());
        }

        Product updatedProduct = productRepository.save(existingProduct);
        ProductDTO updatedDto = ProductDTO.fromEntity(updatedProduct);

        return Response.builder()
                .status(200)
                .message("Product updated successfully")
                .product(updatedDto)
                .build();
    }

    // Get all
    @Override
    public Response getAllProducts() {
        //List<Product> products = productRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        List<Product> products = productRepository.findAllByOrderByPositionAsc();
        List<ProductDTO> productDTOS = products.stream()
                                                .map(p -> modelMapper.map(p, ProductDTO.class))
                                                .toList();

        return Response.builder()
                .status(200)
                .message("success")
                .products(productDTOS)
                .build();
    }

    // Get by ID
    @Override
    public Response getProductById(Long id) {
        Product product = getProductOrThrow(id);
        return Response.builder()
                .status(200)
                .message("success")
                .product(modelMapper.map(product, ProductDTO.class))
                .build();
    }

    // Delete
    @Override
    public Response deleteProduct(Long id) {
        getProductOrThrow(id);
        productRepository.deleteById(id);
        return Response.builder()
                .status(200)
                .message("Product successfully deleted")
                .build();
    }
}
