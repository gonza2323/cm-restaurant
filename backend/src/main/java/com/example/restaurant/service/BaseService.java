package com.example.restaurant.service;

import com.example.restaurant.entity.BaseEntity;
import com.example.restaurant.error.BusinessException;
import com.example.restaurant.repository.BaseRepository;
import org.springframework.transaction.annotation.Transactional;


public abstract class BaseService<
        E extends BaseEntity,
        R extends BaseRepository<E>> {

    private final String entityName;
    protected final R repository;

    protected BaseService(String entityName, R repository) {
        this.entityName = entityName;
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public E find(Long id) {
        return repository.findActiveById(id)
                .orElseThrow(() -> new BusinessException(entityName + " not found."));
    }

    @Transactional
    public E delete(E entity) {
        preDelete(entity);
        entity.setEliminado(true);
        repository.save(entity);
        postDelete(entity);
        return entity;
    }

    @Transactional
    public E delete(Long id) {
        E entity = find(id);
        return delete(entity);
    }


    // hooks

    protected void preDelete(E entity) {}
    protected void postDelete(E entity) {}
}
