package ar.edu.um.isa.umbook.domain;

import static org.assertj.core.api.Assertions.assertThat;

import ar.edu.um.isa.umbook.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GruposTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Grupos.class);
        Grupos grupos1 = new Grupos();
        grupos1.setId(1L);
        Grupos grupos2 = new Grupos();
        grupos2.setId(grupos1.getId());
        assertThat(grupos1).isEqualTo(grupos2);
        grupos2.setId(2L);
        assertThat(grupos1).isNotEqualTo(grupos2);
        grupos1.setId(null);
        assertThat(grupos1).isNotEqualTo(grupos2);
    }
}
