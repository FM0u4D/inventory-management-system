package com._4GI.InventoryManagementSystem.service;

import com._4GI.InventoryManagementSystem.dto.ProductDTO;
import com._4GI.InventoryManagementSystem.dto.Response;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;


public interface ProductService {
    Response saveProduct(ProductDTO productDTO, MultipartFile imageFile);
    Response updateProduct(ProductDTO productDTO, MultipartFile imageFile);
    Response getAllProducts();
    Response getProductById(Long id);
    Response deleteProduct(Long id);
    Response updateProductPositions(List<ProductDTO> products);
}
