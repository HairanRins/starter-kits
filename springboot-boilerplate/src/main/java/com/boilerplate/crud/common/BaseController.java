package com.boilerplate.crud.common;

import com.boilerplate.dto.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

public abstract class BaseController<T extends BaseEntity, S extends BaseService<T, ?>> {

    protected final S service;
    protected final String entityName;

    protected BaseController(S service, String entityName) {
        this.service = service;
        this.entityName = entityName;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<T>>> findAll(Pageable pageable) {
        Page<T> page = service.findAll(pageable);
        return ResponseEntity.ok(ApiResponse.success(page.getContent(), page));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<T>> findById(@PathVariable UUID id) {
        T entity = service.findById(id);
        return ResponseEntity.ok(ApiResponse.success(entity));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<T>> create(@RequestBody T entity) {
        T created = service.create(entity);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(entityName + " created", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<T>> update(@PathVariable UUID id, @RequestBody T entity) {
        T updated = service.update(id, entity);
        return ResponseEntity.ok(ApiResponse.success(entityName + " updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success(entityName + " deleted"));
    }
}
