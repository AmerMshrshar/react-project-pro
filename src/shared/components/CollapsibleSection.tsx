import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Stack,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const CustomAccordionForm = ({
  title,
  sections,
  initialData,
  onSubmit,
  onBack,
  submitButtonText = "حفظ",
  backButtonText = "رجوع",
  showAddComponentsButton = false,
  onAddComponentsClick,
  addComponentsButtonText = "إضافة مكونات",
  onSendClick,
  sendButtonText = "إرسال",
  showCancelButton = false,
  onCancel,
  isSubmitDisabled = false,
  errorMessage = "",
}) => {
  const [formData, setFormData] = useState(initialData || {});
  const [expanded, setExpanded] = useState(["panel1"]);
  const [loading, setLoading] = useState(false);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded((prevExpanded) =>
      newExpanded
        ? [...prevExpanded, panel]
        : prevExpanded.filter((p) => p !== panel)
    );
  };

  const handleFormChange = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (error) {
      console.error("خطأ في الإرسال:", error);
    } finally {
      setLoading(false);
    }
  };

  const getButtonIcon = () => {
    if (loading) return null;
    return submitButtonText.toLowerCase().includes("تعديل") ||
      submitButtonText.toLowerCase().includes("edit") ? (
      <EditIcon />
    ) : (
      <SaveIcon />
    );
  };

  return (
    <Box
      sx={{
        maxWidth: "100%",
        mt: 0,
        mb: 1,
        backgroundColor: "transparent",
        border: 0,
        direction: "rtl",
      }}
    >
      {showAddComponentsButton && (
        <Grid
          sx={{ maxWidth: "100%", mb: 3 }}
          container
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={onAddComponentsClick}
              startIcon={<AddCircleOutlineIcon />}
              sx={{ textTransform: "none" }}
            >
              <Typography>{addComponentsButtonText}</Typography>
            </Button>
          </Grid>
        </Grid>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {sections.map((section, index) => (
        <Accordion
          key={`panel${index + 1}`}
          expanded={expanded.includes(`panel${index + 1}`)}
          onChange={handleChange(`panel${index + 1}`)}
          sx={{
            marginBottom: "15px",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "none",
            border: "1px solid #e0e0e0",
            "&.Mui-expanded": {
              borderRadius: "8px",
            },
            "&:before": {
              display: "none",
            },
            direction: "rtl",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              "& .MuiAccordionSummary-content": {
                margin: "5px 0",
              },
              backgroundColor: "#fafafa",
              borderBottom: expanded.includes(`panel${index + 1}`)
                ? "1px solid #e0e0e0"
                : "none",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              direction: "rtl",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: "1rem",
                fontWeight: 500,
                textAlign: "right",
              }}
            >
              {section.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              backgroundColor: "#ffffff",
              padding: "16px 24px",
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              direction: "rtl",
            }}
          >
            {React.cloneElement(section.content, {
              formData: formData,
              onChange: handleFormChange,
            })}
          </AccordionDetails>
        </Accordion>
      ))}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          p: 1,
          mt: -2,
          mb: 1,
          ml: -0.5,
          mr: -0.5,
          direction: "rtl",
        }}
      >
        <Button
          variant="contained"
          onClick={onBack}
          disabled={loading}
          sx={{
            textTransform: "none",
            borderRadius: "4px",
          }}
          startIcon={<ArrowBackIcon />}
        >
          <Typography>{backButtonText}</Typography>
        </Button>

        <Stack direction="row" spacing={2}>
          {showCancelButton && onCancel && (
            <Button
              variant="outlined"
              color="error"
              onClick={onCancel}
              disabled={loading}
              sx={{
                textTransform: "none",
                borderRadius: "4px",
              }}
            >
              <Typography>حذف</Typography>
            </Button>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitDisabled || loading}
            sx={{
              textTransform: "none",
              borderRadius: "4px",
            }}
            startIcon={getButtonIcon()}
          >
            <Typography>
              {loading ? "جاري المعالجة..." : submitButtonText}
            </Typography>
          </Button>

          {onSendClick && (
            <Button
              variant="contained"
              color="primary"
              onClick={onSendClick}
              disabled={loading}
              sx={{
                textTransform: "none",
                borderRadius: "4px",
              }}
            >
              <Typography>{sendButtonText}</Typography>
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default CustomAccordionForm;
