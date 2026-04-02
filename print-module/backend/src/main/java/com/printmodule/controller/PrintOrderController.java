package com.printmodule.controller;

import com.printmodule.model.PrintOrderDTO;
import com.printmodule.service.PrintOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/print")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")//
public class PrintOrderController {

    private final PrintOrderService service;


    @PostMapping("/upload")
    public ResponseEntity<?> uploadPdf(@RequestParam("file") MultipartFile file) {
        try {
            PrintOrderDTO.PageCountResponse response = service.getPageCount(file);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to process PDF: " + e.getMessage()));
        }
    }

    @GetMapping("/price")
    public ResponseEntity<?> calculatePrice(
            @RequestParam String printType,
            @RequestParam Integer pageCount,
            @RequestParam Integer copies) {
        try {
            if (pageCount <= 0 || copies <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Page count and copies must be positive."));
            }
            PrintOrderDTO.PriceResponse response = service.calculatePrice(printType, pageCount, copies);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @PostMapping("/orders")
    public ResponseEntity<?> createOrder(@RequestBody PrintOrderDTO.CreateOrderRequest request) {
        try {
            if (request.getFileName() == null || request.getFileName().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File name is required."));
            }
            if (request.getPageCount() == null || request.getPageCount() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid page count."));
            }
            if (request.getCopies() == null || request.getCopies() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Copies must be at least 1."));
            }
            PrintOrderDTO.OrderResponse response = service.saveOrder(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<List<PrintOrderDTO.OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(service.getAllOrders());
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            service.deleteOrder(id);
            return ResponseEntity.ok(Map.of("message", "Order deleted successfully."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
