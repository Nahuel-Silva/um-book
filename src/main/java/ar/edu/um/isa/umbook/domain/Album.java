package ar.edu.um.isa.umbook.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Album.
 */
@Entity
@Table(name = "album")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Album implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "cant_fotos")
    private Integer cantFotos;

    @OneToMany(mappedBy = "album")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "comentarios", "album", "usuario" }, allowSetters = true)
    private Set<Fotos> fotos = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "albums", "usuario" }, allowSetters = true)
    private Perfil perfil;

    @ManyToOne
    @JsonIgnoreProperties(value = { "perfil", "notificaciones", "albums", "fotos", "amigos", "grupos", "admin" }, allowSetters = true)
    private Usuario usuario;

    @ManyToMany(mappedBy = "albums")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "albums", "usuarios" }, allowSetters = true)
    private Set<Grupos> grupos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Album id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Album nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return this.descripcion;
    }

    public Album descripcion(String descripcion) {
        this.setDescripcion(descripcion);
        return this;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getCantFotos() {
        return this.cantFotos;
    }

    public Album cantFotos(Integer cantFotos) {
        this.setCantFotos(cantFotos);
        return this;
    }

    public void setCantFotos(Integer cantFotos) {
        this.cantFotos = cantFotos;
    }

    public Set<Fotos> getFotos() {
        return this.fotos;
    }

    public void setFotos(Set<Fotos> fotos) {
        if (this.fotos != null) {
            this.fotos.forEach(i -> i.setAlbum(null));
        }
        if (fotos != null) {
            fotos.forEach(i -> i.setAlbum(this));
        }
        this.fotos = fotos;
    }

    public Album fotos(Set<Fotos> fotos) {
        this.setFotos(fotos);
        return this;
    }

    public Album addFotos(Fotos fotos) {
        this.fotos.add(fotos);
        fotos.setAlbum(this);
        return this;
    }

    public Album removeFotos(Fotos fotos) {
        this.fotos.remove(fotos);
        fotos.setAlbum(null);
        return this;
    }

    public Perfil getPerfil() {
        return this.perfil;
    }

    public void setPerfil(Perfil perfil) {
        this.perfil = perfil;
    }

    public Album perfil(Perfil perfil) {
        this.setPerfil(perfil);
        return this;
    }

    public Usuario getUsuario() {
        return this.usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Album usuario(Usuario usuario) {
        this.setUsuario(usuario);
        return this;
    }

    public Set<Grupos> getGrupos() {
        return this.grupos;
    }

    public void setGrupos(Set<Grupos> grupos) {
        if (this.grupos != null) {
            this.grupos.forEach(i -> i.removeAlbum(this));
        }
        if (grupos != null) {
            grupos.forEach(i -> i.addAlbum(this));
        }
        this.grupos = grupos;
    }

    public Album grupos(Set<Grupos> grupos) {
        this.setGrupos(grupos);
        return this;
    }

    public Album addGrupos(Grupos grupos) {
        this.grupos.add(grupos);
        grupos.getAlbums().add(this);
        return this;
    }

    public Album removeGrupos(Grupos grupos) {
        this.grupos.remove(grupos);
        grupos.getAlbums().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Album)) {
            return false;
        }
        return id != null && id.equals(((Album) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Album{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", descripcion='" + getDescripcion() + "'" +
            ", cantFotos=" + getCantFotos() +
            "}";
    }
}
