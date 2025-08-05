import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import TenantTable from "./TenantTable";
import TenantAdd from "./TenantAdd";
import TenantEdit from "./TenantEdit";

const SimpleErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <p>Something went wrong. Please refresh the page.</p>
        <button onClick={() => setHasError(false)}>Try again</button>
      </Box>
    );
  }

  return <>{children}</>;
};

const TenantRouter: React.FC = () => {
  return (
    <SimpleErrorBoundary>
      <Routes>
        <Route index element={<TenantTable />} />
        <Route path="add" element={<TenantAdd />} />
        <Route path="edit/:id" element={<TenantEdit />} />
        <Route path="tenant-table" element={<TenantTable />} />
      </Routes>
    </SimpleErrorBoundary>
  );
};

export default TenantRouter;
