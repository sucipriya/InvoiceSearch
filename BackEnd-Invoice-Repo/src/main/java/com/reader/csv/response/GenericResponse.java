package com.reader.csv.response;

import lombok.Data;

@Data
public class GenericResponse {

	private String message;
	private String fileDownloadUri;

	public GenericResponse(String message, String fileDownloadUri) {
		this.message = message;
		this.fileDownloadUri = fileDownloadUri;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getFileDownloadUri() {
		return fileDownloadUri;
	}

	public void setFileDownloadUri(String fileDownloadUri) {
		this.fileDownloadUri = fileDownloadUri;
	}

}