import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Alert,
  Snackbar,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import FinancialsDataGrid from "../../shared/components/FinancialsDataGrid/FinancialsDataGrid";
import ConfirmationDialog from "../../shared/components/ConfirmationDialog";
import { positionAPI, Position } from "./api";

interface AlertType {
  severity: "success" | "error" | "warning" | "info";
  message: string;
}

const PositionTable: React.FC = () => {
  const navigate = useNavigate();

  const [alert, setAlert] = useState<AlertType | null>(null);
  const [selectionModel, setSelectionModel] = useState<(string | number)[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);

  const fetchPositions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await positionAPI.getAll();
      setPositions(data);
      console.log("تم تحميل المناصب بنجاح:", data.length);

      if (data.length === 0) {
        setAlert({
          severity: "info",
          message: "لا توجد مناصب. اضغط على 'جديد' لإضافة أول منصب.",
        });
      }
    } catch (err: any) {
      setError({ message: err.message || "فشل في جلب المناصب" });
      setPositions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const handleRowClick = (params: { id: string | number; row: Position }) => {
    if (params && params.id) {
      navigate(`/modules/positions/edit/${params.id}`);
    }
  };

  const handleAddNew = () => {
    navigate("/modules/positions/add");
  };

  const handleDeleteSelected = () => {
    if (selectionModel.length === 0) {
      setAlert({
        severity: "warning",
        message: "يرجى اختيار عنصر واحد على الأقل",
      });
      return;
    }
    setConfirmDelete(true);
  };

  const confirmDeleteItems = async () => {
    setIsDeleting(true);
    try {
      const idsToDelete = selectionModel.map((id) => Number(id));
      const result = await positionAPI.deleteMultiple(idsToDelete);

      if (result.success) {
        // إزالة العناصر من القائمة المحلية
        setPositions((prev) =>
          prev.filter((position) => !selectionModel.includes(position.id))
        );
        setAlert({
          severity: "success",
          message: `تم حذف ${selectionModel.length} منصب بنجاح`,
        });
        setSelectionModel([]);
      } else {
        setAlert({
          severity: "error",
          message: result.error || "فشل في حذف المناصب",
        });
      }
    } catch (err: any) {
      setAlert({
        severity: "error",
        message: err.message || "فشل في حذف المناصب",
      });
    } finally {
      setConfirmDelete(false);
      setIsDeleting(false);
    }
  };

  const handleRefresh = () => {
    fetchPositions();
    setAlert({ severity: "info", message: "تم تحديث البيانات" });
  };

  const columns = [
    {
      field: "title",
      headerName: "اسم المنصب",
      flex: 1.5,
    },
    {
      field: "code",
      headerName: "رمز المنصب",
      flex: 1,
    },
    {
      field: "departmentName",
      headerName: "القسم",
      flex: 1.2,
      renderCell: (params: { value: string; row: Position }) => {
        return params.row.departmentName || `قسم ${params.row.departmentId}`;
      },
    },
  ];

  return (
    <Box sx={{ maxWidth: "100%", mt: 0, direction: "rtl" }}>
      {/* شريط الأدوات */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          p: 2,
          backgroundColor: "white",
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            إدارة المناصب
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            size="small"
            sx={{ textTransform: "none" }}
          >
            منصب جديد
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteSelected}
            disabled={selectionModel.length === 0 || isDeleting}
            size="small"
            sx={{ textTransform: "none" }}
          >
            حذف
          </Button>
          <Tooltip title="تحديث البيانات">
            <IconButton
              onClick={handleRefresh}
              disabled={isLoading}
              size="small"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}

      <Box sx={{ height: "calc(100vh - 260px)", width: "100%" }}>
        <FinancialsDataGrid
          rows={positions}
          columns={columns}
          loading={isLoading}
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={setSelectionModel}
          onRowClick={handleRowClick}
          checkboxSelection
          getRowId={(row) => row.id}
        />
      </Box>

      <ConfirmationDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={confirmDeleteItems}
        title="تأكيد الحذف"
        message={
          selectionModel.length === 1
            ? "هل أنت متأكد من حذف هذا المنصب؟ لا يمكن التراجع عن هذا الإجراء."
            : `هل أنت متأكد من حذف ${selectionModel.length} مناصب؟ لا يمكن التراجع عن هذا الإجراء.`
        }
        loading={isDeleting}
        confirmButtonColor="error"
        confirmButtonText="حذف"
        cancelButtonText="إلغاء"
      />

      <Snackbar
        open={!!alert}
        autoHideDuration={6000}
        onClose={() => setAlert(null)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {alert && (
          <Alert
            onClose={() => setAlert(null)}
            severity={alert.severity}
            variant="filled"
            sx={{ minWidth: 300 }}
          >
            {alert.message}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default PositionTable;
