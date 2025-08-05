export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Module {
  id: string;
  name: string;
  icon: React.ComponentType;
  path: string;
  favorite: boolean;
  description?: string;
}

export interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType;
  path: string;
  children?: NavigationItem[];
}

export interface DashboardState {
  user: User | null;
  selectedModule: Module | null;
  sidebarOpen: boolean;
  theme: "light" | "dark";
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "checkbox"
    | "date";
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormData {
  [key: string]: any;
}

export interface EnvConfig {
  APP_NAME: string;
  API_URL: string;
  API_TIMEOUT: number;
  THEME_MODE: "light" | "dark";
  ENABLE_DARK_MODE: boolean;
  ENABLE_NOTIFICATIONS: boolean;
  ENABLE_ANALYTICS: boolean;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  error: string;
  warning: string;
  info: string;
  success: string;
}
