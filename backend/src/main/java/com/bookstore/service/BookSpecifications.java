package com.bookstore.service;

import com.bookstore.model.Book;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;

public final class BookSpecifications {

    private BookSpecifications() {
    }

    public static Specification<Book> search(String search) {
        return (root, query, cb) -> {
            String like = "%" + search.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("title")), like),
                    cb.like(cb.lower(root.get("author")), like)
            );
        };
    }

    public static Specification<Book> hasCategoryIn(List<String> categoryNames) {
        return (root, query, cb) -> {
            query.distinct(true);
            return root.join("category").get("name").in(categoryNames);
        };
    }

    public static Specification<Book> authorEquals(String author) {
        return (root, query, cb) -> cb.equal(cb.lower(root.get("author")), author.toLowerCase());
    }

    public static Specification<Book> priceGte(BigDecimal min) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), min);
    }

    public static Specification<Book> priceLte(BigDecimal max) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), max);
    }

    public static Specification<Book> inStock(boolean inStock) {
        return (root, query, cb) -> inStock
                ? cb.greaterThan(root.get("stockQty"), 0)
                : cb.lessThanOrEqualTo(root.get("stockQty"), 0);
    }
}
