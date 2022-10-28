package ar.edu.um.isa.umbook.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import ar.edu.um.isa.umbook.IntegrationTest;
import ar.edu.um.isa.umbook.domain.Grupos;
import ar.edu.um.isa.umbook.repository.GruposRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link GruposResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class GruposResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_CANT_PERSONAS = "AAAAAAAAAA";
    private static final String UPDATED_CANT_PERSONAS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/grupos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GruposRepository gruposRepository;

    @Mock
    private GruposRepository gruposRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGruposMockMvc;

    private Grupos grupos;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Grupos createEntity(EntityManager em) {
        Grupos grupos = new Grupos().nombre(DEFAULT_NOMBRE).cantPersonas(DEFAULT_CANT_PERSONAS);
        return grupos;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Grupos createUpdatedEntity(EntityManager em) {
        Grupos grupos = new Grupos().nombre(UPDATED_NOMBRE).cantPersonas(UPDATED_CANT_PERSONAS);
        return grupos;
    }

    @BeforeEach
    public void initTest() {
        grupos = createEntity(em);
    }

    @Test
    @Transactional
    void createGrupos() throws Exception {
        int databaseSizeBeforeCreate = gruposRepository.findAll().size();
        // Create the Grupos
        restGruposMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grupos)))
            .andExpect(status().isCreated());

        // Validate the Grupos in the database
        List<Grupos> gruposList = gruposRepository.findAll();
        assertThat(gruposList).hasSize(databaseSizeBeforeCreate + 1);
        Grupos testGrupos = gruposList.get(gruposList.size() - 1);
        assertThat(testGrupos.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testGrupos.getCantPersonas()).isEqualTo(DEFAULT_CANT_PERSONAS);
    }

    @Test
    @Transactional
    void createGruposWithExistingId() throws Exception {
        // Create the Grupos with an existing ID
        grupos.setId(1L);

        int databaseSizeBeforeCreate = gruposRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGruposMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grupos)))
            .andExpect(status().isBadRequest());

        // Validate the Grupos in the database
        List<Grupos> gruposList = gruposRepository.findAll();
        assertThat(gruposList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGrupos() throws Exception {
        // Initialize the database
        gruposRepository.saveAndFlush(grupos);

        // Get all the gruposList
        restGruposMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(grupos.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].cantPersonas").value(hasItem(DEFAULT_CANT_PERSONAS)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllGruposWithEagerRelationshipsIsEnabled() throws Exception {
        when(gruposRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restGruposMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(gruposRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllGruposWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(gruposRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restGruposMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(gruposRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getGrupos() throws Exception {
        // Initialize the database
        gruposRepository.saveAndFlush(grupos);

        // Get the grupos
        restGruposMockMvc
            .perform(get(ENTITY_API_URL_ID, grupos.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(grupos.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.cantPersonas").value(DEFAULT_CANT_PERSONAS));
    }

    @Test
    @Transactional
    void getNonExistingGrupos() throws Exception {
        // Get the grupos
        restGruposMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewGrupos() throws Exception {
        // Initialize the database
        gruposRepository.saveAndFlush(grupos);

        int databaseSizeBeforeUpdate = gruposRepository.findAll().size();

        // Update the grupos
        Grupos updatedGrupos = gruposRepository.findById(grupos.getId()).get();
        // Disconnect from session so that the updates on updatedGrupos are not directly saved in db
        em.detach(updatedGrupos);
        updatedGrupos.nombre(UPDATED_NOMBRE).cantPersonas(UPDATED_CANT_PERSONAS);

        restGruposMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGrupos.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGrupos))
            )
            .andExpect(status().isOk());

        // Validate the Grupos in the database
        List<Grupos> gruposList = gruposRepository.findAll();
        assertThat(gruposList).hasSize(databaseSizeBeforeUpdate);
        Grupos testGrupos = gruposList.get(gruposList.size() - 1);
        assertThat(testGrupos.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testGrupos.getCantPersonas()).isEqualTo(UPDATED_CANT_PERSONAS);
    }

    @Test
    @Transactional
    void putNonExistingGrupos() throws Exception {
        int databaseSizeBeforeUpdate = gruposRepository.findAll().size();
        grupos.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGruposMockMvc
            .perform(
                put(ENTITY_API_URL_ID, grupos.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grupos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grupos in the database
        List<Grupos> gruposList = gruposRepository.findAll();
        assertThat(gruposList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGrupos() throws Exception {
        int databaseSizeBeforeUpdate = gruposRepository.findAll().size();
        grupos.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGruposMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(grupos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grupos in the database
        List<Grupos> gruposList = gruposRepository.findAll();
        assertThat(gruposList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGrupos() throws Exception {
        int databaseSizeBeforeUpdate = gruposRepository.findAll().size();
        grupos.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGruposMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(grupos)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Grupos in the database
        List<Grupos> gruposList = gruposRepository.findAll();
        assertThat(gruposList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGruposWithPatch() throws Exception {
        // Initialize the database
        gruposRepository.saveAndFlush(grupos);

        int databaseSizeBeforeUpdate = gruposRepository.findAll().size();

        // Update the grupos using partial update
        Grupos partialUpdatedGrupos = new Grupos();
        partialUpdatedGrupos.setId(grupos.getId());

        partialUpdatedGrupos.cantPersonas(UPDATED_CANT_PERSONAS);

        restGruposMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrupos.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGrupos))
            )
            .andExpect(status().isOk());

        // Validate the Grupos in the database
        List<Grupos> gruposList = gruposRepository.findAll();
        assertThat(gruposList).hasSize(databaseSizeBeforeUpdate);
        Grupos testGrupos = gruposList.get(gruposList.size() - 1);
        assertThat(testGrupos.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testGrupos.getCantPersonas()).isEqualTo(UPDATED_CANT_PERSONAS);
    }

    @Test
    @Transactional
    void fullUpdateGruposWithPatch() throws Exception {
        // Initialize the database
        gruposRepository.saveAndFlush(grupos);

        int databaseSizeBeforeUpdate = gruposRepository.findAll().size();

        // Update the grupos using partial update
        Grupos partialUpdatedGrupos = new Grupos();
        partialUpdatedGrupos.setId(grupos.getId());

        partialUpdatedGrupos.nombre(UPDATED_NOMBRE).cantPersonas(UPDATED_CANT_PERSONAS);

        restGruposMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGrupos.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGrupos))
            )
            .andExpect(status().isOk());

        // Validate the Grupos in the database
        List<Grupos> gruposList = gruposRepository.findAll();
        assertThat(gruposList).hasSize(databaseSizeBeforeUpdate);
        Grupos testGrupos = gruposList.get(gruposList.size() - 1);
        assertThat(testGrupos.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testGrupos.getCantPersonas()).isEqualTo(UPDATED_CANT_PERSONAS);
    }

    @Test
    @Transactional
    void patchNonExistingGrupos() throws Exception {
        int databaseSizeBeforeUpdate = gruposRepository.findAll().size();
        grupos.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGruposMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, grupos.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grupos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grupos in the database
        List<Grupos> gruposList = gruposRepository.findAll();
        assertThat(gruposList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGrupos() throws Exception {
        int databaseSizeBeforeUpdate = gruposRepository.findAll().size();
        grupos.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGruposMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(grupos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Grupos in the database
        List<Grupos> gruposList = gruposRepository.findAll();
        assertThat(gruposList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGrupos() throws Exception {
        int databaseSizeBeforeUpdate = gruposRepository.findAll().size();
        grupos.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGruposMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(grupos)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Grupos in the database
        List<Grupos> gruposList = gruposRepository.findAll();
        assertThat(gruposList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGrupos() throws Exception {
        // Initialize the database
        gruposRepository.saveAndFlush(grupos);

        int databaseSizeBeforeDelete = gruposRepository.findAll().size();

        // Delete the grupos
        restGruposMockMvc
            .perform(delete(ENTITY_API_URL_ID, grupos.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Grupos> gruposList = gruposRepository.findAll();
        assertThat(gruposList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
