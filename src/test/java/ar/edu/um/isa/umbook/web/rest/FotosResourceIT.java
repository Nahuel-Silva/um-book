package ar.edu.um.isa.umbook.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import ar.edu.um.isa.umbook.IntegrationTest;
import ar.edu.um.isa.umbook.domain.Fotos;
import ar.edu.um.isa.umbook.repository.FotosRepository;
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
 * Integration tests for the {@link FotosResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FotosResourceIT {

    private static final String DEFAULT_DESCRIPCION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPCION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/fotos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FotosRepository fotosRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFotosMockMvc;

    private Fotos fotos;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Fotos createEntity(EntityManager em) {
        Fotos fotos = new Fotos().descripcion(DEFAULT_DESCRIPCION);
        return fotos;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Fotos createUpdatedEntity(EntityManager em) {
        Fotos fotos = new Fotos().descripcion(UPDATED_DESCRIPCION);
        return fotos;
    }

    @BeforeEach
    public void initTest() {
        fotos = createEntity(em);
    }

    @Test
    @Transactional
    void createFotos() throws Exception {
        int databaseSizeBeforeCreate = fotosRepository.findAll().size();
        // Create the Fotos
        restFotosMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fotos)))
            .andExpect(status().isCreated());

        // Validate the Fotos in the database
        List<Fotos> fotosList = fotosRepository.findAll();
        assertThat(fotosList).hasSize(databaseSizeBeforeCreate + 1);
        Fotos testFotos = fotosList.get(fotosList.size() - 1);
        assertThat(testFotos.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
    }

    @Test
    @Transactional
    void createFotosWithExistingId() throws Exception {
        // Create the Fotos with an existing ID
        fotos.setId(1L);

        int databaseSizeBeforeCreate = fotosRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFotosMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fotos)))
            .andExpect(status().isBadRequest());

        // Validate the Fotos in the database
        List<Fotos> fotosList = fotosRepository.findAll();
        assertThat(fotosList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFotos() throws Exception {
        // Initialize the database
        fotosRepository.saveAndFlush(fotos);

        // Get all the fotosList
        restFotosMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fotos.getId().intValue())))
            .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION)));
    }

    @Test
    @Transactional
    void getFotos() throws Exception {
        // Initialize the database
        fotosRepository.saveAndFlush(fotos);

        // Get the fotos
        restFotosMockMvc
            .perform(get(ENTITY_API_URL_ID, fotos.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(fotos.getId().intValue()))
            .andExpect(jsonPath("$.descripcion").value(DEFAULT_DESCRIPCION));
    }

    @Test
    @Transactional
    void getNonExistingFotos() throws Exception {
        // Get the fotos
        restFotosMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFotos() throws Exception {
        // Initialize the database
        fotosRepository.saveAndFlush(fotos);

        int databaseSizeBeforeUpdate = fotosRepository.findAll().size();

        // Update the fotos
        Fotos updatedFotos = fotosRepository.findById(fotos.getId()).get();
        // Disconnect from session so that the updates on updatedFotos are not directly saved in db
        em.detach(updatedFotos);
        updatedFotos.descripcion(UPDATED_DESCRIPCION);

        restFotosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFotos.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFotos))
            )
            .andExpect(status().isOk());

        // Validate the Fotos in the database
        List<Fotos> fotosList = fotosRepository.findAll();
        assertThat(fotosList).hasSize(databaseSizeBeforeUpdate);
        Fotos testFotos = fotosList.get(fotosList.size() - 1);
        assertThat(testFotos.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
    }

    @Test
    @Transactional
    void putNonExistingFotos() throws Exception {
        int databaseSizeBeforeUpdate = fotosRepository.findAll().size();
        fotos.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFotosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, fotos.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(fotos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fotos in the database
        List<Fotos> fotosList = fotosRepository.findAll();
        assertThat(fotosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFotos() throws Exception {
        int databaseSizeBeforeUpdate = fotosRepository.findAll().size();
        fotos.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFotosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(fotos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fotos in the database
        List<Fotos> fotosList = fotosRepository.findAll();
        assertThat(fotosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFotos() throws Exception {
        int databaseSizeBeforeUpdate = fotosRepository.findAll().size();
        fotos.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFotosMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(fotos)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Fotos in the database
        List<Fotos> fotosList = fotosRepository.findAll();
        assertThat(fotosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFotosWithPatch() throws Exception {
        // Initialize the database
        fotosRepository.saveAndFlush(fotos);

        int databaseSizeBeforeUpdate = fotosRepository.findAll().size();

        // Update the fotos using partial update
        Fotos partialUpdatedFotos = new Fotos();
        partialUpdatedFotos.setId(fotos.getId());

        partialUpdatedFotos.descripcion(UPDATED_DESCRIPCION);

        restFotosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFotos.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFotos))
            )
            .andExpect(status().isOk());

        // Validate the Fotos in the database
        List<Fotos> fotosList = fotosRepository.findAll();
        assertThat(fotosList).hasSize(databaseSizeBeforeUpdate);
        Fotos testFotos = fotosList.get(fotosList.size() - 1);
        assertThat(testFotos.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
    }

    @Test
    @Transactional
    void fullUpdateFotosWithPatch() throws Exception {
        // Initialize the database
        fotosRepository.saveAndFlush(fotos);

        int databaseSizeBeforeUpdate = fotosRepository.findAll().size();

        // Update the fotos using partial update
        Fotos partialUpdatedFotos = new Fotos();
        partialUpdatedFotos.setId(fotos.getId());

        partialUpdatedFotos.descripcion(UPDATED_DESCRIPCION);

        restFotosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFotos.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFotos))
            )
            .andExpect(status().isOk());

        // Validate the Fotos in the database
        List<Fotos> fotosList = fotosRepository.findAll();
        assertThat(fotosList).hasSize(databaseSizeBeforeUpdate);
        Fotos testFotos = fotosList.get(fotosList.size() - 1);
        assertThat(testFotos.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
    }

    @Test
    @Transactional
    void patchNonExistingFotos() throws Exception {
        int databaseSizeBeforeUpdate = fotosRepository.findAll().size();
        fotos.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFotosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, fotos.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fotos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fotos in the database
        List<Fotos> fotosList = fotosRepository.findAll();
        assertThat(fotosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFotos() throws Exception {
        int databaseSizeBeforeUpdate = fotosRepository.findAll().size();
        fotos.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFotosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(fotos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Fotos in the database
        List<Fotos> fotosList = fotosRepository.findAll();
        assertThat(fotosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFotos() throws Exception {
        int databaseSizeBeforeUpdate = fotosRepository.findAll().size();
        fotos.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFotosMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(fotos)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Fotos in the database
        List<Fotos> fotosList = fotosRepository.findAll();
        assertThat(fotosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFotos() throws Exception {
        // Initialize the database
        fotosRepository.saveAndFlush(fotos);

        int databaseSizeBeforeDelete = fotosRepository.findAll().size();

        // Delete the fotos
        restFotosMockMvc
            .perform(delete(ENTITY_API_URL_ID, fotos.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Fotos> fotosList = fotosRepository.findAll();
        assertThat(fotosList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
