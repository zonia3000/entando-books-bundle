package com.entando.liquibase;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.LoggerContext;
import com.entando.booksservice.BooksServiceApplication;
import com.entando.booksservice.TestSecurityConfiguration;
import com.entando.booksservice.persistence.BooksRepository;
import java.util.Properties;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, classes = { BooksServiceApplication.class, TestSecurityConfiguration.class})
@ActiveProfiles("testdb")
@Slf4j
@DirtiesContext(classMode = ClassMode.BEFORE_CLASS)
class LiquibaseStartH2IntegrationTest {

    private static Properties propsBackup;

    static {
        propsBackup = new Properties(System.getProperties());
        ((LoggerContext) LoggerFactory.getILoggerFactory()).getLogger("root").setLevel(Level.INFO);
        System.setProperty("spring.datasource.url",
                "jdbc:h2:file:./databases/liquibase-test/h2-" + UUID.randomUUID() + ".db;DB_CLOSE_ON_EXIT=FALSE");
        System.setProperty("spring.datasource.driverClassName", "org.h2.Driver");
        System.setProperty("spring.jpa.database-platform", "org.hibernate.dialect.H2Dialect");
        System.setProperty("spring.datasource.username", "testuser");
        System.setProperty("spring.datasource.password", "testuser");
    }

    @Autowired
    private BooksRepository repository;

    @AfterAll
    public static void cleanUp() {
        log.debug("cleanUp");
        System.setProperties(propsBackup);
        propsBackup.keySet().forEach(k -> {
            log.trace("key:'{}', value:'{}'", k, propsBackup.get(k));
        });
    }

    @Test
    @Transactional
    void testH2ApplicationStart() {
        log.debug("testH2ApplicationStart");
        CommonDbUtility.testDbOperations(repository);
    }
}