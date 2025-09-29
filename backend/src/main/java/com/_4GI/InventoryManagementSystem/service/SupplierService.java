package com._4GI.InventoryManagementSystem.service;

import com._4GI.InventoryManagementSystem.dto.Response;
import com._4GI.InventoryManagementSystem.dto.SupplierDTO;


public interface SupplierService {
    Response addSupplier(SupplierDTO supplierDTO);
    Response updateSupplier(Long id, SupplierDTO supplierDTO);
    Response getAllSuppliers();
    Response getSupplierById(Long id);
    Response deleteSupplier(Long id);
}
