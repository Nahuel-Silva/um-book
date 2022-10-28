package ar.edu.um.isa.umbook.web.rest;

import ar.edu.um.isa.umbook.domain.Comentarios;
import ar.edu.um.isa.umbook.repository.ComentariosRepository;
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
 * REST controller for managing {@link ar.edu.um.isa.umbook.domain.Comentarios}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ComentariosResource {

    private final Logger log = LoggerFactory.getLogger(ComentariosResource.class);

    private static final String ENTITY_NAME = "comentarios";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ComentariosRepository comentariosRepository;

    public ComentariosResource(ComentariosRepository comentariosRepository) {
        this.comentariosRepository = comentariosRepository;
    }

    /**
     * {@code POST  /comentarios} : Create a new comentarios.
     *
     * @param comentarios the comentarios to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new comentarios, or with status {@code 400 (Bad Request)} if the comentarios has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/comentarios")
    public ResponseEntity<Comentarios> createComentarios(@RequestBody Comentarios comentarios) throws URISyntaxException {
        log.debug("REST request to save Comentarios : {}", comentarios);
        if (comentarios.getId() != null) {
            throw new BadRequestAlertException("A new comentarios cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Comentarios result = comentariosRepository.save(comentarios);
        return ResponseEntity
            .created(new URI("/api/comentarios/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /comentarios/:id} : Updates an existing comentarios.
     *
     * @param id the id of the comentarios to save.
     * @param comentarios the comentarios to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated comentarios,
     * or with status {@code 400 (Bad Request)} if the comentarios is not valid,
     * or with status {@code 500 (Internal Server Error)} if the comentarios couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/comentarios/{id}")
    public ResponseEntity<Comentarios> updateComentarios(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Comentarios comentarios
    ) throws URISyntaxException {
        log.debug("REST request to update Comentarios : {}, {}", id, comentarios);
        if (comentarios.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, comentarios.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!comentariosRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Comentarios result = comentariosRepository.save(comentarios);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, comentarios.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /comentarios/:id} : Partial updates given fields of an existing comentarios, field will ignore if it is null
     *
     * @param id the id of the comentarios to save.
     * @param comentarios the comentarios to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated comentarios,
     * or with status {@code 400 (Bad Request)} if the comentarios is not valid,
     * or with status {@code 404 (Not Found)} if the comentarios is not found,
     * or with status {@code 500 (Internal Server Error)} if the comentarios couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/comentarios/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Comentarios> partialUpdateComentarios(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Comentarios comentarios
    ) throws URISyntaxException {
        log.debug("REST request to partial update Comentarios partially : {}, {}", id, comentarios);
        if (comentarios.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, comentarios.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!comentariosRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Comentarios> result = comentariosRepository
            .findById(comentarios.getId())
            .map(existingComentarios -> {
                if (comentarios.getDescripcion() != null) {
                    existingComentarios.setDescripcion(comentarios.getDescripcion());
                }

                return existingComentarios;
            })
            .map(comentariosRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, comentarios.getId().toString())
        );
    }

    /**
     * {@code GET  /comentarios} : get all the comentarios.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of comentarios in body.
     */
    @GetMapping("/comentarios")
    public List<Comentarios> getAllComentarios() {
        log.debug("REST request to get all Comentarios");
        return comentariosRepository.findAll();
    }

    /**
     * {@code GET  /comentarios/:id} : get the "id" comentarios.
     *
     * @param id the id of the comentarios to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the comentarios, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/comentarios/{id}")
    public ResponseEntity<Comentarios> getComentarios(@PathVariable Long id) {
        log.debug("REST request to get Comentarios : {}", id);
        Optional<Comentarios> comentarios = comentariosRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(comentarios);
    }

    /**
     * {@code DELETE  /comentarios/:id} : delete the "id" comentarios.
     *
     * @param id the id of the comentarios to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/comentarios/{id}")
    public ResponseEntity<Void> deleteComentarios(@PathVariable Long id) {
        log.debug("REST request to delete Comentarios : {}", id);
        comentariosRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
