package ar.edu.um.isa.umbook.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Fotos.
 */
@Entity
@Table(name = "fotos")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Fotos implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "descripcion")
    private String descripcion;

    @OneToMany(mappedBy = "fotos")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "fotos" }, allowSetters = true)
    private Set<Comentarios> comentarios = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "fotos", "perfil", "usuario", "grupos" }, allowSetters = true)
    private Album album;

    @ManyToOne
    @JsonIgnoreProperties(value = { "perfil", "notificaciones", "albums", "fotos", "amigos", "grupos", "admin" }, allowSetters = true)
    private Usuario usuario;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Fotos id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescripcion() {
        return this.descripcion;
    }

    public Fotos descripcion(String descripcion) {
        this.setDescripcion(descripcion);
        return this;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Set<Comentarios> getComentarios() {
        return this.comentarios;
    }

    public void setComentarios(Set<Comentarios> comentarios) {
        if (this.comentarios != null) {
            this.comentarios.forEach(i -> i.setFotos(null));
        }
        if (comentarios != null) {
            comentarios.forEach(i -> i.setFotos(this));
        }
        this.comentarios = comentarios;
    }

    public Fotos comentarios(Set<Comentarios> comentarios) {
        this.setComentarios(comentarios);
        return this;
    }

    public Fotos addComentarios(Comentarios comentarios) {
        this.comentarios.add(comentarios);
        comentarios.setFotos(this);
        return this;
    }

    public Fotos removeComentarios(Comentarios comentarios) {
        this.comentarios.remove(comentarios);
        comentarios.setFotos(null);
        return this;
    }

    public Album getAlbum() {
        return this.album;
    }

    public void setAlbum(Album album) {
        this.album = album;
    }

    public Fotos album(Album album) {
        this.setAlbum(album);
        return this;
    }

    public Usuario getUsuario() {
        return this.usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Fotos usuario(Usuario usuario) {
        this.setUsuario(usuario);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Fotos)) {
            return false;
        }
        return id != null && id.equals(((Fotos) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Fotos{" +
            "id=" + getId() +
            ", descripcion='" + getDescripcion() + "'" +
            "}";
    }
}
