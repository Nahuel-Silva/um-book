package ar.edu.um.isa.umbook.web.rest;

import ar.edu.um.isa.umbook.domain.Fotos;
import ar.edu.um.isa.umbook.repository.FotosRepository;
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
 * REST controller for managing {@link ar.edu.um.isa.umbook.domain.Fotos}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FotosResource {

    private final Logger log = LoggerFactory.getLogger(FotosResource.class);

    private static final String ENTITY_NAME = "fotos";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FotosRepository fotosRepository;

    public FotosResource(FotosRepository fotosRepository) {
        this.fotosRepository = fotosRepository;
    }

    /**
     * {@code POST  /fotos} : Create a new fotos.
     *
     * @param fotos the fotos to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new fotos, or with status {@code 400 (Bad Request)} if the fotos has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fotos")
    public ResponseEntity<Fotos> createFotos(@RequestBody Fotos fotos) throws URISyntaxException {
        log.debug("REST request to save Fotos : {}", fotos);
        if (fotos.getId() != null) {
            throw new BadRequestAlertException("A new fotos cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Fotos result = fotosRepository.save(fotos);
        return ResponseEntity
            .created(new URI("/api/fotos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fotos/:id} : Updates an existing fotos.
     *
     * @param id the id of the fotos to save.
     * @param fotos the fotos to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fotos,
     * or with status {@code 400 (Bad Request)} if the fotos is not valid,
     * or with status {@code 500 (Internal Server Error)} if the fotos couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fotos/{id}")
    public ResponseEntity<Fotos> updateFotos(@PathVariable(value = "id", required = false) final Long id, @RequestBody Fotos fotos)
        throws URISyntaxException {
        log.debug("REST request to update Fotos : {}, {}", id, fotos);
        if (fotos.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fotos.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fotosRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Fotos result = fotosRepository.save(fotos);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fotos.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /fotos/:id} : Partial updates given fields of an existing fotos, field will ignore if it is null
     *
     * @param id the id of the fotos to save.
     * @param fotos the fotos to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fotos,
     * or with status {@code 400 (Bad Request)} if the fotos is not valid,
     * or with status {@code 404 (Not Found)} if the fotos is not found,
     * or with status {@code 500 (Internal Server Error)} if the fotos couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/fotos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Fotos> partialUpdateFotos(@PathVariable(value = "id", required = false) final Long id, @RequestBody Fotos fotos)
        throws URISyntaxException {
        log.debug("REST request to partial update Fotos partially : {}, {}", id, fotos);
        if (fotos.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fotos.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fotosRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Fotos> result = fotosRepository
            .findById(fotos.getId())
            .map(existingFotos -> {
                if (fotos.getDescripcion() != null) {
                    existingFotos.setDescripcion(fotos.getDescripcion());
                }

                return existingFotos;
            })
            .map(fotosRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fotos.getId().toString())
        );
    }

    /**
     * {@code GET  /fotos} : get all the fotos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fotos in body.
     */
    @GetMapping("/fotos")
    public List<Fotos> getAllFotos() {
        log.debug("REST request to get all Fotos");
        return fotosRepository.findAll();
    }

    /**
     * {@code GET  /fotos/:id} : get the "id" fotos.
     *
     * @param id the id of the fotos to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the fotos, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fotos/{id}")
    public ResponseEntity<Fotos> getFotos(@PathVariable Long id) {
        log.debug("REST request to get Fotos : {}", id);
        Optional<Fotos> fotos = fotosRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(fotos);
    }

    /**
     * {@code DELETE  /fotos/:id} : delete the "id" fotos.
     *
     * @param id the id of the fotos to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fotos/{id}")
    public ResponseEntity<Void> deleteFotos(@PathVariable Long id) {
        log.debug("REST request to delete Fotos : {}", id);
        fotosRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
