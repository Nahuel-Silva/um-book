package ar.edu.um.isa.umbook.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Comentarios.
 */
@Entity
@Table(name = "comentarios")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Comentarios implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "descripcion")
    private String descripcion;

    @ManyToOne
    @JsonIgnoreProperties(value = { "comentarios", "album", "usuario" }, allowSetters = true)
    private Fotos fotos;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Comentarios id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescripcion() {
        return this.descripcion;
    }

    public Comentarios descripcion(String descripcion) {
        this.setDescripcion(descripcion);
        return this;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Fotos getFotos() {
        return this.fotos;
    }

    public void setFotos(Fotos fotos) {
        this.fotos = fotos;
    }

    public Comentarios fotos(Fotos fotos) {
        this.setFotos(fotos);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Comentarios)) {
            return false;
        }
        return id != null && id.equals(((Comentarios) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Comentarios{" +
            "id=" + getId() +
            ", descripcion='" + getDescripcion() + "'" +
            "}";
    }
}
