import React from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
  Chip,
  Alert,
} from "@mui/material";
import {
  Star as StarIcon,
  Business as BusinessIcon,
  Home as HomeIcon,
  Apps as AppsIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../contexts/FavoritesContext";

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "BusinessIcon":
      return BusinessIcon;
    case "HomeIcon":
      return HomeIcon;
    case "AppsIcon":
      return AppsIcon;
    default:
      return BusinessIcon;
  }
};

interface FavoriteItem {
  id: string;
  name: string;
  path: string;
  icon: string;
  type: string;
  dateAdded: string;
}

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, removeFromFavorites, clearAllFavorites } = useFavorites();

  const handleNavigateToFavorite = (path: string) => {
    navigate(path);
  };

  const handleRemoveFavorite = (itemId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    removeFromFavorites(itemId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const groupedFavorites = favorites.reduce(
    (groups: Record<string, FavoriteItem[]>, favorite: FavoriteItem) => {
      const type = favorite.type || "other";
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(favorite);
      return groups;
    },
    {}
  );

  return (
    <Box sx={{ direction: "rtl" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
          المفضلة
        </Typography>
        {favorites.length > 0 && (
          <IconButton
            onClick={clearAllFavorites}
            color="error"
            sx={{ mr: 2 }}
            title="حذف جميع المفضلة"
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>

      {favorites.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body1">
            لم تقم بإضافة أي عناصر إلى المفضلة بعد. اضغط على النجمة بجانب أي
            وحدة لإضافتها إلى المفضلة.
          </Typography>
        </Alert>
      ) : (
        <Box>
          {Object.entries(groupedFavorites).map(([type, items]) => (
            <Box key={type} sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  textTransform: "capitalize",
                }}
              >
                <StarIcon sx={{ mr: 1, color: "#ffc107" }} />
                {type === "module" ? "الوحدات" : "أخرى"} ({items.length})
              </Typography>

              <Grid container spacing={2}>
                {items.map((favorite: FavoriteItem) => {
                  const IconComponent = getIconComponent(favorite.icon);
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={favorite.id}>
                      <Card
                        sx={{
                          height: "100%",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: 4,
                          },
                        }}
                      >
                        <CardActionArea
                          onClick={() =>
                            handleNavigateToFavorite(favorite.path)
                          }
                          sx={{ height: "100%" }}
                        >
                          <CardContent
                            sx={{ position: "relative", height: "100%", p: 3 }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <IconComponent
                                sx={{
                                  fontSize: 32,
                                  color: "primary.main",
                                  ml: 1,
                                }}
                              />
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography
                                  variant="h6"
                                  component="h3"
                                  sx={{ fontSize: 16, fontWeight: 600 }}
                                >
                                  {favorite.name}
                                </Typography>
                              </Box>
                              <IconButton
                                size="small"
                                onClick={(event) =>
                                  handleRemoveFavorite(favorite.id, event)
                                }
                                sx={{
                                  position: "absolute",
                                  top: 8,
                                  left: 8,
                                  color: "error.main",
                                  "&:hover": {
                                    backgroundColor: "error.lighter",
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>

                            <Box sx={{ mt: "auto" }}>
                              <Chip
                                size="small"
                                label={type === "module" ? "وحدة" : "صفحة"}
                                sx={{
                                  fontSize: 12,
                                  backgroundColor: "primary.lighter",
                                  color: "primary.main",
                                  mb: 1,
                                }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block", fontSize: 11 }}
                              >
                                أضيف في: {formatDate(favorite.dateAdded)}
                              </Typography>
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FavoritesPage;
