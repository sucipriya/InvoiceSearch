import styled from "styled-components";
import { Button } from "react-bootstrap";

export const TableContainer = styled.div`
  padding: 15px;
  height: calc(100vh - 200px);
  overflow: auto;
  table {
    border-spacing: 0;
    border: 1px solid #c1c1c1;
    border-collapse: inherit;
    border-radius: 5px;
    thead {
      position: sticky;
      top: 0;
      background-color: #fff;
    }
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid #c1c1c1;
      border-right: 1px solid #c1c1c1;
      border-collapse: collapse;
      font-size: 15px;
      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;

export const StyleButton = styled(Button)`
  height: 37px;
  background-color: aquamarine;
  padding: 2px 25px;
`;

export const StyledHeader = styled.h2`
  background-color: aquamarine;
  padding: 10px;
  color: #524c4c;
`;

export const PaginationContainer = styled.div`
  padding: 10px 15px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  button,
  span,
  select,
  input {
    margin-left: 10px;
    border-color: lightgrey;
    border-radius: 5px;
  }
`;
