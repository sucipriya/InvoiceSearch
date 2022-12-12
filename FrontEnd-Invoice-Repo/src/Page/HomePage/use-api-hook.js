import { useState } from "react";
import axios from "axios";

export const fetchUploadedData = async (page, pageSize) => {
  // console.log("-page", page, pageSize);
  // const offset = page * pageSize;
  try {
    const response = await fetch(
      `http://localhost:8080/invoice/pagination/${page}/${pageSize}`,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    const data = await response.json();

    return data;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};

export const fetchSearchData = async (searchKey, searchBy, page, pageSize) => {
  try {
    console.log("--search api", searchKey, searchBy, page, pageSize);

    const response = await fetch(
      `http://localhost:8080/invoice/search?searchField=${searchBy}&searchInput=${searchKey}&pageNumber=${page}&recordsLimit=${pageSize}`,
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    const data = await response.json();

    return data;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};

export const useFileUploadHook = () => {
  const [state, setState] = useState({
    isLoading: false,
    error: "",
    uploadedPregress: 0,
    showAlert: {},
  });
  const axiosController = new AbortController();
  const config = {
    onUploadProgress: (data) => {
      setState((prevState) => ({
        ...prevState,
        uploadedPregress: Math.round((data.loaded * 100) / data.total),
      }));
    },
    signal: axiosController.signal,
  };

  const onSubmitFile = (payload = {}) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
      error: "",
      uploadedPregress: 0,
    }));
    axios
      .post("http://localhost:8080/invoice/file/upload", payload, config)
      .then((response) => {
        if (response && response.status === 200) {
          //   alert(response.data.message);
          setState((prevState) => ({
            ...prevState,
            showAlert: {
              show: true,
              title: "success",
              message: response.data.message,
            },
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            showAlert: {
              show: true,
              title: "failed",
              message: response.data.message,
            },
          }));
        }
        setState((prevState) => ({ ...prevState, isLoading: false }));
      })
      .catch((error) => {
        setState((prevState) => ({ ...prevState, isLoading: false }));
        setState((prevState) => ({
          ...prevState,
          showAlert: {
            show: true,
            title: "failed",
            message: error.message,
          },
        }));
        console.log("error: ", error.message);
      });
  };

  const onCancel = () => {
    axiosController.abort();
  };

  return {
    onSubmitFile: onSubmitFile,
    isLoading: state.isLoading,
    showAlert: state.showAlert,
    error: state.error,
    uploadedPregress: state.uploadedPregress,
    onCancelFileUpload: onCancel,
    updateApiState: setState,
  };
};
