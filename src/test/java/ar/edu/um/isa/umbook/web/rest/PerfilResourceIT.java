package ar.edu.um.isa.umbook.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import ar.edu.um.isa.umbook.IntegrationTest;
import ar.edu.um.isa.umbook.domain.Perfil;
import ar.edu.um.isa.umbook.repository.PerfilRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PerfilResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PerfilResourceIT {

    private static final Integer DEFAULT_CANT_ALBUMES = 1;
    private static final Integer UPDATED_CANT_ALBUMES = 2;

    private static final Integer DEFAULT_CANT_SEGUIDORES = 1;
    private static final Integer UPDATED_CANT_SEGUIDORES = 2;

    private static final Integer DEFAULT_CANT_SEGUIDOS = 1;
    private static final Integer UPDATED_CANT_SEGUIDOS = 2;

    private static final String DEFAULT_DESCRIPCION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPCION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/perfils";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPerfilMockMvc;

    private Perfil perfil;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Perfil createEntity(EntityManager em) {
        Perfil perfil = new Perfil()
            .cantAlbumes(DEFAULT_CANT_ALBUMES)
            .cantSeguidores(DEFAULT_CANT_SEGUIDORES)
            .cantSeguidos(DEFAULT_CANT_SEGUIDOS)
            .descripcion(DEFAULT_DESCRIPCION);
        return perfil;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Perfil createUpdatedEntity(EntityManager em) {
        Perfil perfil = new Perfil()
            .cantAlbumes(UPDATED_CANT_ALBUMES)
            .cantSeguidores(UPDATED_CANT_SEGUIDORES)
            .cantSeguidos(UPDATED_CANT_SEGUIDOS)
            .descripcion(UPDATED_DESCRIPCION);
        return perfil;
    }

    @BeforeEach
    public void initTest() {
        perfil = createEntity(em);
    }

    @Test
    @Transactional
    void createPerfil() throws Exception {
        int databaseSizeBeforeCreate = perfilRepository.findAll().size();
        // Create the Perfil
        restPerfilMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(perfil)))
            .andExpect(status().isCreated());

        // Validate the Perfil in the database
        List<Perfil> perfilList = perfilRepository.findAll();
        assertThat(perfilList).hasSize(databaseSizeBeforeCreate + 1);
        Perfil testPerfil = perfilList.get(perfilList.size() - 1);
        assertThat(testPerfil.getCantAlbumes()).isEqualTo(DEFAULT_CANT_ALBUMES);
        assertThat(testPerfil.getCantSeguidores()).isEqualTo(DEFAULT_CANT_SEGUIDORES);
        assertThat(testPerfil.getCantSeguidos()).isEqualTo(DEFAULT_CANT_SEGUIDOS);
        assertThat(testPerfil.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
    }

    @Test
    @Transactional
    void createPerfilWithExistingId() throws Exception {
        // Create the Perfil with an existing ID
        perfil.setId(1L);

        int databaseSizeBeforeCreate = perfilRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPerfilMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(perfil)))
            .andExpect(status().isBadRequest());

        // Validate the Perfil in the database
        List<Perfil> perfilList = perfilRepository.findAll();
        assertThat(perfilList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPerfils() throws Exception {
        // Initialize the database
        perfilRepository.saveAndFlush(perfil);

        // Get all the perfilList
        restPerfilMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(perfil.getId().intValue())))
            .andExpect(jsonPath("$.[*].cantAlbumes").value(hasItem(DEFAULT_CANT_ALBUMES)))
            .andExpect(jsonPath("$.[*].cantSeguidores").value(hasItem(DEFAULT_CANT_SEGUIDORES)))
            .andExpect(jsonPath("$.[*].cantSeguidos").value(hasItem(DEFAULT_CANT_SEGUIDOS)))
            .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION)));
    }

    @Test
    @Transactional
    void getPerfil() throws Exception {
        // Initialize the database
        perfilRepository.saveAndFlush(perfil);

        // Get the perfil
        restPerfilMockMvc
            .perform(get(ENTITY_API_URL_ID, perfil.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(perfil.getId().intValue()))
            .andExpect(jsonPath("$.cantAlbumes").value(DEFAULT_CANT_ALBUMES))
            .andExpect(jsonPath("$.cantSeguidores").value(DEFAULT_CANT_SEGUIDORES))
            .andExpect(jsonPath("$.cantSeguidos").value(DEFAULT_CANT_SEGUIDOS))
            .andExpect(jsonPath("$.descripcion").value(DEFAULT_DESCRIPCION));
    }

    @Test
    @Transactional
    void getNonExistingPerfil() throws Exception {
        // Get the perfil
        restPerfilMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPerfil() throws Exception {
        // Initialize the database
        perfilRepository.saveAndFlush(perfil);

        int databaseSizeBeforeUpdate = perfilRepository.findAll().size();

        // Update the perfil
        Perfil updatedPerfil = perfilRepository.findById(perfil.getId()).get();
        // Disconnect from session so that the updates on updatedPerfil are not directly saved in db
        em.detach(updatedPerfil);
        updatedPerfil
            .cantAlbumes(UPDATED_CANT_ALBUMES)
            .cantSeguidores(UPDATED_CANT_SEGUIDORES)
            .cantSeguidos(UPDATED_CANT_SEGUIDOS)
            .descripcion(UPDATED_DESCRIPCION);

        restPerfilMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPerfil.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPerfil))
            )
            .andExpect(status().isOk());

        // Validate the Perfil in the database
        List<Perfil> perfilList = perfilRepository.findAll();
        assertThat(perfilList).hasSize(databaseSizeBeforeUpdate);
        Perfil testPerfil = perfilList.get(perfilList.size() - 1);
        assertThat(testPerfil.getCantAlbumes()).isEqualTo(UPDATED_CANT_ALBUMES);
        assertThat(testPerfil.getCantSeguidores()).isEqualTo(UPDATED_CANT_SEGUIDORES);
        assertThat(testPerfil.getCantSeguidos()).isEqualTo(UPDATED_CANT_SEGUIDOS);
        assertThat(testPerfil.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
    }

    @Test
    @Transactional
    void putNonExistingPerfil() throws Exception {
        int databaseSizeBeforeUpdate = perfilRepository.findAll().size();
        perfil.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPerfilMockMvc
            .perform(
                put(ENTITY_API_URL_ID, perfil.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(perfil))
            )
            .andExpect(status().isBadRequest());

        // Validate the Perfil in the database
        List<Perfil> perfilList = perfilRepository.findAll();
        assertThat(perfilList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPerfil() throws Exception {
        int databaseSizeBeforeUpdate = perfilRepository.findAll().size();
        perfil.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPerfilMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(perfil))
            )
            .andExpect(status().isBadRequest());

        // Validate the Perfil in the database
        List<Perfil> perfilList = perfilRepository.findAll();
        assertThat(perfilList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPerfil() throws Exception {
        int databaseSizeBeforeUpdate = perfilRepository.findAll().size();
        perfil.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPerfilMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(perfil)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Perfil in the database
        List<Perfil> perfilList = perfilRepository.findAll();
        assertThat(perfilList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePerfilWithPatch() throws Exception {
        // Initialize the database
        perfilRepository.saveAndFlush(perfil);

        int databaseSizeBeforeUpdate = perfilRepository.findAll().size();

        // Update the perfil using partial update
        Perfil partialUpdatedPerfil = new Perfil();
        partialUpdatedPerfil.setId(perfil.getId());

        partialUpdatedPerfil.descripcion(UPDATED_DESCRIPCION);

        restPerfilMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPerfil.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPerfil))
            )
            .andExpect(status().isOk());

        // Validate the Perfil in the database
        List<Perfil> perfilList = perfilRepository.findAll();
        assertThat(perfilList).hasSize(databaseSizeBeforeUpdate);
        Perfil testPerfil = perfilList.get(perfilList.size() - 1);
        assertThat(testPerfil.getCantAlbumes()).isEqualTo(DEFAULT_CANT_ALBUMES);
        assertThat(testPerfil.getCantSeguidores()).isEqualTo(DEFAULT_CANT_SEGUIDORES);
        assertThat(testPerfil.getCantSeguidos()).isEqualTo(DEFAULT_CANT_SEGUIDOS);
        assertThat(testPerfil.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
    }

    @Test
    @Transactional
    void fullUpdatePerfilWithPatch() throws Exception {
        // Initialize the database
        perfilRepository.saveAndFlush(perfil);

        int databaseSizeBeforeUpdate = perfilRepository.findAll().size();

        // Update the perfil using partial update
        Perfil partialUpdatedPerfil = new Perfil();
        partialUpdatedPerfil.setId(perfil.getId());

        partialUpdatedPerfil
            .cantAlbumes(UPDATED_CANT_ALBUMES)
            .cantSeguidores(UPDATED_CANT_SEGUIDORES)
            .cantSeguidos(UPDATED_CANT_SEGUIDOS)
            .descripcion(UPDATED_DESCRIPCION);

        restPerfilMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPerfil.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPerfil))
            )
            .andExpect(status().isOk());

        // Validate the Perfil in the database
        List<Perfil> perfilList = perfilRepository.findAll();
        assertThat(perfilList).hasSize(databaseSizeBeforeUpdate);
        Perfil testPerfil = perfilList.get(perfilList.size() - 1);
        assertThat(testPerfil.getCantAlbumes()).isEqualTo(UPDATED_CANT_ALBUMES);
        assertThat(testPerfil.getCantSeguidores()).isEqualTo(UPDATED_CANT_SEGUIDORES);
        assertThat(testPerfil.getCantSeguidos()).isEqualTo(UPDATED_CANT_SEGUIDOS);
        assertThat(testPerfil.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
    }

    @Test
    @Transactional
    void patchNonExistingPerfil() throws Exception {
        int databaseSizeBeforeUpdate = perfilRepository.findAll().size();
        perfil.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPerfilMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, perfil.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(perfil))
            )
            .andExpect(status().isBadRequest());

        // Validate the Perfil in the database
        List<Perfil> perfilList = perfilRepository.findAll();
        assertThat(perfilList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPerfil() throws Exception {
        int databaseSizeBeforeUpdate = perfilRepository.findAll().size();
        perfil.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPerfilMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(perfil))
            )
            .andExpect(status().isBadRequest());

        // Validate the Perfil in the database
        List<Perfil> perfilList = perfilRepository.findAll();
        assertThat(perfilList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPerfil() throws Exception {
        int databaseSizeBeforeUpdate = perfilRepository.findAll().size();
        perfil.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPerfilMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(perfil)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Perfil in the database
        List<Perfil> perfilList = perfilRepository.findAll();
        assertThat(perfilList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePerfil() throws Exception {
        // Initialize the database
        perfilRepository.saveAndFlush(perfil);

        int databaseSizeBeforeDelete = perfilRepository.findAll().size();

        // Delete the perfil
        restPerfilMockMvc
            .perform(delete(ENTITY_API_URL_ID, perfil.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Perfil> perfilList = perfilRepository.findAll();
        assertThat(perfilList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
