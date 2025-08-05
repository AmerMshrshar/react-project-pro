// src/modules/tenant/index.ts

// تصدير جميع مكونات المؤسسات
export { default as TenantTable } from "./TenantTable";
export { default as TenantAdd } from "./TenantAdd";
export { default as TenantEdit } from "./TenantEdit";
export { default as TenantInformation } from "./TenantInformation";
export { default as TenantRouter } from "./TenantRouter";

export {
  tenantAPI,
  cityAPI,
  testTenantApiConnection,
  tenantApiInfo,
} from "./api";

export type { Tenant, CreateTenantData, UpdateTenantData, City } from "./api";
