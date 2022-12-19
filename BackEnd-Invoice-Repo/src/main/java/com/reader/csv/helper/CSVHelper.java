package com.reader.csv.helper;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.csv.QuoteMode;
import org.springframework.web.multipart.MultipartFile;

import com.reader.csv.entity.CustomerData;

public class CSVHelper {

	public static String TYPE = "text/csv";
	static String[] HEADERs = { "InvoiceNo", "StockCode", "Description", "Quantity", "InvoiceDate", "UnitPrice",
			"CustomerID", "Country" };

	public static boolean hasCSVFormat(MultipartFile file) {
		if (TYPE.equals(file.getContentType()) || file.getContentType().equals("application/vnd.ms-excel")) {
			return true;
		}
		return false;
	}

	public static List<CustomerData> csvToData(InputStream is) {
		try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
				CSVParser csvParser = new CSVParser(fileReader,
						CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim());) {
			List<CustomerData> customerDataList = new ArrayList<>();
			Iterable<CSVRecord> csvRecords = csvParser.getRecords();
			for (CSVRecord csvRecord : csvRecords) {
				CustomerData developerTutorial = new CustomerData(csvRecord.get("InvoiceNo"),
						csvRecord.get("StockCode"), csvRecord.get("Description"), csvRecord.get("Quantity"),
						csvRecord.get("InvoiceDate"), Double.parseDouble(csvRecord.get("UnitPrice")),
						csvRecord.get("CustomerID"), csvRecord.get("Country"));
				customerDataList.add(developerTutorial);
			}
			return customerDataList;
		} catch (IOException e) {
			throw new RuntimeException("fail to parse CSV file: " + e.getMessage());
		}
	}

	public static ByteArrayInputStream dataToCsv(List<CustomerData> customerData) {
		final CSVFormat format = CSVFormat.DEFAULT.withQuoteMode(QuoteMode.MINIMAL);
		try (ByteArrayOutputStream out = new ByteArrayOutputStream();
				CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(out), format);) {
			for (CustomerData custData : customerData) {
				List<String> data = Arrays.asList(custData.getInvoiceNo(), custData.getStockCode(),
						custData.getDescription(), custData.getQuantity(), custData.getInvoiceDate(),
						String.valueOf(custData.getUnitPrice()), custData.getCustomerId(), custData.getCountry());
				csvPrinter.printRecord(data);
			}
			csvPrinter.flush();
			return new ByteArrayInputStream(out.toByteArray());
		} catch (IOException e) {
			throw new RuntimeException("Failed to import data to CSV file: " + e.getMessage());
		}
	}
	
}