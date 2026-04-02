package com.printmodule.repository;

import com.printmodule.model.PrintOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrintOrderRepository extends JpaRepository<PrintOrder, Long> {
    List<PrintOrder> findAllByOrderByCreatedAtDesc();
}
