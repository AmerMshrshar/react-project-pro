import React from "react";
import {
  Box,
  Paper,
  Button,
  IconButton,
  Divider,
  Tooltip,
  CircularProgress,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";

const ActionsToolbar = ({
  title,
  onNewClick,
  onSaveClick,
  onDeleteClick,
  onBackClick,
  isEditMode = false,
  loading = false,
  loadingStates = {},
  onRefreshClick,
  navigateToForm,
  disableDelete = false,
  additionalActions = [],
  actionGroups = [],
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 1,
        mb: 2,
        mt: -1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        direction: "rtl",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {title && (
          <Typography variant="h6" sx={{ ml: 2, fontWeight: 500 }}>
            {title}
          </Typography>
        )}

        {onBackClick && (
          <IconButton onClick={onBackClick} size="small">
            <ArrowBackIcon />
          </IconButton>
        )}

        {onSaveClick && (
          <Button
            variant="contained"
            startIcon={
              loadingStates.saving ? (
                <CircularProgress size={16} />
              ) : (
                <SaveIcon />
              )
            }
            sx={{ mr: 1, textTransform: "none" }}
            onClick={onSaveClick}
            disabled={loading || loadingStates.saving}
            size="small"
          >
            {isEditMode ? "حفظ" : "تعديل"}
          </Button>
        )}

        {actionGroups.map((group, index) => (
          <React.Fragment key={index}>
            {group.buttons.map((action, buttonIndex) => (
              <Button
                key={buttonIndex}
                variant={action.variant || "text"}
                color={action.color || "primary"}
                startIcon={
                  action.loading ? <CircularProgress size={16} /> : action.icon
                }
                onClick={action.onClick}
                disabled={action.disabled || loading}
                size="small"
                sx={{
                  mr: buttonIndex > 0 ? 1 : 0,
                  textTransform: "none",
                  ...action.sx,
                }}
              >
                {action.label}
              </Button>
            ))}
            {index < actionGroups.length - 1 && (
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            )}
          </React.Fragment>
        ))}
      </Box>

      <Box>
        {onRefreshClick && (
          <Tooltip title="تحديث">
            <IconButton
              onClick={onRefreshClick}
              size="small"
              disabled={loading}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Paper>
  );
};

export default ActionsToolbar;
