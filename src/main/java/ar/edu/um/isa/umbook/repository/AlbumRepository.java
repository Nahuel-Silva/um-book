package ar.edu.um.isa.umbook.repository;

import ar.edu.um.isa.umbook.domain.Album;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Album entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {}
