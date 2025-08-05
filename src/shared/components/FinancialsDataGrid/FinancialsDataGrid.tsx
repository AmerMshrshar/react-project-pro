import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  CircularProgress,
  Typography,
} from "@mui/material";

interface Column {
  field: string;
  headerName: string;
  flex?: number;
  type?: string;
  renderCell?: (params: any) => React.ReactNode;
}

interface FinancialsDataGridProps {
  rows: any[];
  columns: Column[];
  loading?: boolean;
  rowSelectionModel?: any[];
  onRowSelectionModelChange?: (newSelection: any[]) => void;
  onRowClick?: (params: any) => void;
  checkboxSelection?: boolean;
  getRowId?: (row: any) => any;
}

const FinancialsDataGrid: React.FC<FinancialsDataGridProps> = ({
  rows = [],
  columns = [],
  loading = false,
  rowSelectionModel = [],
  onRowSelectionModelChange,
  onRowClick,
  checkboxSelection = false,
  getRowId = (row) => row.id,
}) => {
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = Array.isArray(rows)
        ? rows.map((row) => getRowId(row))
        : [];
      onRowSelectionModelChange?.(newSelecteds);
    } else {
      onRowSelectionModelChange?.([]);
    }
  };

  const handleRowSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    row: any
  ) => {
    event.stopPropagation();
    const selectedIndex = rowSelectionModel.indexOf(getRowId(row));
    let newSelected: any[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(rowSelectionModel, getRowId(row));
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(rowSelectionModel.slice(1));
    } else if (selectedIndex === rowSelectionModel.length - 1) {
      newSelected = newSelected.concat(rowSelectionModel.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        rowSelectionModel.slice(0, selectedIndex),
        rowSelectionModel.slice(selectedIndex + 1)
      );
    }

    onRowSelectionModelChange?.(newSelected);
  };

  const isSelected = (row: any) =>
    rowSelectionModel.indexOf(getRowId(row)) !== -1;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ height: "100%", overflow: "auto" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {checkboxSelection && (
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    rowSelectionModel.length > 0 &&
                    rowSelectionModel.length < (rows?.length || 0)
                  }
                  checked={
                    (rows?.length || 0) > 0 &&
                    rowSelectionModel.length === rows.length
                  }
                  onChange={handleSelectAll}
                  disabled={(rows?.length || 0) === 0}
                />
              </TableCell>
            )}
            {columns.map((column) => (
              <TableCell key={column.field} sx={{ fontWeight: "bold" }}>
                {column.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(rows) && rows.length > 0 ? (
            rows.map((row) => {
              const rowId = getRowId(row);
              const isItemSelected = isSelected(row);

              return (
                <TableRow
                  hover
                  key={rowId}
                  selected={isItemSelected}
                  onClick={() => onRowClick?.({ id: rowId, row })}
                  sx={{
                    cursor: onRowClick ? "pointer" : "default",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  {checkboxSelection && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onChange={(event) => handleRowSelect(event, row)}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.field}>
                      {column.renderCell
                        ? column.renderCell({ value: row[column.field], row })
                        : row[column.field]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (checkboxSelection ? 1 : 0)}
                align="center"
                sx={{ py: 4 }}
              >
                <Typography color="text.secondary">
                  No data to display
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FinancialsDataGrid;
