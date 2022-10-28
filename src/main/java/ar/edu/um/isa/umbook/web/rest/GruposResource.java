package ar.edu.um.isa.umbook.web.rest;

import ar.edu.um.isa.umbook.domain.Grupos;
import ar.edu.um.isa.umbook.repository.GruposRepository;
import ar.edu.um.isa.umbook.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link ar.edu.um.isa.umbook.domain.Grupos}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GruposResource {

    private final Logger log = LoggerFactory.getLogger(GruposResource.class);

    private static final String ENTITY_NAME = "grupos";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GruposRepository gruposRepository;

    public GruposResource(GruposRepository gruposRepository) {
        this.gruposRepository = gruposRepository;
    }

    /**
     * {@code POST  /grupos} : Create a new grupos.
     *
     * @param grupos the grupos to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new grupos, or with status {@code 400 (Bad Request)} if the grupos has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/grupos")
    public ResponseEntity<Grupos> createGrupos(@RequestBody Grupos grupos) throws URISyntaxException {
        log.debug("REST request to save Grupos : {}", grupos);
        if (grupos.getId() != null) {
            throw new BadRequestAlertException("A new grupos cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Grupos result = gruposRepository.save(grupos);
        return ResponseEntity
            .created(new URI("/api/grupos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /grupos/:id} : Updates an existing grupos.
     *
     * @param id the id of the grupos to save.
     * @param grupos the grupos to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grupos,
     * or with status {@code 400 (Bad Request)} if the grupos is not valid,
     * or with status {@code 500 (Internal Server Error)} if the grupos couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/grupos/{id}")
    public ResponseEntity<Grupos> updateGrupos(@PathVariable(value = "id", required = false) final Long id, @RequestBody Grupos grupos)
        throws URISyntaxException {
        log.debug("REST request to update Grupos : {}, {}", id, grupos);
        if (grupos.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grupos.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gruposRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Grupos result = gruposRepository.save(grupos);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, grupos.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /grupos/:id} : Partial updates given fields of an existing grupos, field will ignore if it is null
     *
     * @param id the id of the grupos to save.
     * @param grupos the grupos to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated grupos,
     * or with status {@code 400 (Bad Request)} if the grupos is not valid,
     * or with status {@code 404 (Not Found)} if the grupos is not found,
     * or with status {@code 500 (Internal Server Error)} if the grupos couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/grupos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Grupos> partialUpdateGrupos(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Grupos grupos
    ) throws URISyntaxException {
        log.debug("REST request to partial update Grupos partially : {}, {}", id, grupos);
        if (grupos.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, grupos.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gruposRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Grupos> result = gruposRepository
            .findById(grupos.getId())
            .map(existingGrupos -> {
                if (grupos.getNombre() != null) {
                    existingGrupos.setNombre(grupos.getNombre());
                }
                if (grupos.getCantPersonas() != null) {
                    existingGrupos.setCantPersonas(grupos.getCantPersonas());
                }

                return existingGrupos;
            })
            .map(gruposRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, grupos.getId().toString())
        );
    }

    /**
     * {@code GET  /grupos} : get all the grupos.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of grupos in body.
     */
    @GetMapping("/grupos")
    public List<Grupos> getAllGrupos(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Grupos");
        if (eagerload) {
            return gruposRepository.findAllWithEagerRelationships();
        } else {
            return gruposRepository.findAll();
        }
    }

    /**
     * {@code GET  /grupos/:id} : get the "id" grupos.
     *
     * @param id the id of the grupos to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the grupos, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/grupos/{id}")
    public ResponseEntity<Grupos> getGrupos(@PathVariable Long id) {
        log.debug("REST request to get Grupos : {}", id);
        Optional<Grupos> grupos = gruposRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(grupos);
    }

    /**
     * {@code DELETE  /grupos/:id} : delete the "id" grupos.
     *
     * @param id the id of the grupos to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/grupos/{id}")
    public ResponseEntity<Void> deleteGrupos(@PathVariable Long id) {
        log.debug("REST request to delete Grupos : {}", id);
        gruposRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
