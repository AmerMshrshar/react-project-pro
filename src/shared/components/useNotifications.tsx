import React, { useState, useRef } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface NotificationState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

const useNotifications = () => {
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: "",
    severity: "info",
  });

  const lastMessageRef = useRef<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showNotification = (message: string, severity: AlertColor = "info") => {
    if (lastMessageRef.current === message) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    lastMessageRef.current = message;

    setNotification({
      open: true,
      message,
      severity,
    });

    timeoutRef.current = setTimeout(() => {
      lastMessageRef.current = "";
    }, 3000);
  };

  const showSuccess = (message: string) => {
    showNotification(message, "success");
  };

  const showError = (message: string) => {
    showNotification(message, "error");
  };

  const showWarning = (message: string) => {
    showNotification(message, "warning");
  };

  const showInfo = (message: string) => {
    showNotification(message, "info");
  };

  const hideNotification = () => {
    setNotification((prev) => ({
      ...prev,
      open: false,
    }));
    lastMessageRef.current = "";
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const NotificationComponent = () => (
    <Snackbar
      open={notification.open}
      autoHideDuration={6000}
      onClose={hideNotification}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      sx={{
        zIndex: 9999,
        "& .MuiSnackbarContent-root": {
          direction: "rtl",
        },
      }}
    >
      <Alert
        onClose={hideNotification}
        severity={notification.severity}
        variant="filled"
        sx={{
          width: "100%",
          minWidth: 288,
          boxShadow: 3,
          borderRadius: 2,
          direction: "rtl",
          textAlign: "right",
        }}
        elevation={6}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
    NotificationComponent,
    notification,
  };
};

export default useNotifications;
