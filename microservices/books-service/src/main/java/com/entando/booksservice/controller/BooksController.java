package com.entando.booksservice.controller;

import com.entando.booksservice.persistence.Book;
import com.entando.booksservice.persistence.BooksRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BooksController {

    @Autowired
    private BooksRepository repository;

    @GetMapping("/books")
    public List<Book> getBooks() {
        return repository.findAll();
    }

    @PostMapping("/book")
    public Book addBook(@RequestBody Book book) {
        return repository.save(book);
    }
    
    @DeleteMapping("/book/{id}")
    public void deleteBook(@PathVariable("id") long bookId) {
        repository.deleteById(bookId);
    }
}
