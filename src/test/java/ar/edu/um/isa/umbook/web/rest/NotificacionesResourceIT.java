package ar.edu.um.isa.umbook.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import ar.edu.um.isa.umbook.IntegrationTest;
import ar.edu.um.isa.umbook.domain.Notificaciones;
import ar.edu.um.isa.umbook.repository.NotificacionesRepository;
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
 * Integration tests for the {@link NotificacionesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class NotificacionesResourceIT {

    private static final String DEFAULT_TIPO_NOTIFICACION = "AAAAAAAAAA";
    private static final String UPDATED_TIPO_NOTIFICACION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/notificaciones";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private NotificacionesRepository notificacionesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restNotificacionesMockMvc;

    private Notificaciones notificaciones;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Notificaciones createEntity(EntityManager em) {
        Notificaciones notificaciones = new Notificaciones().tipoNotificacion(DEFAULT_TIPO_NOTIFICACION);
        return notificaciones;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Notificaciones createUpdatedEntity(EntityManager em) {
        Notificaciones notificaciones = new Notificaciones().tipoNotificacion(UPDATED_TIPO_NOTIFICACION);
        return notificaciones;
    }

    @BeforeEach
    public void initTest() {
        notificaciones = createEntity(em);
    }

    @Test
    @Transactional
    void createNotificaciones() throws Exception {
        int databaseSizeBeforeCreate = notificacionesRepository.findAll().size();
        // Create the Notificaciones
        restNotificacionesMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(notificaciones))
            )
            .andExpect(status().isCreated());

        // Validate the Notificaciones in the database
        List<Notificaciones> notificacionesList = notificacionesRepository.findAll();
        assertThat(notificacionesList).hasSize(databaseSizeBeforeCreate + 1);
        Notificaciones testNotificaciones = notificacionesList.get(notificacionesList.size() - 1);
        assertThat(testNotificaciones.getTipoNotificacion()).isEqualTo(DEFAULT_TIPO_NOTIFICACION);
    }

    @Test
    @Transactional
    void createNotificacionesWithExistingId() throws Exception {
        // Create the Notificaciones with an existing ID
        notificaciones.setId(1L);

        int databaseSizeBeforeCreate = notificacionesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restNotificacionesMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(notificaciones))
            )
            .andExpect(status().isBadRequest());

        // Validate the Notificaciones in the database
        List<Notificaciones> notificacionesList = notificacionesRepository.findAll();
        assertThat(notificacionesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllNotificaciones() throws Exception {
        // Initialize the database
        notificacionesRepository.saveAndFlush(notificaciones);

        // Get all the notificacionesList
        restNotificacionesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(notificaciones.getId().intValue())))
            .andExpect(jsonPath("$.[*].tipoNotificacion").value(hasItem(DEFAULT_TIPO_NOTIFICACION)));
    }

    @Test
    @Transactional
    void getNotificaciones() throws Exception {
        // Initialize the database
        notificacionesRepository.saveAndFlush(notificaciones);

        // Get the notificaciones
        restNotificacionesMockMvc
            .perform(get(ENTITY_API_URL_ID, notificaciones.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(notificaciones.getId().intValue()))
            .andExpect(jsonPath("$.tipoNotificacion").value(DEFAULT_TIPO_NOTIFICACION));
    }

    @Test
    @Transactional
    void getNonExistingNotificaciones() throws Exception {
        // Get the notificaciones
        restNotificacionesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewNotificaciones() throws Exception {
        // Initialize the database
        notificacionesRepository.saveAndFlush(notificaciones);

        int databaseSizeBeforeUpdate = notificacionesRepository.findAll().size();

        // Update the notificaciones
        Notificaciones updatedNotificaciones = notificacionesRepository.findById(notificaciones.getId()).get();
        // Disconnect from session so that the updates on updatedNotificaciones are not directly saved in db
        em.detach(updatedNotificaciones);
        updatedNotificaciones.tipoNotificacion(UPDATED_TIPO_NOTIFICACION);

        restNotificacionesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedNotificaciones.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedNotificaciones))
            )
            .andExpect(status().isOk());

        // Validate the Notificaciones in the database
        List<Notificaciones> notificacionesList = notificacionesRepository.findAll();
        assertThat(notificacionesList).hasSize(databaseSizeBeforeUpdate);
        Notificaciones testNotificaciones = notificacionesList.get(notificacionesList.size() - 1);
        assertThat(testNotificaciones.getTipoNotificacion()).isEqualTo(UPDATED_TIPO_NOTIFICACION);
    }

    @Test
    @Transactional
    void putNonExistingNotificaciones() throws Exception {
        int databaseSizeBeforeUpdate = notificacionesRepository.findAll().size();
        notificaciones.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNotificacionesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, notificaciones.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(notificaciones))
            )
            .andExpect(status().isBadRequest());

        // Validate the Notificaciones in the database
        List<Notificaciones> notificacionesList = notificacionesRepository.findAll();
        assertThat(notificacionesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchNotificaciones() throws Exception {
        int databaseSizeBeforeUpdate = notificacionesRepository.findAll().size();
        notificaciones.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNotificacionesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(notificaciones))
            )
            .andExpect(status().isBadRequest());

        // Validate the Notificaciones in the database
        List<Notificaciones> notificacionesList = notificacionesRepository.findAll();
        assertThat(notificacionesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamNotificaciones() throws Exception {
        int databaseSizeBeforeUpdate = notificacionesRepository.findAll().size();
        notificaciones.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNotificacionesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(notificaciones)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Notificaciones in the database
        List<Notificaciones> notificacionesList = notificacionesRepository.findAll();
        assertThat(notificacionesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateNotificacionesWithPatch() throws Exception {
        // Initialize the database
        notificacionesRepository.saveAndFlush(notificaciones);

        int databaseSizeBeforeUpdate = notificacionesRepository.findAll().size();

        // Update the notificaciones using partial update
        Notificaciones partialUpdatedNotificaciones = new Notificaciones();
        partialUpdatedNotificaciones.setId(notificaciones.getId());

        partialUpdatedNotificaciones.tipoNotificacion(UPDATED_TIPO_NOTIFICACION);

        restNotificacionesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNotificaciones.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNotificaciones))
            )
            .andExpect(status().isOk());

        // Validate the Notificaciones in the database
        List<Notificaciones> notificacionesList = notificacionesRepository.findAll();
        assertThat(notificacionesList).hasSize(databaseSizeBeforeUpdate);
        Notificaciones testNotificaciones = notificacionesList.get(notificacionesList.size() - 1);
        assertThat(testNotificaciones.getTipoNotificacion()).isEqualTo(UPDATED_TIPO_NOTIFICACION);
    }

    @Test
    @Transactional
    void fullUpdateNotificacionesWithPatch() throws Exception {
        // Initialize the database
        notificacionesRepository.saveAndFlush(notificaciones);

        int databaseSizeBeforeUpdate = notificacionesRepository.findAll().size();

        // Update the notificaciones using partial update
        Notificaciones partialUpdatedNotificaciones = new Notificaciones();
        partialUpdatedNotificaciones.setId(notificaciones.getId());

        partialUpdatedNotificaciones.tipoNotificacion(UPDATED_TIPO_NOTIFICACION);

        restNotificacionesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNotificaciones.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNotificaciones))
            )
            .andExpect(status().isOk());

        // Validate the Notificaciones in the database
        List<Notificaciones> notificacionesList = notificacionesRepository.findAll();
        assertThat(notificacionesList).hasSize(databaseSizeBeforeUpdate);
        Notificaciones testNotificaciones = notificacionesList.get(notificacionesList.size() - 1);
        assertThat(testNotificaciones.getTipoNotificacion()).isEqualTo(UPDATED_TIPO_NOTIFICACION);
    }

    @Test
    @Transactional
    void patchNonExistingNotificaciones() throws Exception {
        int databaseSizeBeforeUpdate = notificacionesRepository.findAll().size();
        notificaciones.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNotificacionesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, notificaciones.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(notificaciones))
            )
            .andExpect(status().isBadRequest());

        // Validate the Notificaciones in the database
        List<Notificaciones> notificacionesList = notificacionesRepository.findAll();
        assertThat(notificacionesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchNotificaciones() throws Exception {
        int databaseSizeBeforeUpdate = notificacionesRepository.findAll().size();
        notificaciones.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNotificacionesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(notificaciones))
            )
            .andExpect(status().isBadRequest());

        // Validate the Notificaciones in the database
        List<Notificaciones> notificacionesList = notificacionesRepository.findAll();
        assertThat(notificacionesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamNotificaciones() throws Exception {
        int databaseSizeBeforeUpdate = notificacionesRepository.findAll().size();
        notificaciones.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNotificacionesMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(notificaciones))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Notificaciones in the database
        List<Notificaciones> notificacionesList = notificacionesRepository.findAll();
        assertThat(notificacionesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteNotificaciones() throws Exception {
        // Initialize the database
        notificacionesRepository.saveAndFlush(notificaciones);

        int databaseSizeBeforeDelete = notificacionesRepository.findAll().size();

        // Delete the notificaciones
        restNotificacionesMockMvc
            .perform(delete(ENTITY_API_URL_ID, notificaciones.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Notificaciones> notificacionesList = notificacionesRepository.findAll();
        assertThat(notificacionesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
