import React from "react";
import {
  UploadButton,
  SubmitButton,
  UploadContainer,
  CancelButton,
} from "./styled";

const Upload = ({
  onUploadFile = () => null,
  selectedFile = null,
  isUploading,
  uploadedValue,
  onSubmitFile = () => null,
  onCancel = () => null,
}) => {
  return (
    <UploadContainer>
      <label>Click to upload csv file</label>
      <UploadButton htmlFor="file-upload" title="Click to upload csv file">
        +
      </UploadButton>
      <input
        accept=".csv"
        type="file"
        multiple={false}
        id="file-upload"
        style={{ display: "none" }}
        onChange={(e) => onUploadFile(Array.from(e.target.files)[0])}
      />
      {selectedFile ? (
        <>
          <label id="selected-file-name">{selectedFile.name}</label>
          {isUploading ? (
            <>
              <progress
                max="100"
                value={uploadedValue}
                id="file-upload-progress"
              ></progress>
              <CancelButton title="Cancel" onClick={() => onCancel()}>
                X
              </CancelButton>
            </>
          ) : (
            <SubmitButton onClick={() => onSubmitFile()}>Upload</SubmitButton>
          )}
        </>
      ) : null}
    </UploadContainer>
  );
};
export default Upload;
