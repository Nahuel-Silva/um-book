package ar.edu.um.isa.umbook.repository;

import ar.edu.um.isa.umbook.domain.Perfil;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Perfil entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PerfilRepository extends JpaRepository<Perfil, Long> {}
