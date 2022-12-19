package com.reader.csv.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.reader.csv.entity.CustomerData;

@Repository
public interface CustomerDataRepository extends JpaRepository<CustomerData, Long> {
    public Page<CustomerData> findByInvoiceNoContaining(String invoiceNo, Pageable pageable);
    public Page<CustomerData> findByStockCodeContaining(String stockCode, Pageable pageable);
    public Page<CustomerData> findByDescriptionContaining(String description, Pageable pageable);
    public Page<CustomerData> findByQuantityContaining(String quantity, Pageable pageable);
    public Page<CustomerData> findByInvoiceDateContaining(String invoiceDate, Pageable pageable);
    public Page<CustomerData> findByUnitPrice(Double unitPrice, Pageable pageable);
    public Page<CustomerData> findByCustomerIdContaining(String customerId, Pageable pageable);
    public Page<CustomerData> findByCountryContaining(String country, Pageable pageable);
}