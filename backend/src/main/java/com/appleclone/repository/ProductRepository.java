// ProductRepository.java
package com.appleclone.repository;
import com.appleclone.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {}