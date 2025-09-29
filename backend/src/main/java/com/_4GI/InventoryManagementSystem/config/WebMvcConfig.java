package com._4GI.InventoryManagementSystem.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import jakarta.annotation.PostConstruct;
import java.io.IOException;

import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.core.io.Resource;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${product.image.upload-dir}")
    private String uploadDir;

    private static final String ANSI_GREEN = "\u001B[32m";
    private static final String ANSI_RESET = "\u001B[0m";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadDir);
        String absolutePath = uploadPath.toFile().getAbsolutePath();

        System.out.println(ANSI_GREEN + "Static resource handler mapped to: " + absolutePath + ANSI_RESET);

        registry.addResourceHandler("/images/products/**")
                .addResourceLocations("file:" + absolutePath + "/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource resolved = super.getResource(resourcePath, location);
                        System.out.println("Resolved image resource: " + resolved);
                        return resolved;
                    }
                });

    }

    @PostConstruct
    public void logConfig() {
        System.out.println(ANSI_GREEN + "[+] Static Resource Handler Mapped:");
        System.out.println("  - URL Path: /images/products/**");
        System.out.println("  - File Path: " + Paths.get(uploadDir).toAbsolutePath() + ANSI_RESET);
    }

}
