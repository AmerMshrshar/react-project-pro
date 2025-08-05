// src/modules/position/index.ts

// تصدير جميع مكونات المناصب
export { default as PositionTable } from "./PositionTable";
export { default as PositionAdd } from "./PositionAdd";
export { default as PositionEdit } from "./PositionEdit";
export { default as PositionInformation } from "./PositionInformation";
export { default as PositionRouter } from "./PositionRouter";

export {
  positionAPI,
  userAPI,
  testPositionApiConnection,
  positionApiInfo,
} from "./api";

export type {
  Position,
  CreatePositionData,
  UpdatePositionData,
  Manager,
} from "./api";
