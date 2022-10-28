package ar.edu.um.isa.umbook.web.rest;

import ar.edu.um.isa.umbook.domain.Amigos;
import ar.edu.um.isa.umbook.repository.AmigosRepository;
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
 * REST controller for managing {@link ar.edu.um.isa.umbook.domain.Amigos}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AmigosResource {

    private final Logger log = LoggerFactory.getLogger(AmigosResource.class);

    private static final String ENTITY_NAME = "amigos";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AmigosRepository amigosRepository;

    public AmigosResource(AmigosRepository amigosRepository) {
        this.amigosRepository = amigosRepository;
    }

    /**
     * {@code POST  /amigos} : Create a new amigos.
     *
     * @param amigos the amigos to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new amigos, or with status {@code 400 (Bad Request)} if the amigos has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/amigos")
    public ResponseEntity<Amigos> createAmigos(@RequestBody Amigos amigos) throws URISyntaxException {
        log.debug("REST request to save Amigos : {}", amigos);
        if (amigos.getId() != null) {
            throw new BadRequestAlertException("A new amigos cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Amigos result = amigosRepository.save(amigos);
        return ResponseEntity
            .created(new URI("/api/amigos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /amigos/:id} : Updates an existing amigos.
     *
     * @param id the id of the amigos to save.
     * @param amigos the amigos to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated amigos,
     * or with status {@code 400 (Bad Request)} if the amigos is not valid,
     * or with status {@code 500 (Internal Server Error)} if the amigos couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/amigos/{id}")
    public ResponseEntity<Amigos> updateAmigos(@PathVariable(value = "id", required = false) final Long id, @RequestBody Amigos amigos)
        throws URISyntaxException {
        log.debug("REST request to update Amigos : {}, {}", id, amigos);
        if (amigos.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, amigos.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!amigosRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Amigos result = amigosRepository.save(amigos);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, amigos.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /amigos/:id} : Partial updates given fields of an existing amigos, field will ignore if it is null
     *
     * @param id the id of the amigos to save.
     * @param amigos the amigos to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated amigos,
     * or with status {@code 400 (Bad Request)} if the amigos is not valid,
     * or with status {@code 404 (Not Found)} if the amigos is not found,
     * or with status {@code 500 (Internal Server Error)} if the amigos couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/amigos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Amigos> partialUpdateAmigos(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Amigos amigos
    ) throws URISyntaxException {
        log.debug("REST request to partial update Amigos partially : {}, {}", id, amigos);
        if (amigos.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, amigos.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!amigosRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Amigos> result = amigosRepository
            .findById(amigos.getId())
            .map(existingAmigos -> {
                if (amigos.getCantidad() != null) {
                    existingAmigos.setCantidad(amigos.getCantidad());
                }
                if (amigos.getAmigosComun() != null) {
                    existingAmigos.setAmigosComun(amigos.getAmigosComun());
                }

                return existingAmigos;
            })
            .map(amigosRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, amigos.getId().toString())
        );
    }

    /**
     * {@code GET  /amigos} : get all the amigos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of amigos in body.
     */
    @GetMapping("/amigos")
    public List<Amigos> getAllAmigos() {
        log.debug("REST request to get all Amigos");
        return amigosRepository.findAll();
    }

    /**
     * {@code GET  /amigos/:id} : get the "id" amigos.
     *
     * @param id the id of the amigos to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the amigos, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/amigos/{id}")
    public ResponseEntity<Amigos> getAmigos(@PathVariable Long id) {
        log.debug("REST request to get Amigos : {}", id);
        Optional<Amigos> amigos = amigosRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(amigos);
    }

    /**
     * {@code DELETE  /amigos/:id} : delete the "id" amigos.
     *
     * @param id the id of the amigos to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/amigos/{id}")
    public ResponseEntity<Void> deleteAmigos(@PathVariable Long id) {
        log.debug("REST request to delete Amigos : {}", id);
        amigosRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
