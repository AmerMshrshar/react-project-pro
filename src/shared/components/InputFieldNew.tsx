import React, { useState } from "react";
import {
  TextField,
  FormControl,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Style = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#e0e0e0",
    },
    "&:hover fieldset": {
      borderColor: "#b0b0b0",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#3f51b5",
    },
  },
  "& .MuiInputBase-input": {
    textAlign: "right",
    direction: "rtl",
  },
  "& .MuiInputLabel-root": {
    right: 14,
    left: "auto",
    transformOrigin: "top right",
    "&.Mui-focused": {
      right: 14,
    },
  },
};

const textFieldStyle = {
  ...Style,
  "& .MuiInputBase-input": {
    fontSize: "1rem",
    textAlign: "right",
    direction: "rtl",
  },
};

const selectStyle = {
  ...Style,
  "& .MuiSelect-select": {
    fontSize: "1rem",
    textAlign: "right",
    direction: "rtl",
  },
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  type,
  options = [],
  loading = false,
  readOnly = false,
  extraProps = {},
  required = false,
  placeholder = "",
  error = false,
  helperText = "",
  disabled = false,
  multiline = false,
  rows = 4,
}) => {
  const readOnlyInputProps = readOnly
    ? {
        readOnly: true,
        style: {
          caretColor: "transparent",
          cursor: "default",
          pointerEvents: readOnly ? "none" : "auto",
          WebkitTextFillColor: "currentColor",
          backgroundColor: "#f5f5f5",
          textAlign: "right",
          direction: "rtl",
        },
        ...extraProps.InputProps,
      }
    : {
        style: {
          textAlign: "right",
          direction: "rtl",
        },
        ...extraProps.InputProps,
      };

  const selectStyling = readOnly
    ? {
        ...selectStyle,
        backgroundColor: "#f5f5f5",
        "& .MuiSelect-select": {
          cursor: "default",
          textAlign: "right",
          direction: "rtl",
        },
      }
    : selectStyle;

  const sanitizedValue = value !== null && value !== undefined ? value : "";

  return (
    <Grid
      item
      container
      alignItems="center"
      spacing={2}
      sx={{ direction: "rtl" }}
    >
      <Grid item xs={12} sm={2}>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1rem",
            fontWeight: "400",
            textAlign: "right",
          }}
        >
          {label}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={8}>
        {type === "select" ? (
          <FormControl fullWidth required={required} sx={Style} error={error}>
            <Select
              name={name}
              value={sanitizedValue}
              onChange={onChange}
              required={required}
              sx={selectStyling}
              disabled={readOnly || disabled || loading}
              displayEmpty={!!placeholder}
              {...(extraProps.SelectProps || {})}
            >
              {placeholder && (
                <MenuItem
                  value=""
                  disabled
                  sx={{ textAlign: "right", direction: "rtl" }}
                >
                  {placeholder}
                </MenuItem>
              )}
              {loading ? (
                <MenuItem
                  disabled
                  sx={{ textAlign: "right", direction: "rtl" }}
                >
                  جاري التحميل...
                </MenuItem>
              ) : options.length === 0 ? (
                <MenuItem
                  disabled
                  sx={{ textAlign: "right", direction: "rtl" }}
                >
                  لا توجد خيارات متاحة
                </MenuItem>
              ) : (
                options.map((option) => {
                  if (
                    !option ||
                    option.id === undefined ||
                    option.name === undefined
                  ) {
                    return null;
                  }
                  return (
                    <MenuItem
                      key={option.id}
                      value={option.id}
                      sx={{ textAlign: "right", direction: "rtl" }}
                    >
                      {option.name}
                    </MenuItem>
                  );
                })
              )}
            </Select>
            {helperText && (
              <Typography
                variant="caption"
                color={error ? "error" : "textSecondary"}
                sx={{ textAlign: "right", mt: 0.5 }}
              >
                {helperText}
              </Typography>
            )}
          </FormControl>
        ) : type === "radio" ? (
          <RadioGroup
            name={name}
            value={sanitizedValue?.toString() || ""}
            onChange={onChange}
            row
            sx={{
              display: "flex",
              gap: 2,
              direction: "rtl",
              justifyContent: "flex-start",
            }}
          >
            {options.map((option) => {
              if (
                !option ||
                option.id === undefined ||
                option.name === undefined
              ) {
                return null;
              }
              return (
                <FormControlLabel
                  key={option.id}
                  value={option.id?.toString()}
                  control={
                    <Radio
                      sx={{ color: "#3f51b5" }}
                      disabled={readOnly || disabled}
                    />
                  }
                  label={option.name}
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: "1rem",
                      fontWeight: "400",
                    },
                    direction: "rtl",
                  }}
                />
              );
            })}
          </RadioGroup>
        ) : type === "textarea" ? (
          <TextField
            fullWidth
            name={name}
            value={sanitizedValue}
            onChange={onChange}
            required={required}
            multiline
            rows={rows}
            sx={textFieldStyle}
            InputProps={readOnlyInputProps}
            error={error}
            helperText={helperText}
            disabled={disabled}
            placeholder={placeholder}
          />
        ) : (
          <TextField
            fullWidth
            name={name}
            type={type}
            value={sanitizedValue}
            onChange={onChange}
            required={required}
            sx={textFieldStyle}
            InputProps={readOnlyInputProps}
            error={error}
            helperText={helperText}
            disabled={disabled}
            placeholder={placeholder}
            multiline={multiline}
            rows={multiline ? rows : undefined}
          />
        )}
      </Grid>
    </Grid>
  );
};

const InputNoFormButton = ({ onSubmit, children, title, sx = {} }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!onSubmit) return;

    setLoading(true);
    try {
      await onSubmit();
    } catch (error) {
      console.error("فشل في الحفظ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component={onSubmit ? "form" : "div"}
      noValidate
      autoComplete="off"
      sx={{
        maxWidth: "100%",
        margin: "2px 0 20px 0",
        backgroundColor: "transparent",
        direction: "rtl",
        ...sx,
      }}
      onSubmit={onSubmit ? handleSubmit : undefined}
    >
      {title && (
        <Typography variant="h6" sx={{ mb: 2, textAlign: "right" }}>
          {title}
        </Typography>
      )}
      <Grid
        container
        rowSpacing={3}
        sx={{
          maxWidth: "100%",
          bgcolor: "transparent",
          boxShadow: "none",
          direction: "rtl",
        }}
      >
        {children}
      </Grid>
    </Box>
  );
};

export { InputField, InputNoFormButton };
