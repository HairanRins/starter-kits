package com.boilerplate.crud;

import com.boilerplate.crud.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "todos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Todo extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String title;

    private String description;

    private boolean completed;
}
