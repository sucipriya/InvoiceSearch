import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import ListTable from "./Page/HomePage/index";

const queryClient = new QueryClient();

function App() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <ListTable />
      </QueryClientProvider>
    </div>
  );
}

export default App;
