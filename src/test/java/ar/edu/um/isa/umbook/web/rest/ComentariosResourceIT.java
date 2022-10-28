package ar.edu.um.isa.umbook.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import ar.edu.um.isa.umbook.IntegrationTest;
import ar.edu.um.isa.umbook.domain.Comentarios;
import ar.edu.um.isa.umbook.repository.ComentariosRepository;
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
 * Integration tests for the {@link ComentariosResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ComentariosResourceIT {

    private static final String DEFAULT_DESCRIPCION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPCION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/comentarios";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ComentariosRepository comentariosRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restComentariosMockMvc;

    private Comentarios comentarios;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Comentarios createEntity(EntityManager em) {
        Comentarios comentarios = new Comentarios().descripcion(DEFAULT_DESCRIPCION);
        return comentarios;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Comentarios createUpdatedEntity(EntityManager em) {
        Comentarios comentarios = new Comentarios().descripcion(UPDATED_DESCRIPCION);
        return comentarios;
    }

    @BeforeEach
    public void initTest() {
        comentarios = createEntity(em);
    }

    @Test
    @Transactional
    void createComentarios() throws Exception {
        int databaseSizeBeforeCreate = comentariosRepository.findAll().size();
        // Create the Comentarios
        restComentariosMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(comentarios)))
            .andExpect(status().isCreated());

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll();
        assertThat(comentariosList).hasSize(databaseSizeBeforeCreate + 1);
        Comentarios testComentarios = comentariosList.get(comentariosList.size() - 1);
        assertThat(testComentarios.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
    }

    @Test
    @Transactional
    void createComentariosWithExistingId() throws Exception {
        // Create the Comentarios with an existing ID
        comentarios.setId(1L);

        int databaseSizeBeforeCreate = comentariosRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restComentariosMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(comentarios)))
            .andExpect(status().isBadRequest());

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll();
        assertThat(comentariosList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllComentarios() throws Exception {
        // Initialize the database
        comentariosRepository.saveAndFlush(comentarios);

        // Get all the comentariosList
        restComentariosMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(comentarios.getId().intValue())))
            .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION)));
    }

    @Test
    @Transactional
    void getComentarios() throws Exception {
        // Initialize the database
        comentariosRepository.saveAndFlush(comentarios);

        // Get the comentarios
        restComentariosMockMvc
            .perform(get(ENTITY_API_URL_ID, comentarios.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(comentarios.getId().intValue()))
            .andExpect(jsonPath("$.descripcion").value(DEFAULT_DESCRIPCION));
    }

    @Test
    @Transactional
    void getNonExistingComentarios() throws Exception {
        // Get the comentarios
        restComentariosMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewComentarios() throws Exception {
        // Initialize the database
        comentariosRepository.saveAndFlush(comentarios);

        int databaseSizeBeforeUpdate = comentariosRepository.findAll().size();

        // Update the comentarios
        Comentarios updatedComentarios = comentariosRepository.findById(comentarios.getId()).get();
        // Disconnect from session so that the updates on updatedComentarios are not directly saved in db
        em.detach(updatedComentarios);
        updatedComentarios.descripcion(UPDATED_DESCRIPCION);

        restComentariosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedComentarios.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedComentarios))
            )
            .andExpect(status().isOk());

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll();
        assertThat(comentariosList).hasSize(databaseSizeBeforeUpdate);
        Comentarios testComentarios = comentariosList.get(comentariosList.size() - 1);
        assertThat(testComentarios.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
    }

    @Test
    @Transactional
    void putNonExistingComentarios() throws Exception {
        int databaseSizeBeforeUpdate = comentariosRepository.findAll().size();
        comentarios.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restComentariosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, comentarios.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(comentarios))
            )
            .andExpect(status().isBadRequest());

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll();
        assertThat(comentariosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchComentarios() throws Exception {
        int databaseSizeBeforeUpdate = comentariosRepository.findAll().size();
        comentarios.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restComentariosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(comentarios))
            )
            .andExpect(status().isBadRequest());

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll();
        assertThat(comentariosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamComentarios() throws Exception {
        int databaseSizeBeforeUpdate = comentariosRepository.findAll().size();
        comentarios.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restComentariosMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(comentarios)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll();
        assertThat(comentariosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateComentariosWithPatch() throws Exception {
        // Initialize the database
        comentariosRepository.saveAndFlush(comentarios);

        int databaseSizeBeforeUpdate = comentariosRepository.findAll().size();

        // Update the comentarios using partial update
        Comentarios partialUpdatedComentarios = new Comentarios();
        partialUpdatedComentarios.setId(comentarios.getId());

        restComentariosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedComentarios.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedComentarios))
            )
            .andExpect(status().isOk());

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll();
        assertThat(comentariosList).hasSize(databaseSizeBeforeUpdate);
        Comentarios testComentarios = comentariosList.get(comentariosList.size() - 1);
        assertThat(testComentarios.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
    }

    @Test
    @Transactional
    void fullUpdateComentariosWithPatch() throws Exception {
        // Initialize the database
        comentariosRepository.saveAndFlush(comentarios);

        int databaseSizeBeforeUpdate = comentariosRepository.findAll().size();

        // Update the comentarios using partial update
        Comentarios partialUpdatedComentarios = new Comentarios();
        partialUpdatedComentarios.setId(comentarios.getId());

        partialUpdatedComentarios.descripcion(UPDATED_DESCRIPCION);

        restComentariosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedComentarios.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedComentarios))
            )
            .andExpect(status().isOk());

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll();
        assertThat(comentariosList).hasSize(databaseSizeBeforeUpdate);
        Comentarios testComentarios = comentariosList.get(comentariosList.size() - 1);
        assertThat(testComentarios.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
    }

    @Test
    @Transactional
    void patchNonExistingComentarios() throws Exception {
        int databaseSizeBeforeUpdate = comentariosRepository.findAll().size();
        comentarios.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restComentariosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, comentarios.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(comentarios))
            )
            .andExpect(status().isBadRequest());

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll();
        assertThat(comentariosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchComentarios() throws Exception {
        int databaseSizeBeforeUpdate = comentariosRepository.findAll().size();
        comentarios.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restComentariosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(comentarios))
            )
            .andExpect(status().isBadRequest());

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll();
        assertThat(comentariosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamComentarios() throws Exception {
        int databaseSizeBeforeUpdate = comentariosRepository.findAll().size();
        comentarios.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restComentariosMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(comentarios))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll();
        assertThat(comentariosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteComentarios() throws Exception {
        // Initialize the database
        comentariosRepository.saveAndFlush(comentarios);

        int databaseSizeBeforeDelete = comentariosRepository.findAll().size();

        // Delete the comentarios
        restComentariosMockMvc
            .perform(delete(ENTITY_API_URL_ID, comentarios.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Comentarios> comentariosList = comentariosRepository.findAll();
        assertThat(comentariosList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
