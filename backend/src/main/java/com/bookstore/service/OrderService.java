package com.bookstore.service;

import com.bookstore.dto.CreateOrderRequest;
import com.bookstore.dto.OrderItemRequest;
import com.bookstore.dto.OrderItemResponse;
import com.bookstore.dto.OrderResponse;
import com.bookstore.exception.InsufficientStockException;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.model.Book;
import com.bookstore.model.Order;
import com.bookstore.model.OrderItem;
import com.bookstore.model.User;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.OrderRepository;
import com.bookstore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Transactional
    public OrderResponse createOrder(Long userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Merge duplicate book entries so the same book is only decremented once.
        Map<Long, Integer> quantitiesByBookId = new LinkedHashMap<>();
        for (OrderItemRequest item : request.getItems()) {
            quantitiesByBookId.merge(item.getBookId(), item.getQuantity(), Integer::sum);
        }

        Order order = Order.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .totalAmount(BigDecimal.ZERO)
                .build();

        BigDecimal total = BigDecimal.ZERO;
        for (Map.Entry<Long, Integer> entry : quantitiesByBookId.entrySet()) {
            Long bookId = entry.getKey();
            int quantity = entry.getValue();

            Book book = bookRepository.findById(bookId)
                    .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + bookId));

            if (book.getStockQty() == null || book.getStockQty() < quantity) {
                throw new InsufficientStockException(
                        "Not enough stock for \"" + book.getTitle() + "\" (requested " + quantity
                                + ", available " + (book.getStockQty() == null ? 0 : book.getStockQty()) + ")"
                );
            }

            book.setStockQty(book.getStockQty() - quantity);
            bookRepository.save(book);

            BigDecimal lineTotal = book.getPrice().multiply(BigDecimal.valueOf(quantity));
            total = total.add(lineTotal);

            order.addItem(OrderItem.builder()
                    .book(book)
                    .quantity(quantity)
                    .unitPrice(book.getPrice())
                    .build());
        }

        order.setTotalAmount(total);
        Order saved = orderRepository.save(order);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findOrdersForUser(Long userId) {
        return orderRepository.findByUser_UserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse findOrderForUser(Long orderId, Long userId) {
        Order order = orderRepository.findByOrderIdAndUser_UserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        return toResponse(order);
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .bookId(item.getBook().getBookId())
                        .title(item.getBook().getTitle())
                        .coverUrl(item.getBook().getCoverUrl())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .lineTotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build())
                .toList();

        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .status(order.getStatus().name())
                .shippingAddress(order.getShippingAddress())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }
}
