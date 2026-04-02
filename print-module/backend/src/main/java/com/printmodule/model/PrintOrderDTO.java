package com.printmodule.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class PrintOrderDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateOrderRequest {
        private String fileName;
        private Integer pageCount;
        private String printType;
        private Integer copies;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderResponse {
        private Long id;
        private String fileName;
        private Integer pageCount;
        private String printType;
        private Integer copies;
        private Double totalPrice;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PageCountResponse {
        private String fileName;
        private Integer pageCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PriceResponse {
        private Double totalPrice;
        private Integer pageCount;
        private Integer copies;
        private String printType;
        private Double pricePerPage;
    }
}
