package ar.edu.um.isa.umbook.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, ar.edu.um.isa.umbook.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, ar.edu.um.isa.umbook.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, ar.edu.um.isa.umbook.domain.User.class.getName());
            createCache(cm, ar.edu.um.isa.umbook.domain.Authority.class.getName());
            createCache(cm, ar.edu.um.isa.umbook.domain.User.class.getName() + ".authorities");
            createCache(cm, ar.edu.um.isa.umbook.domain.Usuario.class.getName());
            createCache(cm, ar.edu.um.isa.umbook.domain.Usuario.class.getName() + ".notificaciones");
            createCache(cm, ar.edu.um.isa.umbook.domain.Usuario.class.getName() + ".albums");
            createCache(cm, ar.edu.um.isa.umbook.domain.Usuario.class.getName() + ".fotos");
            createCache(cm, ar.edu.um.isa.umbook.domain.Usuario.class.getName() + ".amigos");
            createCache(cm, ar.edu.um.isa.umbook.domain.Usuario.class.getName() + ".grupos");
            createCache(cm, ar.edu.um.isa.umbook.domain.Notificaciones.class.getName());
            createCache(cm, ar.edu.um.isa.umbook.domain.Grupos.class.getName());
            createCache(cm, ar.edu.um.isa.umbook.domain.Grupos.class.getName() + ".albums");
            createCache(cm, ar.edu.um.isa.umbook.domain.Grupos.class.getName() + ".usuarios");
            createCache(cm, ar.edu.um.isa.umbook.domain.Perfil.class.getName());
            createCache(cm, ar.edu.um.isa.umbook.domain.Perfil.class.getName() + ".albums");
            createCache(cm, ar.edu.um.isa.umbook.domain.Album.class.getName());
            createCache(cm, ar.edu.um.isa.umbook.domain.Album.class.getName() + ".fotos");
            createCache(cm, ar.edu.um.isa.umbook.domain.Album.class.getName() + ".grupos");
            createCache(cm, ar.edu.um.isa.umbook.domain.Fotos.class.getName());
            createCache(cm, ar.edu.um.isa.umbook.domain.Fotos.class.getName() + ".comentarios");
            createCache(cm, ar.edu.um.isa.umbook.domain.Comentarios.class.getName());
            createCache(cm, ar.edu.um.isa.umbook.domain.Amigos.class.getName());
            createCache(cm, ar.edu.um.isa.umbook.domain.Admin.class.getName());
            createCache(cm, ar.edu.um.isa.umbook.domain.Admin.class.getName() + ".usuarios");
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
