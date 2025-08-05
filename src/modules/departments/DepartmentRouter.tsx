import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import DepartmentTable from "./DepartmentTable";
import DepartmentAdd from "./DepartmentAdd";
import DepartmentEdit from "./DepartmentEdit";

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

const DepartmentRouter: React.FC = () => {
  return (
    <SimpleErrorBoundary>
      <Routes>
        <Route index element={<DepartmentTable />} />
        <Route path="add" element={<DepartmentAdd />} />
        <Route path="edit/:id" element={<DepartmentEdit />} />
        <Route path="department-table" element={<DepartmentTable />} />
      </Routes>
    </SimpleErrorBoundary>
  );
};

export default DepartmentRouter;
