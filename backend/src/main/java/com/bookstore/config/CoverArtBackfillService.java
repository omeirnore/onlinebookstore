package com.bookstore.config;

import com.bookstore.model.Book;
import com.bookstore.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
class CoverArtBackfillService {

    private final BookRepository bookRepository;

    /**
     * Regenerates cover art for every book. Idempotent and cheap at this catalogue size;
     * ensures covers are self-contained (no dependency on an external image host) even for
     * rows seeded before generated cover art existed.
     */
    @Transactional
    void backfillAll() {
        List<Book> books = bookRepository.findAll();
        for (Book book : books) {
            String categoryName = book.getCategory() != null ? book.getCategory().getName() : null;
            book.setCoverUrl(CoverArtGenerator.generate(book.getTitle(), book.getAuthor(), categoryName));
        }
        bookRepository.saveAll(books);
    }
}
