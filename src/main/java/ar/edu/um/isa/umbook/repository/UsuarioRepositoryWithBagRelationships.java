package ar.edu.um.isa.umbook.repository;

import ar.edu.um.isa.umbook.domain.Usuario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface UsuarioRepositoryWithBagRelationships {
    Optional<Usuario> fetchBagRelationships(Optional<Usuario> usuario);

    List<Usuario> fetchBagRelationships(List<Usuario> usuarios);

    Page<Usuario> fetchBagRelationships(Page<Usuario> usuarios);
}
