package com.lionride.lionride_backend.modules.rider.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "riders")
public class Rider {
    @Id
    @Column(name = "uid", nullable = false)
    private String uid;

    @Column(name = "default_payment_method", length = 50)
    private String defaultPaymentMethod;
}
