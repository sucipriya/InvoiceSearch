import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import styled from "styled-components/macro";
import _ from "lodash";

const StyledAlert = styled.div`
  position: fixed;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  top: 46px;
  z-index: 99999;
  height: auto;
`;
const CustomAlert = ({
  message,
  variant = "success",
  title,
  autoClose = true,
  delay = 2000,
  show = false,
  hideCloseBtn = false,
  onCloseCallBack,
}) => {
  useEffect(() => {
    if (autoClose) {
      setTimeout(() => {
        onCloseAlert();
      }, delay);
    }
  }, [autoClose]);

  const onCloseAlert = () => {
    onCloseCallBack(false);
  };

  return (
    <StyledAlert>
      <Alert
        variant={title === "failed" ? "danger" : variant}
        onClose={onCloseAlert}
        dismissible={!hideCloseBtn}
        style={{ borderRadius: "10px" }}
      >
        <Alert.Heading style={{ fontSize: "16px", fontWeight: "600" }}>
          {_.startCase(_.toLower(title))}
        </Alert.Heading>
        <p>{message}</p>
      </Alert>
    </StyledAlert>
  );
};
export default CustomAlert;
