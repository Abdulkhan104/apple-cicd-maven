// backend/src/main/java/com/appleclone/controller/ProductController.java
package com.appleclone.controller;

import com.appleclone.model.Product;
import com.appleclone.model.Order;
import com.appleclone.model.User;
import com.appleclone.repository.ProductRepository;
import com.appleclone.repository.OrderRepository;
import com.appleclone.repository.UserRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public ProductController(ProductRepository productRepository, OrderRepository orderRepository,
                             UserRepository userRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @PostMapping("/{id}/purchase")
    public Order purchaseProduct(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Product product = productRepository.findById(id).orElseThrow();
        Order order = new Order();
        order.setUser(user);
        order.setProduct(product);
        order.setOrderDate(LocalDateTime.now());
        return orderRepository.save(order);
    }
}