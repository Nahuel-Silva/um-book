package ar.edu.um.isa.umbook.repository;

import ar.edu.um.isa.umbook.domain.Grupos;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface GruposRepositoryWithBagRelationships {
    Optional<Grupos> fetchBagRelationships(Optional<Grupos> grupos);

    List<Grupos> fetchBagRelationships(List<Grupos> grupos);

    Page<Grupos> fetchBagRelationships(Page<Grupos> grupos);
}
