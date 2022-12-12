import styled from "styled-components";

export const UploadContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 15px;
  label {
    margin-right: 10px;
  }
  progress {
    margin-right: 10px;
  }
  label#selected-file-name {
    background-color: #00bcd4;
    color: #fff;
    border-radius: 25px;
    padding: 0px 15px;
  }
`;

export const UploadButton = styled.label`
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: aquamarine;
  display: block;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 5px;
`;

export const SubmitButton = styled.button`
  height: 37px;
  background-color: aquamarine;
  padding: 2px 25px;
  border-radius: 5px;
  border-color: lightgrey;
`;

export const CancelButton = styled.button`
  border-radius: 75%;
  border-color: red;
  background-color: #fae0e0;
`;
