package com.bookstore.service;

import com.bookstore.dto.BookResponse;
import com.bookstore.dto.PageResponse;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.model.Book;
import com.bookstore.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookService {

    private final BookRepository bookRepository;

    public PageResponse<BookResponse> findBooks(
            String search,
            List<String> categories,
            String author,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean inStock,
            Pageable pageable
    ) {
        Specification<Book> spec = Specification.where(null);

        if (search != null && !search.isBlank()) {
            spec = spec.and(BookSpecifications.search(search.trim()));
        }
        if (categories != null && !categories.isEmpty()) {
            spec = spec.and(BookSpecifications.hasCategoryIn(categories));
        }
        if (author != null && !author.isBlank()) {
            spec = spec.and(BookSpecifications.authorEquals(author.trim()));
        }
        if (minPrice != null) {
            spec = spec.and(BookSpecifications.priceGte(minPrice));
        }
        if (maxPrice != null) {
            spec = spec.and(BookSpecifications.priceLte(maxPrice));
        }
        if (inStock != null) {
            spec = spec.and(BookSpecifications.inStock(inStock));
        }

        Page<Book> page = bookRepository.findAll(spec, pageable);
        return toPageResponse(page);
    }

    public List<BookResponse> findFeatured() {
        return bookRepository.findTop6ByIsFeaturedTrueOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public BookResponse findById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        return toResponse(book);
    }

    private PageResponse<BookResponse> toPageResponse(Page<Book> page) {
        return PageResponse.<BookResponse>builder()
                .content(page.getContent().stream().map(this::toResponse).toList())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    private BookResponse toResponse(Book book) {
        return BookResponse.builder()
                .bookId(book.getBookId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .isbn(book.getIsbn())
                .description(book.getDescription())
                .price(book.getPrice())
                .coverUrl(book.getCoverUrl())
                .categoryId(book.getCategory() != null ? book.getCategory().getCategoryId() : null)
                .categoryName(book.getCategory() != null ? book.getCategory().getName() : null)
                .stockQty(book.getStockQty())
                .isFeatured(book.getIsFeatured())
                .rating(book.getRating())
                .inStock(book.getStockQty() != null && book.getStockQty() > 0)
                .build();
    }
}
