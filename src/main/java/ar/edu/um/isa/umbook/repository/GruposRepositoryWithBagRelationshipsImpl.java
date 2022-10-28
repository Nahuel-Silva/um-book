package ar.edu.um.isa.umbook.repository;

import ar.edu.um.isa.umbook.domain.Grupos;
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
public class GruposRepositoryWithBagRelationshipsImpl implements GruposRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Grupos> fetchBagRelationships(Optional<Grupos> grupos) {
        return grupos.map(this::fetchAlbums);
    }

    @Override
    public Page<Grupos> fetchBagRelationships(Page<Grupos> grupos) {
        return new PageImpl<>(fetchBagRelationships(grupos.getContent()), grupos.getPageable(), grupos.getTotalElements());
    }

    @Override
    public List<Grupos> fetchBagRelationships(List<Grupos> grupos) {
        return Optional.of(grupos).map(this::fetchAlbums).orElse(Collections.emptyList());
    }

    Grupos fetchAlbums(Grupos result) {
        return entityManager
            .createQuery("select grupos from Grupos grupos left join fetch grupos.albums where grupos is :grupos", Grupos.class)
            .setParameter("grupos", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Grupos> fetchAlbums(List<Grupos> grupos) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, grupos.size()).forEach(index -> order.put(grupos.get(index).getId(), index));
        List<Grupos> result = entityManager
            .createQuery("select distinct grupos from Grupos grupos left join fetch grupos.albums where grupos in :grupos", Grupos.class)
            .setParameter("grupos", grupos)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
