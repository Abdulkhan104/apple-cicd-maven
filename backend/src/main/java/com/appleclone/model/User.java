// backend/src/main/java/com/appleclone/model/User.java
package com.appleclone.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String email;
    @JsonIgnore
    private String password;
    private String role; // "USER" or "ADMIN"
    
    // getters and setters (omitted for brevity - include all)
}