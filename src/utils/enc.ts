import { EnvConfig } from "../types";

export const getEnvConfig = (): EnvConfig => {
  return {
    APP_NAME: process.env.REACT_APP_NAME || "Pro Dashboard",
    API_URL:
      process.env.REACT_APP_API_URL ||
      process.env.REACT_APP_SERVER_URL + "/api" ||
      "http://144.91.118.87:8081/api",
    API_TIMEOUT: Number(process.env.REACT_APP_API_TIMEOUT) || 10000,
    THEME_MODE:
      (process.env.REACT_APP_THEME_MODE as "light" | "dark") || "light",
    ENABLE_DARK_MODE: process.env.REACT_APP_ENABLE_DARK_MODE === "true",
    ENABLE_NOTIFICATIONS: process.env.REACT_APP_ENABLE_NOTIFICATIONS === "true",
    ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === "true",
  };
};

export const getServerUrl = (): string => {
  return process.env.REACT_APP_SERVER_URL || "http://144.91.118.87:8081";
};

export const getIdentityUrl = (): string => {
  return process.env.REACT_APP_IDENTITY_URL || `${getServerUrl()}/identity/api`;
};

export const getApiUrl = (): string => {
  return process.env.REACT_APP_API_URL || `${getServerUrl()}/api`;
};

export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === "development";
};

export const isProduction = (): boolean => {
  return process.env.NODE_ENV === "production";
};

export const getSwaggerUrl = (): string => {
  return `${getServerUrl()}/swagger/index.html`;
};

export const validateEnv = (): void => {
  const required = ["REACT_APP_SERVER_URL"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn("Missing environment variables:", missing);
    console.info("Using default server URL: http://144.91.118.87:8081");
  }

  if (isDevelopment()) {
    console.log("Environment Configuration:", {
      serverUrl: getServerUrl(),
      apiUrl: getApiUrl(),
      identityUrl: getIdentityUrl(),
      swaggerUrl: getSwaggerUrl(),
    });
  }
};
