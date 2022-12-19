package com.reader.csv.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.reader.csv.entity.CustomerData;
import com.reader.csv.helper.CSVHelper;
import com.reader.csv.response.APIResponse;
import com.reader.csv.response.GenericResponse;
import com.reader.csv.service.CSVService;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping(value = "/invoice")
public class CustomerDataController {

	@Autowired
	CSVService fileService;

	@PostMapping("/file/upload")
	public ResponseEntity<GenericResponse> uploadFile(@RequestParam("file") MultipartFile file) {
		String message = "";

		if (CSVHelper.hasCSVFormat(file)) {
			try {
				fileService.save(file);

				message = "Uploaded the file successfully: " + file.getOriginalFilename();

				String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/csv/download/")
						.path(file.getOriginalFilename()).toUriString();

				return ResponseEntity.status(HttpStatus.OK).body(new GenericResponse(message, fileDownloadUri));
			} catch (Exception e) {
				message = "Could not upload the file: " + file.getOriginalFilename() + "!";
				return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new GenericResponse(message, ""));
			}
		}

		message = "Please upload a csv file!";
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new GenericResponse(message, ""));
	}

	@GetMapping("/customer/data")
	public ResponseEntity<List<CustomerData>> getAllCustomerData() {
		try {
			List<CustomerData> customerData = fileService.getAllCustomerData();

			if (customerData.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}

			return new ResponseEntity<>(customerData, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("customer/data/download/{fileName:.+}")
	public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
		InputStreamResource file = new InputStreamResource(fileService.load());
		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
				.contentType(MediaType.parseMediaType("application/csv")).body(file);
	}

	@GetMapping("/{field}")
	private APIResponse<List<CustomerData>> getProductsWithSort(@PathVariable String field) {
		List<CustomerData> allProducts = fileService.findDataWithSorting(field);
		return new APIResponse<>(allProducts.size(), allProducts);
	}

	@GetMapping("/pagination/{offset}/{pageSize}")
	private APIResponse<Page<CustomerData>> getProductsWithPagination(@PathVariable int offset,
			@PathVariable int pageSize) {
		Page<CustomerData> productsWithPagination = fileService.findDataWithPagination(offset, pageSize);
		return new APIResponse<>(productsWithPagination.getSize(), productsWithPagination);
	}

	@GetMapping("/paginationAndSort/{offset}/{pageSize}/{field}")
	private APIResponse<Page<CustomerData>> getProductsWithPaginationAndSort(@PathVariable int offset,
			@PathVariable int pageSize, @PathVariable String field) {
		Page<CustomerData> productsWithPagination = fileService.findDataWithPaginationAndSorting(offset, pageSize,
				field);
		return new APIResponse<>(productsWithPagination.getSize(), productsWithPagination);
	}

	@GetMapping("/search")
	private APIResponse<List<CustomerData>> getSearchDataWithRecordsLimit(
			@RequestParam(required = true, defaultValue = "") String searchInput, @RequestParam String searchField, @RequestParam int pageNumber,
			@RequestParam int recordsLimit) {
		Page<CustomerData> productsWithPagination = fileService.findRecordsWithFieldsAndPageLimit(searchInput, searchField,
				recordsLimit, pageNumber);
		return new APIResponse<>(productsWithPagination.getTotalPages(), productsWithPagination.getContent());
	}
}