import React, { useState, useEffect } from "react";
import { useAsyncDebounce } from "react-table";
import styled from "styled-components";

const GlobalFilterWrapper = styled.div`
  display: flex;
  position: relative;
  height: 33px;
  .column-filter-selection {
    background-color: white !important;
    :hover {
      background: white;
    }
    div[class*="-control"] {
      width: 250px;
    }
    div[class*="-menu"] {
      z-index: 9;
    }
  }
`;

const StyledInput = styled.input`
  border: 0.0625rem solid #cdcdcd;
  line-height: 1.4;
  padding: 0.3125rem 0.625rem;
  border-radius: 0.1875rem;
  min-width: 8.75rem;
  box-sizing: border-box;
  outline: 0;

  :focus:not(:disabled),
  :hover:not(:disabled) {
    border-color: #359ddc;
    box-shadow: 0 0.0625rem 0.0625rem 0 rgba(168, 168, 168, 0.1) inset;
  }
  :disabled {
    background-color: #ececec;
    border: 0;
  }
  padding-left: 2.25rem;
  width: 16.875rem;
`;

const GlobalFilter = ({
  filter,
  setFilter,
  globalSearchPlaceholder,
  tableData,
  className,
}) => {
  const [value, setValue] = useState(filter);

  useEffect(() => {
    if (tableData?.length) {
      setFilter(value);
    }
  }, [tableData]);

  const onChange = useAsyncDebounce((value) => {
    setFilter(value || undefined);
  }, 300);

  return (
    <GlobalFilterWrapper className={className}>
      <i
        className="bi bi-search"
        style={{
          color: "#cdcdcd",
          position: "absolute",
          top: "14%",
          left: "0.8rem",
          fontSize: "1rem",
          zIndex: "9",
        }}
      />
      <StyledInput
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={globalSearchPlaceholder ? globalSearchPlaceholder : ""}
      />
      {value && (
        <i
          className="bi bi-x"
          style={{
            color: "#cdcdcd",
            position: "absolute",
            // top: "5%",
            right: "0.8rem",
            fontSize: "1.5rem",
            zIndex: "9",
            cursor: "pointer",
          }}
          onClick={() => {
            setValue("");
            onChange("");
          }}
        />
      )}
    </GlobalFilterWrapper>
  );
};

export default GlobalFilter;
