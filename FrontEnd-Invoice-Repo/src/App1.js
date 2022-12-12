import React, { useState, useEffect, useReducer } from "react";
import { Table } from "./Table";
import { useQuery } from "react-query";
import { fetchUploadedData } from "./fetchData";
import { ReducerStore } from "./reducer";

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 10,
  totalCount: null,
  globalFilter: "",
};

function App1() {
  const [{ queryPageIndex, queryPageSize }, dispatch] = useReducer(
    ReducerStore,
    initialState
  );
  const [totalElement, setTotalElement] = useState("");
  const columns = React.useMemo(
    () => [
      {
        Header: "country",
        accessor: "country",
      },
      {
        Header: "customerId",
        accessor: "customerId",
      },
      {
        Header: "description",
        accessor: "description",
      },
      {
        Header: "invoiceDate",
        accessor: "invoiceDate",
      },
      {
        Header: "invoiceNo",
        accessor: "invoiceNo",
      },
      {
        Header: "quantity",
        accessor: "quantity",
      },
      {
        Header: "stockCode",
        accessor: "stockCode",
      },
      {
        Header: "unitPrice",
        accessor: "unitPrice",
      },
    ],
    []
  );

  // const data = React.useMemo(() => makeData(100), []);
  const [data, setData] = useState([]);
  console.log("--queryPageIndex, queryPageSize", queryPageIndex, queryPageSize);

  const {
    isLoading,
    error,
    data: fetchData,
    isSuccess,
    refetch,
  } = useQuery(
    ["list-table", queryPageIndex, queryPageSize],
    () => fetchUploadedData(queryPageIndex, queryPageSize),
    {
      keepPreviousData: true,
      staleTime: Infinity,
    }
  );

  //   useEffect(() => {
  //     refetch();
  //   }, [queryPageIndex, queryPageSize]);

  useEffect(() => {
    if (!isLoading) {
      console.log("--on scuc", fetchData?.response?.totalElements);
      setData(fetchData?.response?.content);
      setTotalElement(fetchData?.response?.totalElements);
    }
  }, [isLoading, fetchData]);

  const handleReset = () => {
    setData([]);
  };
  console.log("--data", data);
  return (
    <>
      <button onClick={handleReset}>Reset Data</button>
      <Table
        columns={columns}
        data={data}
        inputDataCount={totalElement}
        onChangePageCallBack={(e) => console.log("--e", e)}
      />
    </>
  );
}
export default App1;
