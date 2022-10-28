package ar.edu.um.isa.umbook.web.rest;

import ar.edu.um.isa.umbook.domain.Notificaciones;
import ar.edu.um.isa.umbook.repository.NotificacionesRepository;
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
 * REST controller for managing {@link ar.edu.um.isa.umbook.domain.Notificaciones}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class NotificacionesResource {

    private final Logger log = LoggerFactory.getLogger(NotificacionesResource.class);

    private static final String ENTITY_NAME = "notificaciones";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NotificacionesRepository notificacionesRepository;

    public NotificacionesResource(NotificacionesRepository notificacionesRepository) {
        this.notificacionesRepository = notificacionesRepository;
    }

    /**
     * {@code POST  /notificaciones} : Create a new notificaciones.
     *
     * @param notificaciones the notificaciones to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new notificaciones, or with status {@code 400 (Bad Request)} if the notificaciones has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/notificaciones")
    public ResponseEntity<Notificaciones> createNotificaciones(@RequestBody Notificaciones notificaciones) throws URISyntaxException {
        log.debug("REST request to save Notificaciones : {}", notificaciones);
        if (notificaciones.getId() != null) {
            throw new BadRequestAlertException("A new notificaciones cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Notificaciones result = notificacionesRepository.save(notificaciones);
        return ResponseEntity
            .created(new URI("/api/notificaciones/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /notificaciones/:id} : Updates an existing notificaciones.
     *
     * @param id the id of the notificaciones to save.
     * @param notificaciones the notificaciones to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated notificaciones,
     * or with status {@code 400 (Bad Request)} if the notificaciones is not valid,
     * or with status {@code 500 (Internal Server Error)} if the notificaciones couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/notificaciones/{id}")
    public ResponseEntity<Notificaciones> updateNotificaciones(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Notificaciones notificaciones
    ) throws URISyntaxException {
        log.debug("REST request to update Notificaciones : {}, {}", id, notificaciones);
        if (notificaciones.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, notificaciones.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!notificacionesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Notificaciones result = notificacionesRepository.save(notificaciones);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, notificaciones.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /notificaciones/:id} : Partial updates given fields of an existing notificaciones, field will ignore if it is null
     *
     * @param id the id of the notificaciones to save.
     * @param notificaciones the notificaciones to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated notificaciones,
     * or with status {@code 400 (Bad Request)} if the notificaciones is not valid,
     * or with status {@code 404 (Not Found)} if the notificaciones is not found,
     * or with status {@code 500 (Internal Server Error)} if the notificaciones couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/notificaciones/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Notificaciones> partialUpdateNotificaciones(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Notificaciones notificaciones
    ) throws URISyntaxException {
        log.debug("REST request to partial update Notificaciones partially : {}, {}", id, notificaciones);
        if (notificaciones.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, notificaciones.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!notificacionesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Notificaciones> result = notificacionesRepository
            .findById(notificaciones.getId())
            .map(existingNotificaciones -> {
                if (notificaciones.getTipoNotificacion() != null) {
                    existingNotificaciones.setTipoNotificacion(notificaciones.getTipoNotificacion());
                }

                return existingNotificaciones;
            })
            .map(notificacionesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, notificaciones.getId().toString())
        );
    }

    /**
     * {@code GET  /notificaciones} : get all the notificaciones.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of notificaciones in body.
     */
    @GetMapping("/notificaciones")
    public List<Notificaciones> getAllNotificaciones() {
        log.debug("REST request to get all Notificaciones");
        return notificacionesRepository.findAll();
    }

    /**
     * {@code GET  /notificaciones/:id} : get the "id" notificaciones.
     *
     * @param id the id of the notificaciones to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the notificaciones, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/notificaciones/{id}")
    public ResponseEntity<Notificaciones> getNotificaciones(@PathVariable Long id) {
        log.debug("REST request to get Notificaciones : {}", id);
        Optional<Notificaciones> notificaciones = notificacionesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(notificaciones);
    }

    /**
     * {@code DELETE  /notificaciones/:id} : delete the "id" notificaciones.
     *
     * @param id the id of the notificaciones to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/notificaciones/{id}")
    public ResponseEntity<Void> deleteNotificaciones(@PathVariable Long id) {
        log.debug("REST request to delete Notificaciones : {}", id);
        notificacionesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
