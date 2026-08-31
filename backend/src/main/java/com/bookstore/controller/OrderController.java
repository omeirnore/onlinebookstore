package com.bookstore.controller;

import com.bookstore.dto.CreateOrderRequest;
import com.bookstore.dto.OrderResponse;
import com.bookstore.security.AppUserPrincipal;
import com.bookstore.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal AppUserPrincipal principal
    ) {
        OrderResponse response = orderService.createOrder(principal.getUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<OrderResponse> getOrders(@AuthenticationPrincipal AppUserPrincipal principal) {
        return orderService.findOrdersForUser(principal.getUserId());
    }

    @GetMapping("/{id}")
    public OrderResponse getOrder(@PathVariable Long id, @AuthenticationPrincipal AppUserPrincipal principal) {
        return orderService.findOrderForUser(id, principal.getUserId());
    }
}
