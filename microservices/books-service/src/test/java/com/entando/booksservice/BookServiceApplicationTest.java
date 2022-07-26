package com.entando.booksservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, classes = { BooksServiceApplication.class, TestSecurityConfiguration.class})
@ActiveProfiles("testdb")
class BookServiceApplicationTest {

    @Test
    void contextLoads() {
    }

}
