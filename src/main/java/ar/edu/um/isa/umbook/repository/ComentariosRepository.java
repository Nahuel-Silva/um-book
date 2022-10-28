package ar.edu.um.isa.umbook.repository;

import ar.edu.um.isa.umbook.domain.Comentarios;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Comentarios entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ComentariosRepository extends JpaRepository<Comentarios, Long> {}
