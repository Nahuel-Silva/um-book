package ar.edu.um.isa.umbook.repository;

import ar.edu.um.isa.umbook.domain.Fotos;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Fotos entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FotosRepository extends JpaRepository<Fotos, Long> {}
