import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import PositionTable from "./PositionTable";
import PositionAdd from "./PositionAdd";
import PositionEdit from "./PositionEdit";

// ErrorBoundary بسيط محلي في حالة عدم وجود الملف الأساسي
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

const PositionRouter: React.FC = () => {
  return (
    <SimpleErrorBoundary>
      <Routes>
        <Route index element={<PositionTable />} />
        <Route path="add" element={<PositionAdd />} />
        <Route path="edit/:id" element={<PositionEdit />} />
        <Route path="position-table" element={<PositionTable />} />
      </Routes>
    </SimpleErrorBoundary>
  );
};

export default PositionRouter;
