import React, { useEffect, useReducer } from "react";
// import styled from "styled-components";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { ReducerStore } from "./reducer";

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 10,
  totalCount: 100,
  globalFilter: "",
};

const PAGE_CHANGED = "PAGE_CHANGED";
const PAGE_SIZE_CHANGED = "PAGE_SIZE_CHANGED";
const TOTAL_COUNT_CHANGED = "TOTAL_COUNT_CHANGED";

export function Table({ columns, data, inputDataCount, onChangePageCallBack }) {
  const [{}, dispatch] = useReducer(ReducerStore, initialState);
  const props = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    state,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
  } = props;

  console.log("-inputs", inputDataCount);
  useEffect(() => {
    // console.log(globalFilter);
  }, [globalFilter]);

  //   useEffect(() => {
  //     // dispatch({ type: PAGE_CHANGED, payload: pageIndex });
  //     onChangePageCallBack({ pageIndex, pageSize });
  //   }, [pageIndex]);

  //   useEffect(() => {
  //     // dispatch({ type: PAGE_SIZE_CHANGED, payload: pageSize });
  //     onChangePageCallBack({ pageIndex, pageSize });

  //     gotoPage(0);
  //   }, [pageSize, gotoPage]);

  //   //page count dependecy
  //   useEffect(() => {
  //     if (data) {
  //       //   dispatch({
  //       //     type: TOTAL_COUNT_CHANGED,
  //       //     payload: data.length,
  //       //   });
  //       onChangePageCallBack({ pageIndex, pageSize, totalcount: data.length });
  //     }
  //   }, [data]);
  console.log("--pageOptions", pageOptions);
  return (
    <>
      {/* {console.log(globalFilter)} */}
      <input
        type="text"
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>
                  {column.render("Header")}
                  {/* Render the columns filter UI */}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
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
            defaultValue={pageIndex + 1}
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
      </div>

      <br />

      <br />
      {/* <div>Showing the first  results of {rows.length} rows</div> */}
      <div>
        <pre>
          <code>{JSON.stringify(state.filters, null, 2)}</code>
        </pre>
      </div>
    </>
  );
}
