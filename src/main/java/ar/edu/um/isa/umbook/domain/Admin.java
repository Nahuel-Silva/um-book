package ar.edu.um.isa.umbook.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Admin.
 */
@Entity
@Table(name = "admin")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Admin implements Serializable {

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

    @OneToMany(mappedBy = "admin")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "perfil", "notificaciones", "albums", "fotos", "amigos", "grupos", "admin" }, allowSetters = true)
    private Set<Usuario> usuarios = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Admin id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Admin nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return this.apellido;
    }

    public Admin apellido(String apellido) {
        this.setApellido(apellido);
        return this;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getMail() {
        return this.mail;
    }

    public Admin mail(String mail) {
        this.setMail(mail);
        return this;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getPassword() {
        return this.password;
    }

    public Admin password(String password) {
        this.setPassword(password);
        return this;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTipoUsuario() {
        return this.tipoUsuario;
    }

    public Admin tipoUsuario(String tipoUsuario) {
        this.setTipoUsuario(tipoUsuario);
        return this;
    }

    public void setTipoUsuario(String tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }

    public Set<Usuario> getUsuarios() {
        return this.usuarios;
    }

    public void setUsuarios(Set<Usuario> usuarios) {
        if (this.usuarios != null) {
            this.usuarios.forEach(i -> i.setAdmin(null));
        }
        if (usuarios != null) {
            usuarios.forEach(i -> i.setAdmin(this));
        }
        this.usuarios = usuarios;
    }

    public Admin usuarios(Set<Usuario> usuarios) {
        this.setUsuarios(usuarios);
        return this;
    }

    public Admin addUsuario(Usuario usuario) {
        this.usuarios.add(usuario);
        usuario.setAdmin(this);
        return this;
    }

    public Admin removeUsuario(Usuario usuario) {
        this.usuarios.remove(usuario);
        usuario.setAdmin(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Admin)) {
            return false;
        }
        return id != null && id.equals(((Admin) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Admin{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", apellido='" + getApellido() + "'" +
            ", mail='" + getMail() + "'" +
            ", password='" + getPassword() + "'" +
            ", tipoUsuario='" + getTipoUsuario() + "'" +
            "}";
    }
}
