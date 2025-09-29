package com._4GI.InventoryManagementSystem.service;

import com._4GI.InventoryManagementSystem.dto.LoginRequest;
import com._4GI.InventoryManagementSystem.dto.RegisterRequest;
import com._4GI.InventoryManagementSystem.dto.Response;
import com._4GI.InventoryManagementSystem.dto.UserDTO;
import com._4GI.InventoryManagementSystem.entity.User;


public interface UserService {
    Response registerUser(RegisterRequest registerRequest);
    Response loginUser(LoginRequest loginRequest);
    Response getAllUsers();
    User getCurrentLoggedInUser();
    Response updateUser(Long id, UserDTO userDTO);
    Response deleteUser(Long id);
    Response getUserTransactions(Long id);
}
