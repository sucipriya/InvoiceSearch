package com.reader.csv.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.reader.csv.entity.CustomerData;
import com.reader.csv.helper.CSVHelper;
import com.reader.csv.repository.CustomerDataRepository;

@Service
public class CSVService {

	@Autowired
	CustomerDataRepository repository;

	public void save(MultipartFile file) {
		try {
			List<CustomerData> customerData = CSVHelper.csvToData(file.getInputStream());
			repository.saveAll(customerData);
		} catch (IOException e) {
			throw new RuntimeException("Failed to store csv data: " + e.getMessage());
		}
	}

	public ByteArrayInputStream load() {
		List<CustomerData> customerData = repository.findAll();
		ByteArrayInputStream in = CSVHelper.dataToCsv(customerData);
		return in;
	}

	public List<CustomerData> getAllCustomerData() {
		try {
			List<CustomerData> findAll = repository.findAll();
			return findAll;
		} catch (Exception e) {
			throw new RuntimeException("Failed to store csv data: " + e.getMessage());
		}
	}

	public List<CustomerData> findDataWithSorting(String field) {
		return repository.findAll(Sort.by(Sort.Direction.ASC, field));
	}

	public Page<CustomerData> findDataWithPagination(int offset, int pageSize) {
		Page<CustomerData> products = repository.findAll(PageRequest.of(offset, pageSize));
		return products;
	}

	public Page<CustomerData> findDataWithPaginationAndSorting(int offset, int pageSize, String field) {
		Page<CustomerData> products = repository.findAll(PageRequest.of(offset, pageSize).withSort(Sort.by(field)));
		return products;
	}

	public Page<CustomerData> findRecordsWithFieldsAndPageLimit(String searchInput, String searchField,
			int recordsLimit, int pageNumber) {
		Page<CustomerData> products = null;
		if (searchField.equalsIgnoreCase("invoiceNo")) {
			products = repository.findByInvoiceNoContaining(searchInput, PageRequest.of(pageNumber, recordsLimit));
		} else if (searchField.equalsIgnoreCase("stockCode")) {
			products = repository.findByStockCodeContaining(searchInput, PageRequest.of(pageNumber, recordsLimit));
		} else if (searchField.equalsIgnoreCase("description")) {
			products = repository.findByDescriptionContaining(searchInput, PageRequest.of(pageNumber, recordsLimit));
		} else if (searchField.equalsIgnoreCase("quantity")) {
			products = repository.findByQuantityContaining(searchInput, PageRequest.of(pageNumber, recordsLimit));
		} else if (searchField.equalsIgnoreCase("invoiceDate")) {
			products = repository.findByInvoiceDateContaining(searchInput, PageRequest.of(pageNumber, recordsLimit));
		} else if (searchField.equalsIgnoreCase("unitPrice")) {
			try {
				products = repository.findByUnitPrice(Double.parseDouble(searchInput),
						PageRequest.of(pageNumber, recordsLimit));
			} catch (Exception e) {
				// TODO: handle exception
			}
		} else if (searchField.equalsIgnoreCase("customerId")) {
			products = repository.findByCustomerIdContaining(searchInput, PageRequest.of(pageNumber, recordsLimit));
		} else {
			products = repository.findByCountryContaining(searchInput, PageRequest.of(pageNumber, recordsLimit));
		}

		return products;
	}
}