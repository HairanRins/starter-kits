package com.boilerplate.crud.common;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public abstract class BaseService<T extends BaseEntity, R extends JpaRepository<T, UUID>> {

    protected final R repository;

    protected BaseService(R repository) {
        this.repository = repository;
    }

    @Transactional
    public T create(T entity) {
        return repository.save(entity);
    }

    public T findById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entity not found with id: " + id));
    }

    public List<T> findAll() {
        return repository.findAll();
    }

    public Page<T> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional
    public T update(UUID id, T updated) {
        T existing = findById(id);
        updateFields(existing, updated);
        return repository.save(existing);
    }

    @Transactional
    public void delete(UUID id) {
        T entity = findById(id);
        repository.delete(entity);
    }

    protected abstract void updateFields(T existing, T updated);

    public boolean exists(UUID id) {
        return repository.existsById(id);
    }
}
