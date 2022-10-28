package ar.edu.um.isa.umbook.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Grupos.
 */
@Entity
@Table(name = "grupos")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Grupos implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "cant_personas")
    private String cantPersonas;

    @ManyToMany
    @JoinTable(
        name = "rel_grupos__album",
        joinColumns = @JoinColumn(name = "grupos_id"),
        inverseJoinColumns = @JoinColumn(name = "album_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "fotos", "perfil", "usuario", "grupos" }, allowSetters = true)
    private Set<Album> albums = new HashSet<>();

    @ManyToMany(mappedBy = "grupos")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "perfil", "notificaciones", "albums", "fotos", "amigos", "grupos", "admin" }, allowSetters = true)
    private Set<Usuario> usuarios = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Grupos id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Grupos nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCantPersonas() {
        return this.cantPersonas;
    }

    public Grupos cantPersonas(String cantPersonas) {
        this.setCantPersonas(cantPersonas);
        return this;
    }

    public void setCantPersonas(String cantPersonas) {
        this.cantPersonas = cantPersonas;
    }

    public Set<Album> getAlbums() {
        return this.albums;
    }

    public void setAlbums(Set<Album> albums) {
        this.albums = albums;
    }

    public Grupos albums(Set<Album> albums) {
        this.setAlbums(albums);
        return this;
    }

    public Grupos addAlbum(Album album) {
        this.albums.add(album);
        album.getGrupos().add(this);
        return this;
    }

    public Grupos removeAlbum(Album album) {
        this.albums.remove(album);
        album.getGrupos().remove(this);
        return this;
    }

    public Set<Usuario> getUsuarios() {
        return this.usuarios;
    }

    public void setUsuarios(Set<Usuario> usuarios) {
        if (this.usuarios != null) {
            this.usuarios.forEach(i -> i.removeGrupos(this));
        }
        if (usuarios != null) {
            usuarios.forEach(i -> i.addGrupos(this));
        }
        this.usuarios = usuarios;
    }

    public Grupos usuarios(Set<Usuario> usuarios) {
        this.setUsuarios(usuarios);
        return this;
    }

    public Grupos addUsuario(Usuario usuario) {
        this.usuarios.add(usuario);
        usuario.getGrupos().add(this);
        return this;
    }

    public Grupos removeUsuario(Usuario usuario) {
        this.usuarios.remove(usuario);
        usuario.getGrupos().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Grupos)) {
            return false;
        }
        return id != null && id.equals(((Grupos) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Grupos{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", cantPersonas='" + getCantPersonas() + "'" +
            "}";
    }
}
