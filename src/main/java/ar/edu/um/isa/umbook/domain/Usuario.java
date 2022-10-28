package ar.edu.um.isa.umbook.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Usuario.
 */
@Entity
@Table(name = "usuario")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Usuario implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "apellido")
    private String apellido;

    @Column(name = "mail")
    private String mail;

    @Column(name = "password")
    private String password;

    @Column(name = "tipo_usuario")
    private String tipoUsuario;

    @JsonIgnoreProperties(value = { "albums", "usuario" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Perfil perfil;

    @OneToMany(mappedBy = "usuario")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "usuario" }, allowSetters = true)
    private Set<Notificaciones> notificaciones = new HashSet<>();

    @OneToMany(mappedBy = "usuario")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "fotos", "perfil", "usuario", "grupos" }, allowSetters = true)
    private Set<Album> albums = new HashSet<>();

    @OneToMany(mappedBy = "usuario")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "comentarios", "album", "usuario" }, allowSetters = true)
    private Set<Fotos> fotos = new HashSet<>();

    @OneToMany(mappedBy = "usuario")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "usuario" }, allowSetters = true)
    private Set<Amigos> amigos = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_usuario__grupos",
        joinColumns = @JoinColumn(name = "usuario_id"),
        inverseJoinColumns = @JoinColumn(name = "grupos_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "albums", "usuarios" }, allowSetters = true)
    private Set<Grupos> grupos = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "usuarios" }, allowSetters = true)
    private Admin admin;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Usuario id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Usuario nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return this.apellido;
    }

    public Usuario apellido(String apellido) {
        this.setApellido(apellido);
        return this;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getMail() {
        return this.mail;
    }

    public Usuario mail(String mail) {
        this.setMail(mail);
        return this;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getPassword() {
        return this.password;
    }

    public Usuario password(String password) {
        this.setPassword(password);
        return this;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTipoUsuario() {
        return this.tipoUsuario;
    }

    public Usuario tipoUsuario(String tipoUsuario) {
        this.setTipoUsuario(tipoUsuario);
        return this;
    }

    public void setTipoUsuario(String tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }

    public Perfil getPerfil() {
        return this.perfil;
    }

    public void setPerfil(Perfil perfil) {
        this.perfil = perfil;
    }

    public Usuario perfil(Perfil perfil) {
        this.setPerfil(perfil);
        return this;
    }

    public Set<Notificaciones> getNotificaciones() {
        return this.notificaciones;
    }

    public void setNotificaciones(Set<Notificaciones> notificaciones) {
        if (this.notificaciones != null) {
            this.notificaciones.forEach(i -> i.setUsuario(null));
        }
        if (notificaciones != null) {
            notificaciones.forEach(i -> i.setUsuario(this));
        }
        this.notificaciones = notificaciones;
    }

    public Usuario notificaciones(Set<Notificaciones> notificaciones) {
        this.setNotificaciones(notificaciones);
        return this;
    }

    public Usuario addNotificaciones(Notificaciones notificaciones) {
        this.notificaciones.add(notificaciones);
        notificaciones.setUsuario(this);
        return this;
    }

    public Usuario removeNotificaciones(Notificaciones notificaciones) {
        this.notificaciones.remove(notificaciones);
        notificaciones.setUsuario(null);
        return this;
    }

    public Set<Album> getAlbums() {
        return this.albums;
    }

    public void setAlbums(Set<Album> albums) {
        if (this.albums != null) {
            this.albums.forEach(i -> i.setUsuario(null));
        }
        if (albums != null) {
            albums.forEach(i -> i.setUsuario(this));
        }
        this.albums = albums;
    }

    public Usuario albums(Set<Album> albums) {
        this.setAlbums(albums);
        return this;
    }

    public Usuario addAlbum(Album album) {
        this.albums.add(album);
        album.setUsuario(this);
        return this;
    }

    public Usuario removeAlbum(Album album) {
        this.albums.remove(album);
        album.setUsuario(null);
        return this;
    }

    public Set<Fotos> getFotos() {
        return this.fotos;
    }

    public void setFotos(Set<Fotos> fotos) {
        if (this.fotos != null) {
            this.fotos.forEach(i -> i.setUsuario(null));
        }
        if (fotos != null) {
            fotos.forEach(i -> i.setUsuario(this));
        }
        this.fotos = fotos;
    }

    public Usuario fotos(Set<Fotos> fotos) {
        this.setFotos(fotos);
        return this;
    }

    public Usuario addFotos(Fotos fotos) {
        this.fotos.add(fotos);
        fotos.setUsuario(this);
        return this;
    }

    public Usuario removeFotos(Fotos fotos) {
        this.fotos.remove(fotos);
        fotos.setUsuario(null);
        return this;
    }

    public Set<Amigos> getAmigos() {
        return this.amigos;
    }

    public void setAmigos(Set<Amigos> amigos) {
        if (this.amigos != null) {
            this.amigos.forEach(i -> i.setUsuario(null));
        }
        if (amigos != null) {
            amigos.forEach(i -> i.setUsuario(this));
        }
        this.amigos = amigos;
    }

    public Usuario amigos(Set<Amigos> amigos) {
        this.setAmigos(amigos);
        return this;
    }

    public Usuario addAmigos(Amigos amigos) {
        this.amigos.add(amigos);
        amigos.setUsuario(this);
        return this;
    }

    public Usuario removeAmigos(Amigos amigos) {
        this.amigos.remove(amigos);
        amigos.setUsuario(null);
        return this;
    }

    public Set<Grupos> getGrupos() {
        return this.grupos;
    }

    public void setGrupos(Set<Grupos> grupos) {
        this.grupos = grupos;
    }

    public Usuario grupos(Set<Grupos> grupos) {
        this.setGrupos(grupos);
        return this;
    }

    public Usuario addGrupos(Grupos grupos) {
        this.grupos.add(grupos);
        grupos.getUsuarios().add(this);
        return this;
    }

    public Usuario removeGrupos(Grupos grupos) {
        this.grupos.remove(grupos);
        grupos.getUsuarios().remove(this);
        return this;
    }

    public Admin getAdmin() {
        return this.admin;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }

    public Usuario admin(Admin admin) {
        this.setAdmin(admin);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Usuario)) {
            return false;
        }
        return id != null && id.equals(((Usuario) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Usuario{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", apellido='" + getApellido() + "'" +
            ", mail='" + getMail() + "'" +
            ", password='" + getPassword() + "'" +
            ", tipoUsuario='" + getTipoUsuario() + "'" +
            "}";
    }
}
