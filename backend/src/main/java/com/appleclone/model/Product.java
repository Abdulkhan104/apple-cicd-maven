// backend/src/main/java/com/appleclone/model/Product.java
package com.appleclone.model;

import jakarta.persistence.*;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private double price;
    private String imageUrl;
    private String modelUrl; // .gltf or .glb for 3D
    // getters/setters
}