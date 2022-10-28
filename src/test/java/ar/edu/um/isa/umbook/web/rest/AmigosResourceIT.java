package ar.edu.um.isa.umbook.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import ar.edu.um.isa.umbook.IntegrationTest;
import ar.edu.um.isa.umbook.domain.Amigos;
import ar.edu.um.isa.umbook.repository.AmigosRepository;
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
 * Integration tests for the {@link AmigosResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AmigosResourceIT {

    private static final Integer DEFAULT_CANTIDAD = 1;
    private static final Integer UPDATED_CANTIDAD = 2;

    private static final String DEFAULT_AMIGOS_COMUN = "AAAAAAAAAA";
    private static final String UPDATED_AMIGOS_COMUN = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/amigos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AmigosRepository amigosRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAmigosMockMvc;

    private Amigos amigos;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Amigos createEntity(EntityManager em) {
        Amigos amigos = new Amigos().cantidad(DEFAULT_CANTIDAD).amigosComun(DEFAULT_AMIGOS_COMUN);
        return amigos;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Amigos createUpdatedEntity(EntityManager em) {
        Amigos amigos = new Amigos().cantidad(UPDATED_CANTIDAD).amigosComun(UPDATED_AMIGOS_COMUN);
        return amigos;
    }

    @BeforeEach
    public void initTest() {
        amigos = createEntity(em);
    }

    @Test
    @Transactional
    void createAmigos() throws Exception {
        int databaseSizeBeforeCreate = amigosRepository.findAll().size();
        // Create the Amigos
        restAmigosMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(amigos)))
            .andExpect(status().isCreated());

        // Validate the Amigos in the database
        List<Amigos> amigosList = amigosRepository.findAll();
        assertThat(amigosList).hasSize(databaseSizeBeforeCreate + 1);
        Amigos testAmigos = amigosList.get(amigosList.size() - 1);
        assertThat(testAmigos.getCantidad()).isEqualTo(DEFAULT_CANTIDAD);
        assertThat(testAmigos.getAmigosComun()).isEqualTo(DEFAULT_AMIGOS_COMUN);
    }

    @Test
    @Transactional
    void createAmigosWithExistingId() throws Exception {
        // Create the Amigos with an existing ID
        amigos.setId(1L);

        int databaseSizeBeforeCreate = amigosRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAmigosMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(amigos)))
            .andExpect(status().isBadRequest());

        // Validate the Amigos in the database
        List<Amigos> amigosList = amigosRepository.findAll();
        assertThat(amigosList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAmigos() throws Exception {
        // Initialize the database
        amigosRepository.saveAndFlush(amigos);

        // Get all the amigosList
        restAmigosMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(amigos.getId().intValue())))
            .andExpect(jsonPath("$.[*].cantidad").value(hasItem(DEFAULT_CANTIDAD)))
            .andExpect(jsonPath("$.[*].amigosComun").value(hasItem(DEFAULT_AMIGOS_COMUN)));
    }

    @Test
    @Transactional
    void getAmigos() throws Exception {
        // Initialize the database
        amigosRepository.saveAndFlush(amigos);

        // Get the amigos
        restAmigosMockMvc
            .perform(get(ENTITY_API_URL_ID, amigos.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(amigos.getId().intValue()))
            .andExpect(jsonPath("$.cantidad").value(DEFAULT_CANTIDAD))
            .andExpect(jsonPath("$.amigosComun").value(DEFAULT_AMIGOS_COMUN));
    }

    @Test
    @Transactional
    void getNonExistingAmigos() throws Exception {
        // Get the amigos
        restAmigosMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAmigos() throws Exception {
        // Initialize the database
        amigosRepository.saveAndFlush(amigos);

        int databaseSizeBeforeUpdate = amigosRepository.findAll().size();

        // Update the amigos
        Amigos updatedAmigos = amigosRepository.findById(amigos.getId()).get();
        // Disconnect from session so that the updates on updatedAmigos are not directly saved in db
        em.detach(updatedAmigos);
        updatedAmigos.cantidad(UPDATED_CANTIDAD).amigosComun(UPDATED_AMIGOS_COMUN);

        restAmigosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAmigos.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAmigos))
            )
            .andExpect(status().isOk());

        // Validate the Amigos in the database
        List<Amigos> amigosList = amigosRepository.findAll();
        assertThat(amigosList).hasSize(databaseSizeBeforeUpdate);
        Amigos testAmigos = amigosList.get(amigosList.size() - 1);
        assertThat(testAmigos.getCantidad()).isEqualTo(UPDATED_CANTIDAD);
        assertThat(testAmigos.getAmigosComun()).isEqualTo(UPDATED_AMIGOS_COMUN);
    }

    @Test
    @Transactional
    void putNonExistingAmigos() throws Exception {
        int databaseSizeBeforeUpdate = amigosRepository.findAll().size();
        amigos.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAmigosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, amigos.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(amigos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Amigos in the database
        List<Amigos> amigosList = amigosRepository.findAll();
        assertThat(amigosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAmigos() throws Exception {
        int databaseSizeBeforeUpdate = amigosRepository.findAll().size();
        amigos.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAmigosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(amigos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Amigos in the database
        List<Amigos> amigosList = amigosRepository.findAll();
        assertThat(amigosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAmigos() throws Exception {
        int databaseSizeBeforeUpdate = amigosRepository.findAll().size();
        amigos.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAmigosMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(amigos)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Amigos in the database
        List<Amigos> amigosList = amigosRepository.findAll();
        assertThat(amigosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAmigosWithPatch() throws Exception {
        // Initialize the database
        amigosRepository.saveAndFlush(amigos);

        int databaseSizeBeforeUpdate = amigosRepository.findAll().size();

        // Update the amigos using partial update
        Amigos partialUpdatedAmigos = new Amigos();
        partialUpdatedAmigos.setId(amigos.getId());

        partialUpdatedAmigos.cantidad(UPDATED_CANTIDAD);

        restAmigosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAmigos.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAmigos))
            )
            .andExpect(status().isOk());

        // Validate the Amigos in the database
        List<Amigos> amigosList = amigosRepository.findAll();
        assertThat(amigosList).hasSize(databaseSizeBeforeUpdate);
        Amigos testAmigos = amigosList.get(amigosList.size() - 1);
        assertThat(testAmigos.getCantidad()).isEqualTo(UPDATED_CANTIDAD);
        assertThat(testAmigos.getAmigosComun()).isEqualTo(DEFAULT_AMIGOS_COMUN);
    }

    @Test
    @Transactional
    void fullUpdateAmigosWithPatch() throws Exception {
        // Initialize the database
        amigosRepository.saveAndFlush(amigos);

        int databaseSizeBeforeUpdate = amigosRepository.findAll().size();

        // Update the amigos using partial update
        Amigos partialUpdatedAmigos = new Amigos();
        partialUpdatedAmigos.setId(amigos.getId());

        partialUpdatedAmigos.cantidad(UPDATED_CANTIDAD).amigosComun(UPDATED_AMIGOS_COMUN);

        restAmigosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAmigos.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAmigos))
            )
            .andExpect(status().isOk());

        // Validate the Amigos in the database
        List<Amigos> amigosList = amigosRepository.findAll();
        assertThat(amigosList).hasSize(databaseSizeBeforeUpdate);
        Amigos testAmigos = amigosList.get(amigosList.size() - 1);
        assertThat(testAmigos.getCantidad()).isEqualTo(UPDATED_CANTIDAD);
        assertThat(testAmigos.getAmigosComun()).isEqualTo(UPDATED_AMIGOS_COMUN);
    }

    @Test
    @Transactional
    void patchNonExistingAmigos() throws Exception {
        int databaseSizeBeforeUpdate = amigosRepository.findAll().size();
        amigos.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAmigosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, amigos.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(amigos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Amigos in the database
        List<Amigos> amigosList = amigosRepository.findAll();
        assertThat(amigosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAmigos() throws Exception {
        int databaseSizeBeforeUpdate = amigosRepository.findAll().size();
        amigos.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAmigosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(amigos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Amigos in the database
        List<Amigos> amigosList = amigosRepository.findAll();
        assertThat(amigosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAmigos() throws Exception {
        int databaseSizeBeforeUpdate = amigosRepository.findAll().size();
        amigos.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAmigosMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(amigos)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Amigos in the database
        List<Amigos> amigosList = amigosRepository.findAll();
        assertThat(amigosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAmigos() throws Exception {
        // Initialize the database
        amigosRepository.saveAndFlush(amigos);

        int databaseSizeBeforeDelete = amigosRepository.findAll().size();

        // Delete the amigos
        restAmigosMockMvc
            .perform(delete(ENTITY_API_URL_ID, amigos.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Amigos> amigosList = amigosRepository.findAll();
        assertThat(amigosList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
