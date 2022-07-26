package com.entando.liquibase;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import com.entando.booksservice.persistence.Book;
import com.entando.booksservice.persistence.BooksRepository;

public final class CommonDbUtility {

    private CommonDbUtility(){}

    public static void testDbOperations(BooksRepository repository) {
        Book bookToSave = Book.builder().author("author").title("title").build();
        Book book = repository.save(bookToSave);
        book = repository.getReferenceById(book.getId());
        assertThat(book.getId()).isNotNull();
        assertThat(book.getAuthor()).isEqualTo(bookToSave.getAuthor());
    }
}
