package ar.edu.um.isa.umbook.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Amigos.
 */
@Entity
@Table(name = "amigos")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Amigos implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "cantidad")
    private Integer cantidad;

    @Column(name = "amigos_comun")
    private String amigosComun;

    @ManyToOne
    @JsonIgnoreProperties(value = { "perfil", "notificaciones", "albums", "fotos", "amigos", "grupos", "admin" }, allowSetters = true)
    private Usuario usuario;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Amigos id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getCantidad() {
        return this.cantidad;
    }

    public Amigos cantidad(Integer cantidad) {
        this.setCantidad(cantidad);
        return this;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public String getAmigosComun() {
        return this.amigosComun;
    }

    public Amigos amigosComun(String amigosComun) {
        this.setAmigosComun(amigosComun);
        return this;
    }

    public void setAmigosComun(String amigosComun) {
        this.amigosComun = amigosComun;
    }

    public Usuario getUsuario() {
        return this.usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Amigos usuario(Usuario usuario) {
        this.setUsuario(usuario);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Amigos)) {
            return false;
        }
        return id != null && id.equals(((Amigos) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Amigos{" +
            "id=" + getId() +
            ", cantidad=" + getCantidad() +
            ", amigosComun='" + getAmigosComun() + "'" +
            "}";
    }
}
