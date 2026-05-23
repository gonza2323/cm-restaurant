package com.example.restaurant.repository;

import com.example.restaurant.entity.BaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

@NoRepositoryBean
public interface BaseRepository<E extends BaseEntity> extends JpaRepository<E, Long> {

    @Query("""
        select e
        from #{#entityName} e
        where e.id = :id
          and e.eliminado = false
    """)
    Optional<E> findActiveById(@Param("id") Long id);
}
