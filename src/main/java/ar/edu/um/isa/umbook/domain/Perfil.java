package ar.edu.um.isa.umbook.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Perfil.
 */
@Entity
@Table(name = "perfil")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Perfil implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "cant_albumes")
    private Integer cantAlbumes;

    @Column(name = "cant_seguidores")
    private Integer cantSeguidores;

    @Column(name = "cant_seguidos")
    private Integer cantSeguidos;

    @Column(name = "descripcion")
    private String descripcion;

    @OneToMany(mappedBy = "perfil")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "fotos", "perfil", "usuario", "grupos" }, allowSetters = true)
    private Set<Album> albums = new HashSet<>();

    @JsonIgnoreProperties(value = { "perfil", "notificaciones", "albums", "fotos", "amigos", "grupos", "admin" }, allowSetters = true)
    @OneToOne(mappedBy = "perfil")
    private Usuario usuario;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Perfil id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getCantAlbumes() {
        return this.cantAlbumes;
    }

    public Perfil cantAlbumes(Integer cantAlbumes) {
        this.setCantAlbumes(cantAlbumes);
        return this;
    }

    public void setCantAlbumes(Integer cantAlbumes) {
        this.cantAlbumes = cantAlbumes;
    }

    public Integer getCantSeguidores() {
        return this.cantSeguidores;
    }

    public Perfil cantSeguidores(Integer cantSeguidores) {
        this.setCantSeguidores(cantSeguidores);
        return this;
    }

    public void setCantSeguidores(Integer cantSeguidores) {
        this.cantSeguidores = cantSeguidores;
    }

    public Integer getCantSeguidos() {
        return this.cantSeguidos;
    }

    public Perfil cantSeguidos(Integer cantSeguidos) {
        this.setCantSeguidos(cantSeguidos);
        return this;
    }

    public void setCantSeguidos(Integer cantSeguidos) {
        this.cantSeguidos = cantSeguidos;
    }

    public String getDescripcion() {
        return this.descripcion;
    }

    public Perfil descripcion(String descripcion) {
        this.setDescripcion(descripcion);
        return this;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Set<Album> getAlbums() {
        return this.albums;
    }

    public void setAlbums(Set<Album> albums) {
        if (this.albums != null) {
            this.albums.forEach(i -> i.setPerfil(null));
        }
        if (albums != null) {
            albums.forEach(i -> i.setPerfil(this));
        }
        this.albums = albums;
    }

    public Perfil albums(Set<Album> albums) {
        this.setAlbums(albums);
        return this;
    }

    public Perfil addAlbum(Album album) {
        this.albums.add(album);
        album.setPerfil(this);
        return this;
    }

    public Perfil removeAlbum(Album album) {
        this.albums.remove(album);
        album.setPerfil(null);
        return this;
    }

    public Usuario getUsuario() {
        return this.usuario;
    }

    public void setUsuario(Usuario usuario) {
        if (this.usuario != null) {
            this.usuario.setPerfil(null);
        }
        if (usuario != null) {
            usuario.setPerfil(this);
        }
        this.usuario = usuario;
    }

    public Perfil usuario(Usuario usuario) {
        this.setUsuario(usuario);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Perfil)) {
            return false;
        }
        return id != null && id.equals(((Perfil) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Perfil{" +
            "id=" + getId() +
            ", cantAlbumes=" + getCantAlbumes() +
            ", cantSeguidores=" + getCantSeguidores() +
            ", cantSeguidos=" + getCantSeguidos() +
            ", descripcion='" + getDescripcion() + "'" +
            "}";
    }
}
