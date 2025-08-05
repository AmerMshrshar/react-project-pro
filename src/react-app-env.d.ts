/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_SERVER_URL: string;
    REACT_APP_IDENTITY_URL: string;
    REACT_APP_API_URL: string;

    REACT_APP_NAME: string;
    REACT_APP_VERSION: string;
    REACT_APP_API_TIMEOUT: string;

    REACT_APP_DB_HOST: string;
    REACT_APP_DB_PORT: string;
    REACT_APP_DB_NAME: string;

    REACT_APP_THEME_MODE: "light" | "dark";
    REACT_APP_PRIMARY_COLOR: string;

    REACT_APP_ENABLE_DARK_MODE: string;
    REACT_APP_ENABLE_NOTIFICATIONS: string;
    REACT_APP_ENABLE_ANALYTICS: string;

    NODE_ENV: "development" | "production" | "test";
    GENERATE_SOURCEMAP: string;
    TSC_COMPILE_ON_ERROR: string;
    ESLINT_NO_DEV_ERRORS: string;
  }
}
