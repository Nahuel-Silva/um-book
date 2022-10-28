package ar.edu.um.isa.umbook.repository;

import ar.edu.um.isa.umbook.domain.Usuario;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class UsuarioRepositoryWithBagRelationshipsImpl implements UsuarioRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Usuario> fetchBagRelationships(Optional<Usuario> usuario) {
        return usuario.map(this::fetchGrupos);
    }

    @Override
    public Page<Usuario> fetchBagRelationships(Page<Usuario> usuarios) {
        return new PageImpl<>(fetchBagRelationships(usuarios.getContent()), usuarios.getPageable(), usuarios.getTotalElements());
    }

    @Override
    public List<Usuario> fetchBagRelationships(List<Usuario> usuarios) {
        return Optional.of(usuarios).map(this::fetchGrupos).orElse(Collections.emptyList());
    }

    Usuario fetchGrupos(Usuario result) {
        return entityManager
            .createQuery("select usuario from Usuario usuario left join fetch usuario.grupos where usuario is :usuario", Usuario.class)
            .setParameter("usuario", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Usuario> fetchGrupos(List<Usuario> usuarios) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, usuarios.size()).forEach(index -> order.put(usuarios.get(index).getId(), index));
        List<Usuario> result = entityManager
            .createQuery(
                "select distinct usuario from Usuario usuario left join fetch usuario.grupos where usuario in :usuarios",
                Usuario.class
            )
            .setParameter("usuarios", usuarios)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
