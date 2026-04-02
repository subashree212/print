package com.printmodule.service;

import com.printmodule.model.PrintOrder;
import com.printmodule.model.PrintOrderDTO;
import com.printmodule.repository.PrintOrderRepository;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrintOrderService {

    private static final double BLACK_WHITE_PRICE = 2.0;
    private static final double COLOR_PRICE = 5.0;

    private final PrintOrderRepository repository;

   
    public PrintOrderDTO.PageCountResponse getPageCount(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            throw new IllegalArgumentException("Only PDF files are allowed.");
        }

        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            int pageCount = document.getNumberOfPages();
            return PrintOrderDTO.PageCountResponse.builder()
                    .fileName(file.getOriginalFilename())
                    .pageCount(pageCount)
                    .build();
        }
    }

   
    public PrintOrderDTO.PriceResponse calculatePrice(String printType, Integer pageCount, Integer copies) {
        double pricePerPage = "COLOR".equalsIgnoreCase(printType) ? COLOR_PRICE : BLACK_WHITE_PRICE;
        double totalPrice = pricePerPage * pageCount * copies;

        return PrintOrderDTO.PriceResponse.builder()
                .totalPrice(totalPrice)
                .pageCount(pageCount)
                .copies(copies)
                .printType(printType)
                .pricePerPage(pricePerPage)
                .build();
    }

   
    public PrintOrderDTO.OrderResponse saveOrder(PrintOrderDTO.CreateOrderRequest request) {
        double pricePerPage = "COLOR".equalsIgnoreCase(request.getPrintType()) ? COLOR_PRICE : BLACK_WHITE_PRICE;
        double totalPrice = pricePerPage * request.getPageCount() * request.getCopies();

        PrintOrder order = PrintOrder.builder()
                .fileName(request.getFileName())
                .pageCount(request.getPageCount())
                .printType(request.getPrintType().toUpperCase())
                .copies(request.getCopies())
                .totalPrice(totalPrice)
                .build();

        PrintOrder saved = repository.save(order);
        return mapToResponse(saved);
    }

    
    public List<PrintOrderDTO.OrderResponse> getAllOrders() {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

   
    public void deleteOrder(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Order not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private PrintOrderDTO.OrderResponse mapToResponse(PrintOrder order) {
        return PrintOrderDTO.OrderResponse.builder()
                .id(order.getId())
                .fileName(order.getFileName())
                .pageCount(order.getPageCount())
                .printType(order.getPrintType())
                .copies(order.getCopies())
                .totalPrice(order.getTotalPrice())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
