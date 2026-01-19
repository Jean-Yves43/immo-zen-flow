package com.example.immogestion.repository;


import com.example.immogestion.model.Relance;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface RelanceRepository extends ReactiveCrudRepository<Relance, Long> {

    /**
     * Trouve toutes les relances pour une location donnée
     */
    Flux<Relance> findByLocationId(Long locationId);
}
