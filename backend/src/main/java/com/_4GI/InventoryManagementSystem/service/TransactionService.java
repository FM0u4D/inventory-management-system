package com._4GI.InventoryManagementSystem.service;

import com._4GI.InventoryManagementSystem.dto.Response;
import com._4GI.InventoryManagementSystem.dto.TransactionRequest;
import com._4GI.InventoryManagementSystem.enums.TransactionStatus;


public interface TransactionService {
    Response restockInventory(TransactionRequest transactionRequest);
    Response sell(TransactionRequest transactionRequest);
    Response returnToSupplier(TransactionRequest transactionRequest);
    Response getAllTransactions(int page, int size, String searchText);
    Response getTransactionById(Long id);
    Response getAllTransactionByMonthAndYear(int month, int year);
    Response updateTransactionStatus(Long transactionId, TransactionStatus transactionStatus);
}
