import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import Layout from "./shared/components/Layout";
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavoritesPage";
import ModulePage from "./pages/ModulePage";
import DepartmentRouter from "./modules/departments/DepartmentRouter";
import PositionRouter from "./modules/position/PositionRouter";
import TenantRouter from "./modules/tenant/TenantRouter";
import "./App.css";

declare module "@mui/material/styles" {
  interface PaletteColor {
    lighter?: string;
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
  }
}

const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: blue[600],
      lighter: blue[50],
    },
    secondary: {
      main: grey[600],
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    error: {
      main: "#d32f2f",
      lighter: "#ffebee",
    },
  },
  typography: {
    fontFamily:
      '"Cairo", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    h1: {
      fontFamily: '"Cairo", "Segoe UI", "Roboto", sans-serif',
    },
    h2: {
      fontFamily: '"Cairo", "Segoe UI", "Roboto", sans-serif',
    },
    h3: {
      fontFamily: '"Cairo", "Segoe UI", "Roboto", sans-serif',
    },
    h4: {
      fontFamily: '"Cairo", "Segoe UI", "Roboto", sans-serif',
    },
    h5: {
      fontFamily: '"Cairo", "Segoe UI", "Roboto", sans-serif',
    },
    h6: {
      fontFamily: '"Cairo", "Segoe UI", "Roboto", sans-serif',
    },
    body1: {
      fontFamily: '"Cairo", "Segoe UI", "Roboto", sans-serif',
    },
    body2: {
      fontFamily: '"Cairo", "Segoe UI", "Roboto", sans-serif',
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          borderLeft: "1px solid #e3e3e3",
          borderRight: "none",
          width: 240,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 8,
          paddingBottom: 8,
          borderRadius: 6,
          margin: "2px 8px",
          "&.Mui-selected": {
            backgroundColor: "#e3f2fd",
            color: "#1976d2",
            borderRight: "3px solid #1976d2",
            borderLeft: "none",
            "& .MuiListItemIcon-root": {
              color: "#1976d2",
            },
          },
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          "& .MuiToolbar-root": {
            direction: "rtl",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          textAlign: "right",
        },
        head: {
          textAlign: "right",
          fontWeight: "bold",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input": {
            textAlign: "right",
          },
          "& .MuiInputLabel-root": {
            right: 14,
            left: "auto",
            transformOrigin: "top right",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "& .MuiSelect-select": {
            textAlign: "right",
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: 0,
          marginRight: -11,
        },
      },
    },
  },
});

const App = () => {
  React.useEffect(() => {
    document.body.dir = "rtl";
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";

    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.body.dir = "ltr";
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FavoritesProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route
                path="/modules/departments/*"
                element={<DepartmentRouter />}
              />
              <Route path="/modules/positions/*" element={<PositionRouter />} />
              <Route path="/modules/tenant/*" element={<TenantRouter />} />
              <Route path="/modules/:moduleName" element={<ModulePage />} />
            </Routes>
          </Layout>
        </Router>
      </FavoritesProvider>
    </ThemeProvider>
  );
};

export default App;
