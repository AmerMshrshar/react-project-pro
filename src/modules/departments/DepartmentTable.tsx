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
import { departmentAPI, Department } from "./api";

interface AlertType {
  severity: "success" | "error" | "warning" | "info";
  message: string;
}

const DepartmentTable: React.FC = () => {
  const navigate = useNavigate();

  const [alert, setAlert] = useState<AlertType | null>(null);
  const [selectionModel, setSelectionModel] = useState<(string | number)[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);

  const fetchDepartments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await departmentAPI.getAll();
      setDepartments(data);
      console.log("تم تحميل الأقسام بنجاح:", data.length);

      if (data.length === 0) {
        setAlert({
          severity: "info",
          message: "لا توجد أقسام. اضغط على 'جديد' لإضافة أول قسم.",
        });
      }
    } catch (err: any) {
      setError({ message: err.message || "فشل في جلب الأقسام" });
      setDepartments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleRowClick = (params: { id: string | number; row: Department }) => {
    if (params && params.id) {
      navigate(`/modules/departments/edit/${params.id}`);
    }
  };

  const handleAddNew = () => {
    navigate("/modules/departments/add");
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
      const result = await departmentAPI.deleteMultiple(idsToDelete);

      if (result.success) {
        setDepartments((prev) =>
          prev.filter((dept) => !selectionModel.includes(dept.id))
        );
        setAlert({
          severity: "success",
          message: `تم حذف ${selectionModel.length} قسم بنجاح`,
        });
        setSelectionModel([]);
      } else {
        setAlert({
          severity: "error",
          message: result.error || "فشل في حذف الأقسام",
        });
      }
    } catch (err: any) {
      setAlert({
        severity: "error",
        message: err.message || "فشل في حذف الأقسام",
      });
    } finally {
      setConfirmDelete(false);
      setIsDeleting(false);
    }
  };

  const handleRefresh = () => {
    fetchDepartments();
    setAlert({ severity: "info", message: "تم تحديث البيانات" });
  };

  const columns = [
    {
      field: "departmentName",
      headerName: "اسم القسم",
      flex: 1.5,
    },
    {
      field: "budget",
      headerName: "الميزانية",
      flex: 1,
      type: "number",
      renderCell: (params: { value: number }) => {
        return new Intl.NumberFormat("ar-SA", {
          style: "currency",
          currency: "SAR",
        }).format(params.value || 0);
      },
    },
  ];

  return (
    <Box sx={{ maxWidth: "100%", mt: 0, direction: "rtl" }}>
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
            إدارة الأقسام
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
            قسم جديد
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
          rows={departments}
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
            ? "هل أنت متأكد من حذف هذا القسم؟ لا يمكن التراجع عن هذا الإجراء."
            : `هل أنت متأكد من حذف ${selectionModel.length} أقسام؟ لا يمكن التراجع عن هذا الإجراء.`
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

export default DepartmentTable;
