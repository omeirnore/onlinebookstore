package com.bookstore.config;

import com.bookstore.model.Book;
import com.bookstore.model.Category;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private record SeedBook(
            String title, String author, String isbn, String categoryName,
            String price, int stock, boolean featured, String rating, String description
    ) {
    }

    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;

    @Override
    public void run(String... args) {
        Map<String, Category> categories = seedCategories();
        seedBooks(categories);
    }

    private Map<String, Category> seedCategories() {
        List<String> names = List.of("Fiction", "Non-Fiction", "Science", "History", "Fantasy", "Biography");
        Map<String, Category> result = new HashMap<>();
        for (String name : names) {
            Category category = categoryRepository.findAll().stream()
                    .filter(c -> c.getName().equalsIgnoreCase(name))
                    .findFirst()
                    .orElseGet(() -> categoryRepository.save(Category.builder().name(name).build()));
            result.put(name, category);
        }
        return result;
    }

    private void seedBooks(Map<String, Category> categories) {
        if (bookRepository.count() > 0) {
            return;
        }

        List<SeedBook> seeds = List.of(
                new SeedBook("The Silent Orchard", "Elena Marsh", "9780000000001", "Fiction", "45.5", 12, true, "4.5", "A quiet family secret unravels across three generations of a New England orchard."),
                new SeedBook("Fault Lines", "Grace Whitfield", "9780000000002", "Fiction", "38.0", 8, true, "4.2", "Two estranged sisters confront the earthquake that shaped their childhood."),
                new SeedBook("The Cartographer's Daughter", "Marcus Lien", "9780000000003", "Fiction", "42.0", 0, false, "4.7", "A mapmaker's apprentice discovers a coastline that shouldn't exist."),
                new SeedBook("Deep Work Revisited", "Priya Anand", "9780000000004", "Non-Fiction", "29.99", 20, true, "4.4", "An updated field guide to focused, distraction-free work in the age of AI."),
                new SeedBook("Atomic Habits, Field Notes", "Dana Cole", "9780000000005", "Non-Fiction", "24.5", 15, false, "4.1", "Practical case studies applying habit science to everyday routines."),
                new SeedBook("The Quiet Economy", "Samuel Otieno", "9780000000006", "Non-Fiction", "33.0", 10, false, "3.9", "How informal markets quietly power half the world's commerce."),
                new SeedBook("A Brief History of Almost Everything", "Wendy Zhao", "9780000000007", "Science", "36.75", 18, true, "4.6", "A lively tour through physics, biology, and the questions that connect them."),
                new SeedBook("The Genome Within", "Ravi Chandran", "9780000000008", "Science", "41.2", 6, false, "4.3", "An accessible dive into gene editing and the ethics that follow it."),
                new SeedBook("Ocean's Edge", "Fiona Marlowe", "9780000000009", "Science", "27.0", 0, false, "4.0", "A marine biologist's account of coral reefs on the brink and the fight to save them."),
                new SeedBook("Empires of Sand", "Youssef Haddad", "9780000000010", "History", "39.99", 14, true, "4.5", "The rise and fall of trade empires along the ancient Silk Road."),
                new SeedBook("The Winter Republic", "Helena Novak", "9780000000011", "History", "34.5", 9, false, "4.2", "A gripping account of a nation forged in a single brutal winter."),
                new SeedBook("Letters from the Front", "Arthur Pemberton", "9780000000012", "History", "22.0", 0, false, "3.8", "Personal correspondence that reframes a century-old conflict."),
                new SeedBook("The Glass Throne", "Isolde Faye", "9780000000013", "Fantasy", "31.0", 25, true, "4.8", "A dethroned princess must reclaim her kingdom with a court of exiled mages."),
                new SeedBook("Wolves of the Ember Wood", "Tobias Kane", "9780000000014", "Fantasy", "28.5", 11, false, "4.4", "A hunter and a shapeshifter forge an uneasy alliance to stop an ancient blight."),
                new SeedBook("The Last Cartomancer", "Nadia Solheim", "9780000000015", "Fantasy", "35.0", 7, false, "4.6", "Fortunes are read in torn playing cards in a city built on debts to the dead."),
                new SeedBook("Running on Empty Skies", "Marcus Vell", "9780000000016", "Biography", "26.75", 13, true, "4.3", "The memoir of a record-breaking solo aviator who never learned to swim."),
                new SeedBook("Ink and Iron", "Colette Ferrand", "9780000000017", "Biography", "30.0", 5, false, "4.1", "A sculptor's life told through the fires, failures, and forges that shaped her work."),
                new SeedBook("The Long Apprenticeship", "David Okafor", "9780000000018", "Biography", "23.99", 0, false, "3.7", "Decades in a master carpenter's workshop, and what patience really teaches."),
                new SeedBook("Signal and Noise", "Renata Kovacs", "9780000000019", "Non-Fiction", "32.5", 16, false, "4.0", "A statistician's guide to spotting real patterns in a world of false ones."),
                new SeedBook("The Orchard at Dusk", "Elena Marsh", "9780000000020", "Fiction", "27.5", 9, false, "4.2", "A standalone companion novella returning to the Silent Orchard's world.")
        );

        List<Book> books = seeds.stream().map(s -> Book.builder()
                .title(s.title())
                .author(s.author())
                .isbn(s.isbn())
                .description(s.description())
                .price(new BigDecimal(s.price()))
                .coverUrl("https://covers.openlibrary.org/b/isbn/" + s.isbn() + "-M.jpg")
                .category(categories.get(s.categoryName()))
                .stockQty(s.stock())
                .isFeatured(s.featured())
                .rating(new BigDecimal(s.rating()))
                .build()
        ).toList();

        bookRepository.saveAll(books);
    }
}
