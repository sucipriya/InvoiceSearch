import React, { useEffect, useMemo, useState, useReducer } from "react";
import { useTable, usePagination } from "react-table";
import { useQuery } from "react-query";
import map from "lodash/map";
import {
  fetchUploadedData,
  useFileUploadHook,
  fetchSearchData,
} from "./use-api-hook";
import { ReducerStore, initialState } from "../../Redux/reducer";
import {
  TableContainer,
  StyleButton,
  StyledHeader,
  PaginationContainer,
} from "./styled";
import UploadFile from "../../Component/Upload";
import CustomAlert from "../../Component/Alert";
import CustomDropdown from "../../Component/Dropdown";
import toLower from "lodash/toLower";

const PAGE_CHANGED = "PAGE_CHANGED";
const PAGE_SIZE_CHANGED = "PAGE_SIZE_CHANGED";
const TOTAL_COUNT_CHANGED = "TOTAL_COUNT_CHANGED";

const ListTable = () => {
  const [{ queryPageIndex, queryPageSize, totalCount }, dispatch] = useReducer(
    ReducerStore,
    initialState
  );
  const [data, setData] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [selectedFile, setFile] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchBy, setSearchBy] = useState("");

  const columns = useMemo(
    () => [
      {
        Header: "country",
        accessor: "country",
      },
      {
        Header: "customer Id",
        accessor: "customerId",
      },
      {
        Header: "description",
        accessor: "description",
      },
      {
        Header: "invoice Date",
        accessor: "invoiceDate",
      },
      {
        Header: "invoice No",
        accessor: "invoiceNo",
      },
      {
        Header: "quantity",
        accessor: "quantity",
      },
      {
        Header: "stock Code",
        accessor: "stockCode",
      },
      {
        Header: "unit Price",
        accessor: "unitPrice",
      },
    ],
    []
  );

  const {
    isLoading,
    error,
    data: dataList,
    isSuccess,
  } = useQuery(
    ["list-table", queryPageIndex, queryPageSize],
    () => fetchUploadedData(queryPageIndex, queryPageSize),
    {
      keepPreviousData: true,
      staleTime: Infinity,
    }
  );

  const {
    isLoading: searchDataIsLoading,
    isSuccess: searchDataIsSuccess,
    data: searchData,
    isError: searchDataIsError,
    error: searchDataError,
    refetch: searchDataRefetch,
  } = useQuery(
    ["search-data", searchInput, searchBy, queryPageIndex, queryPageSize],
    () => fetchSearchData(searchInput, searchBy, queryPageIndex, queryPageSize),
    {
      keepPreviousData: true,
      staleTime: Infinity,
      enabled: false,
    }
  );

  const {
    onSubmitFile,
    isLoading: isFileUploading,
    showAlert,
    updateApiState,
    error: isFileUploadError,
    uploaddePregress,
    onCancelFileUpload,
  } = useFileUploadHook();

  useEffect(() => {
    if (!isLoading) {
      setData(dataList?.response?.content);
      setTotalRecord(dataList?.response?.totalElements);
    }
  }, [isLoading, dataList]);

  useEffect(() => {
    if (!searchDataIsLoading) {
      setData(searchData?.response || []);
      setTotalRecord(searchData?.recordCount || 0);
    }
  }, [searchDataIsLoading, searchData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: data ?? [],
      initialState: {
        pageIndex: queryPageIndex,
        pageSize: queryPageSize,
      },
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: isSuccess ? Math.ceil(totalCount / queryPageSize) : null,
    },
    usePagination
  );

  useEffect(() => {
    dispatch({ type: PAGE_CHANGED, payload: pageIndex });
  }, [pageIndex]);

  useEffect(() => {
    dispatch({ type: PAGE_SIZE_CHANGED, payload: pageSize });
    gotoPage(0);
  }, [pageSize, gotoPage]);

  //page count dependecy
  useEffect(() => {
    if (data) {
      dispatch({
        type: TOTAL_COUNT_CHANGED,
        payload: totalRecord,
      });
    }
  }, [data]);

  const onSelectFile = (file) => {
    setFile(file);
  };

  const onClickSubmitButton = () => {
    if (selectedFile && selectedFile.name) {
      const payload = new FormData();
      payload.append("file", selectedFile);
      onSubmitFile(payload);
    }
  };

  const onCloseAlert = () => {
    updateApiState((prevState) => ({
      ...prevState,
      showAlert: { show: false },
    }));
  };

  const onSearchInput = (e) => {
    e.preventDefault();
    if (searchInput !== "" && searchBy !== "") {
      searchDataRefetch();
    }
  };

  if (error) {
    return <p>Error</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <header>
        <StyledHeader>Invoice Search</StyledHeader>
      </header>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <UploadFile
          onUploadFile={onSelectFile}
          selectedFile={selectedFile}
          onSubmitFile={onClickSubmitButton}
          uploadedValue={uploaddePregress}
          isUploading={isFileUploading}
          onCancel={onCancelFileUpload}
        />

        <CustomDropdown
          options={map(columns, "accessor")}
          searchByCallBack={(data) => setSearchBy(toLower(data))}
        />
        <input
          type="text"
          name="searchInput"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{
            height: "37px",
            marginLeft: "10px",
            marginRight: "10px",
            border: "1px solid lightgrey",
            borderRadius: "5px",
          }}
        />
        <StyleButton
          variant="info"
          name="search"
          value="Search"
          onClick={onSearchInput}
        >
          Search
        </StyleButton>
      </div>
      <TableContainer>
        {isSuccess ? (
          <>
            <table {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        {column.render("Header")}
                        {/* <div>
                          {column.canFilter ? column.render("Filter") : null}
                        </div> */}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page?.length ? (
                  page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td>
                      <div>No Records Found</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        ) : null}
      </TableContainer>
      {isSuccess ? (
        <PaginationContainer className="pagination">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </button>{" "}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>{" "}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>{" "}
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <span>
            | Go to page:{" "}
            <input
              type="number"
              value={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              style={{ width: "100px" }}
            />
          </span>{" "}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </PaginationContainer>
      ) : null}
      {showAlert.show ? (
        <CustomAlert
          message={showAlert?.message !== "" ? showAlert?.message : ""}
          title={showAlert.title}
          show={showAlert}
          onCloseCallBack={onCloseAlert}
          autoClose={showAlert?.title === "failed" ? false : true}
        />
      ) : null}
    </>
  );
};

export default ListTable;
