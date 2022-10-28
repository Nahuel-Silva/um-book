package ar.edu.um.isa.umbook.web.rest;

import ar.edu.um.isa.umbook.domain.Perfil;
import ar.edu.um.isa.umbook.repository.PerfilRepository;
import ar.edu.um.isa.umbook.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link ar.edu.um.isa.umbook.domain.Perfil}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PerfilResource {

    private final Logger log = LoggerFactory.getLogger(PerfilResource.class);

    private static final String ENTITY_NAME = "perfil";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PerfilRepository perfilRepository;

    public PerfilResource(PerfilRepository perfilRepository) {
        this.perfilRepository = perfilRepository;
    }

    /**
     * {@code POST  /perfils} : Create a new perfil.
     *
     * @param perfil the perfil to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new perfil, or with status {@code 400 (Bad Request)} if the perfil has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/perfils")
    public ResponseEntity<Perfil> createPerfil(@RequestBody Perfil perfil) throws URISyntaxException {
        log.debug("REST request to save Perfil : {}", perfil);
        if (perfil.getId() != null) {
            throw new BadRequestAlertException("A new perfil cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Perfil result = perfilRepository.save(perfil);
        return ResponseEntity
            .created(new URI("/api/perfils/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /perfils/:id} : Updates an existing perfil.
     *
     * @param id the id of the perfil to save.
     * @param perfil the perfil to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated perfil,
     * or with status {@code 400 (Bad Request)} if the perfil is not valid,
     * or with status {@code 500 (Internal Server Error)} if the perfil couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/perfils/{id}")
    public ResponseEntity<Perfil> updatePerfil(@PathVariable(value = "id", required = false) final Long id, @RequestBody Perfil perfil)
        throws URISyntaxException {
        log.debug("REST request to update Perfil : {}, {}", id, perfil);
        if (perfil.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, perfil.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!perfilRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Perfil result = perfilRepository.save(perfil);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, perfil.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /perfils/:id} : Partial updates given fields of an existing perfil, field will ignore if it is null
     *
     * @param id the id of the perfil to save.
     * @param perfil the perfil to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated perfil,
     * or with status {@code 400 (Bad Request)} if the perfil is not valid,
     * or with status {@code 404 (Not Found)} if the perfil is not found,
     * or with status {@code 500 (Internal Server Error)} if the perfil couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/perfils/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Perfil> partialUpdatePerfil(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Perfil perfil
    ) throws URISyntaxException {
        log.debug("REST request to partial update Perfil partially : {}, {}", id, perfil);
        if (perfil.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, perfil.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!perfilRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Perfil> result = perfilRepository
            .findById(perfil.getId())
            .map(existingPerfil -> {
                if (perfil.getCantAlbumes() != null) {
                    existingPerfil.setCantAlbumes(perfil.getCantAlbumes());
                }
                if (perfil.getCantSeguidores() != null) {
                    existingPerfil.setCantSeguidores(perfil.getCantSeguidores());
                }
                if (perfil.getCantSeguidos() != null) {
                    existingPerfil.setCantSeguidos(perfil.getCantSeguidos());
                }
                if (perfil.getDescripcion() != null) {
                    existingPerfil.setDescripcion(perfil.getDescripcion());
                }

                return existingPerfil;
            })
            .map(perfilRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, perfil.getId().toString())
        );
    }

    /**
     * {@code GET  /perfils} : get all the perfils.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of perfils in body.
     */
    @GetMapping("/perfils")
    public List<Perfil> getAllPerfils(@RequestParam(required = false) String filter) {
        if ("usuario-is-null".equals(filter)) {
            log.debug("REST request to get all Perfils where usuario is null");
            return StreamSupport
                .stream(perfilRepository.findAll().spliterator(), false)
                .filter(perfil -> perfil.getUsuario() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Perfils");
        return perfilRepository.findAll();
    }

    /**
     * {@code GET  /perfils/:id} : get the "id" perfil.
     *
     * @param id the id of the perfil to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the perfil, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/perfils/{id}")
    public ResponseEntity<Perfil> getPerfil(@PathVariable Long id) {
        log.debug("REST request to get Perfil : {}", id);
        Optional<Perfil> perfil = perfilRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(perfil);
    }

    /**
     * {@code DELETE  /perfils/:id} : delete the "id" perfil.
     *
     * @param id the id of the perfil to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/perfils/{id}")
    public ResponseEntity<Void> deletePerfil(@PathVariable Long id) {
        log.debug("REST request to delete Perfil : {}", id);
        perfilRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
