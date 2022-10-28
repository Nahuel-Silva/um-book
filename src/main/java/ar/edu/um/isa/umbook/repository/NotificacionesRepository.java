package ar.edu.um.isa.umbook.repository;

import ar.edu.um.isa.umbook.domain.Notificaciones;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Notificaciones entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NotificacionesRepository extends JpaRepository<Notificaciones, Long> {}
