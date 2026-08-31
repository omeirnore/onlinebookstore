package com.bookstore.controller;

import com.bookstore.dto.BookResponse;
import com.bookstore.dto.PageResponse;
import com.bookstore.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public PageResponse<BookResponse> getBooks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> genre,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        Pageable pageable = PageRequest.of(page, size, parseSort(sort));
        return bookService.findBooks(search, genre, author, minPrice, maxPrice, inStock, pageable);
    }

    @GetMapping("/featured")
    public List<BookResponse> getFeatured() {
        return bookService.findFeatured();
    }

    @GetMapping("/{id}")
    public BookResponse getBook(@PathVariable Long id) {
        return bookService.findById(id);
    }

    private Sort parseSort(String sort) {
        String[] parts = sort.split(",");
        String property = mapSortProperty(parts[0]);
        Sort.Direction direction = (parts.length > 1 && "asc".equalsIgnoreCase(parts[1]))
                ? Sort.Direction.ASC
                : (parts.length > 1 ? Sort.Direction.DESC : Sort.Direction.DESC);
        return Sort.by(direction, property);
    }

    private String mapSortProperty(String requested) {
        return switch (requested) {
            case "title" -> "title";
            case "price" -> "price";
            case "rating" -> "rating";
            case "newest", "createdAt" -> "createdAt";
            default -> "createdAt";
        };
    }
}
