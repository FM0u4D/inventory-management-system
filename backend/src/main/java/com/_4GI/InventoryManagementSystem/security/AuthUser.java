package com._4GI.InventoryManagementSystem.security;

import com._4GI.InventoryManagementSystem.entity.User;
import lombok.Builder;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;


@Data
@Builder
public class AuthUser implements UserDetails {

    private User user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
        //return List.of(new SimpleGrantedAuthority(user.getRole().name()));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired(); // default behavior
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // assume not locking accounts
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // credentials always valid
    }

    @Override
    public boolean isEnabled() {
        return true; // user is enabled
    }
}
