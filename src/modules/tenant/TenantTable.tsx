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
import { tenantAPI, Tenant } from "./api";

interface AlertType {
  severity: "success" | "error" | "warning" | "info";
  message: string;
}

const TenantTable: React.FC = () => {
  const navigate = useNavigate();

  const [alert, setAlert] = useState<AlertType | null>(null);
  const [selectionModel, setSelectionModel] = useState<(string | number)[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);

  const fetchTenants = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tenantAPI.getAll();
      setTenants(data);
      console.log("تم تحميل المؤسسات بنجاح:", data.length);

      if (data.length === 0) {
        setAlert({
          severity: "info",
          message: "لا توجد مؤسسات. اضغط على 'جديد' لإضافة أول مؤسسة.",
        });
      }
    } catch (err: any) {
      setError({ message: err.message || "فشل في جلب المؤسسات" });
      setTenants([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const handleRowClick = (params: { id: string | number; row: Tenant }) => {
    if (params && params.id) {
      navigate(`/modules/tenant/edit/${params.id}`);
    }
  };

  const handleAddNew = () => {
    navigate("/modules/tenant/add");
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
      const result = await tenantAPI.deleteMultiple(idsToDelete);

      if (result.success) {
        setTenants((prev) =>
          prev.filter((tenant) => !selectionModel.includes(tenant.id))
        );
        setAlert({
          severity: "success",
          message: `تم حذف ${selectionModel.length} مؤسسة بنجاح`,
        });
        setSelectionModel([]);
      } else {
        setAlert({
          severity: "error",
          message: result.error || "فشل في حذف المؤسسات",
        });
      }
    } catch (err: any) {
      setAlert({
        severity: "error",
        message: err.message || "فشل في حذف المؤسسات",
      });
    } finally {
      setConfirmDelete(false);
      setIsDeleting(false);
    }
  };

  const handleRefresh = () => {
    fetchTenants();
    setAlert({ severity: "info", message: "تم تحديث البيانات" });
  };

  const columns = [
    {
      field: "tenantName",
      headerName: "اسم المؤسسة",
      flex: 1.5,
    },
    {
      field: "institutionName",
      headerName: "اسم المنشأة",
      flex: 1.5,
    },
    {
      field: "cityName",
      headerName: "المدينة",
      flex: 1,
      renderCell: (params: { value: string; row: Tenant }) => {
        return params.row.cityName || "غير محدد";
      },
    },
    {
      field: "email",
      headerName: "البريد الإلكتروني",
      flex: 1.2,
    },
    {
      field: "phone",
      headerName: "رقم الهاتف",
      flex: 1,
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
            إدارة المؤسسات
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
            مؤسسة جديدة
          </Button>
          {/* <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteSelected}
            disabled={selectionModel.length === 0 || isDeleting}
            size="small"
            sx={{ textTransform: "none" }}
          >
            حذف
          </Button> */}
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
          rows={tenants}
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
            ? "هل أنت متأكد من حذف هذه المؤسسة؟ لا يمكن التراجع عن هذا الإجراء."
            : `هل أنت متأكد من حذف ${selectionModel.length} مؤسسات؟ لا يمكن التراجع عن هذا الإجراء.`
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

export default TenantTable;
