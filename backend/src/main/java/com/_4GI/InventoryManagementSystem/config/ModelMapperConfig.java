package com._4GI.InventoryManagementSystem.config;

import com._4GI.InventoryManagementSystem.dto.TransactionDTO;
import com._4GI.InventoryManagementSystem.dto.UserDTO;
import com._4GI.InventoryManagementSystem.entity.Transaction;
import com._4GI.InventoryManagementSystem.entity.User;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static org.modelmapper.config.Configuration.AccessLevel.PRIVATE;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mm = new ModelMapper();

        mm.getConfiguration()
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(PRIVATE)
                .setSkipNullEnabled(true)
                .setCollectionsMergeEnabled(false)
                .setAmbiguityIgnored(true)
                // TEMP: turn off implicit mappings while we define skip rules
                .setImplicitMappingEnabled(false);

        // --- Create empty type maps and add skip rules ---
        var txMap = mm.createTypeMap(Transaction.class, TransactionDTO.class);
        txMap.addMappings(m -> {
            m.skip(TransactionDTO::setUser);
            m.skip(TransactionDTO::setProduct);
            m.skip(TransactionDTO::setSupplier);
        });

        var userMap = mm.createTypeMap(User.class, UserDTO.class);
        userMap.addMappings(m -> m.skip(UserDTO::setTransactions));

        // Re-enable implicit mappings and populate the rest
        mm.getConfiguration().setImplicitMappingEnabled(true);
        txMap.implicitMappings();
        userMap.implicitMappings();

        return mm;
    }
}
