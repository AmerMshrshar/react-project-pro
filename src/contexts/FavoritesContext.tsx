import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface FavoriteItem {
  id: string;
  name: string;
  path: string;
  icon: string;
  type: string;
  dateAdded: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: Omit<FavoriteItem, "dateAdded">) => void;
  removeFromFavorites: (itemId: string) => void;
  toggleFavorite: (item: Omit<FavoriteItem, "dateAdded">) => void;
  isFavorite: (itemId: string) => boolean;
  getFavoritesByType: (type: string) => FavoriteItem[];
  clearAllFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("userFavorites");
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Error loading favorites:", error);
        setFavorites([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("userFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (item: Omit<FavoriteItem, "dateAdded">) => {
    const favoriteItem: FavoriteItem = {
      id: item.id || item.path,
      name: item.name,
      path: item.path,
      icon: item.icon,
      type: item.type || "module",
      dateAdded: new Date().toISOString(),
    };

    setFavorites((prev) => {
      const exists = prev.find((fav) => fav.id === favoriteItem.id);
      if (exists) {
        return prev;
      }
      return [...prev, favoriteItem];
    });
  };

  const removeFromFavorites = (itemId: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== itemId));
  };

  const toggleFavorite = (item: Omit<FavoriteItem, "dateAdded">) => {
    const itemId = item.id || item.path;
    const isFav = favorites.some((fav) => fav.id === itemId);

    if (isFav) {
      removeFromFavorites(itemId);
    } else {
      addToFavorites(item);
    }
  };

  const isFavorite = (itemId: string): boolean => {
    return favorites.some((fav) => fav.id === itemId);
  };

  const getFavoritesByType = (type: string): FavoriteItem[] => {
    return favorites.filter((fav) => fav.type === type);
  };

  const clearAllFavorites = () => {
    setFavorites([]);
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoritesByType,
    clearAllFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
