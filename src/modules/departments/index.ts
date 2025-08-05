export { default as DepartmentTable } from "./DepartmentTable";
export { default as DepartmentAdd } from "./DepartmentAdd";
export { default as DepartmentEdit } from "./DepartmentEdit";
export { default as DepartmentInformation } from "./DepartmentInformation";
export { default as DepartmentRouter } from "./DepartmentRouter";

export {
  departmentAPI,
  userAPI,
  getMockDepartments,
  getMockManagers,
  testDepartmentApiConnection,
  departmentApiInfo,
} from "./api";

export type {
  Department,
  CreateDepartmentData,
  UpdateDepartmentData,
  Manager,
} from "./api";
