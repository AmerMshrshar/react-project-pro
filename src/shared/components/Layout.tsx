import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ExpandLess,
  ExpandMore,
  Apps as AppsIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useFavorites } from "../../contexts/FavoritesContext";

const drawerWidth = 240;

interface Module {
  name: string;
  icon: React.ComponentType<any>;
  path: string;
}

interface FavoriteItem {
  id: string;
  name: string;
  path: string;
  icon: string;
  type: string;
  dateAdded: string;
}

const modules: Module[] = [
  { name: "المؤسسات", icon: BusinessIcon, path: "/modules/tenant" },
  { name: "الأقسام", icon: BusinessIcon, path: "/modules/departments" },
  { name: "المناصب", icon: BusinessIcon, path: "/modules/positions" },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [modulesOpen, setModulesOpen] = useState<boolean>(true);
  const [favoritesOpen, setFavoritesOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string): void => {
    navigate(path);
  };

  const isSelected = (path: string): boolean => location.pathname === path;

  const handleFavoriteClick = (module: Module, event: React.MouseEvent) => {
    event.stopPropagation();
    toggleFavorite({
      id: module.path,
      name: module.name,
      path: module.path,
      icon: "BusinessIcon",
      type: "module",
    });
  };

  const favoriteModules = favorites.filter(
    (fav: FavoriteItem) => fav.type === "module"
  );

  const drawer = (
    <div style={{ direction: "rtl" }}>
      <Toolbar />

      <List sx={{ pt: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            selected={isSelected("/home") || isSelected("/")}
            onClick={() => handleNavigation("/home")}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <HomeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="الرئيسية"
              primaryTypographyProps={{ fontSize: 14 }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => setFavoritesOpen(!favoritesOpen)}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <StarIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="المفضلة"
              primaryTypographyProps={{ fontSize: 14 }}
            />
            {favoritesOpen ? (
              <ExpandLess fontSize="small" />
            ) : (
              <ExpandMore fontSize="small" />
            )}
          </ListItemButton>
        </ListItem>

        <Collapse in={favoritesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {favoriteModules.length === 0 ? (
              <ListItem sx={{ pr: 4 }}>
                <ListItemText
                  primary="لا توجد عناصر مفضلة"
                  primaryTypographyProps={{
                    fontSize: 12,
                    color: "text.disabled",
                    fontStyle: "italic",
                  }}
                />
              </ListItem>
            ) : (
              favoriteModules.map((favorite: FavoriteItem, index: number) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    sx={{ pr: 4 }}
                    selected={isSelected(favorite.path)}
                    onClick={() => handleNavigation(favorite.path)}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <BusinessIcon
                        fontSize="small"
                        sx={{ color: "text.secondary" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={favorite.name}
                      primaryTypographyProps={{
                        fontSize: 13,
                        color: "text.secondary",
                        fontWeight: 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            )}
          </List>
        </Collapse>
      </List>

      <Divider sx={{ my: 1 }} />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setModulesOpen(!modulesOpen)}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <AppsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="الوحدات"
              primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}
            />
            {modulesOpen ? (
              <ExpandLess fontSize="small" />
            ) : (
              <ExpandMore fontSize="small" />
            )}
          </ListItemButton>
        </ListItem>

        <Collapse in={modulesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {modules.map((module: Module, index: number) => {
              const IconComponent = module.icon;
              const moduleIsFavorite = isFavorite(module.path);

              return (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    sx={{ pr: 4 }}
                    selected={isSelected(module.path)}
                    onClick={() => handleNavigation(module.path)}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <IconComponent
                        fontSize="small"
                        sx={{ color: "text.secondary" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={module.name}
                      primaryTypographyProps={{
                        fontSize: 13,
                        color: "text.secondary",
                        fontWeight: moduleIsFavorite ? 500 : 400,
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={(event) => handleFavoriteClick(module, event)}
                      sx={{ mr: 0.5, p: 0.5 }}
                    >
                      {moduleIsFavorite ? (
                        <StarIcon
                          sx={{
                            fontSize: 14,
                            color: "#ffc107",
                          }}
                        />
                      ) : (
                        <StarBorderIcon
                          sx={{
                            fontSize: 14,
                            color: "action.disabled",
                            "&:hover": {
                              color: "#ffc107",
                            },
                          }}
                        />
                      )}
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex", direction: "rtl" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "white",
          color: "text.primary",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          borderBottom: "1px solid #e3e3e3",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ ml: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          anchor="right"
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          anchor="right"
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
