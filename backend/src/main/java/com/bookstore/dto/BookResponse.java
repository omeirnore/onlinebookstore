package com.bookstore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
@AllArgsConstructor
public class BookResponse {
    private Long bookId;
    private String title;
    private String author;
    private String isbn;
    private String description;
    private BigDecimal price;
    private String coverUrl;
    private Integer categoryId;
    private String categoryName;
    private Integer stockQty;
    private Boolean isFeatured;
    private BigDecimal rating;
    private boolean inStock;
}
