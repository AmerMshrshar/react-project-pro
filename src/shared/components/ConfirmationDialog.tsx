import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
  loading?: boolean;
  confirmButtonColor?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  fullWidth?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = "تأكيد العملية",
  message = "هل أنت متأكد من أنك تريد المتابعة؟",
  cancelButtonText = "إلغاء",
  confirmButtonText = "تأكيد",
  loading = false,
  confirmButtonColor = "primary",
  fullWidth = true,
  maxWidth = "sm",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      sx={{
        "& .MuiDialog-paper": {
          direction: "rtl",
        },
      }}
    >
      <DialogTitle id="confirmation-dialog-title" sx={{ textAlign: "right" }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="confirmation-dialog-description"
          sx={{ textAlign: "right", direction: "rtl" }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ direction: "rtl", justifyContent: "flex-start" }}>
        <Button onClick={onClose} disabled={loading} sx={{ ml: 1 }}>
          {cancelButtonText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmButtonColor}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? "جاري المعالجة..." : confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
