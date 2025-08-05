import axios, { AxiosInstance } from "axios";
import { getApiUrl, isDevelopment } from "../../utils/enc";

const createPositionApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: getApiUrl(),
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  instance.interceptors.request.use(
    (config) => {
      if (isDevelopment()) {
      }
      return config;
    },
    (error) => {
      console.error("Position API Request Error:", error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      if (isDevelopment()) {
      }
      return response;
    },
    (error) => {
      if (isDevelopment()) {
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const positionApiInstance = createPositionApiInstance();

export interface Position {
  id: number;
  title: string;
  code: string;
  tenantId: number;
  isActive: boolean;
  departmentId: number;
  departmentName?: string;
}

export interface CreatePositionData {
  title: string;
  code: string;
  tenantId: number;
  isActive: boolean;
  departmentId: number;
}

export interface UpdatePositionData extends CreatePositionData {
  id: number;
}

export interface Department {
  id: number;
  departmentName: string;
  isActive?: boolean;
}

export const positionAPI = {
  getAll: async (): Promise<Position[]> => {
    try {
      const response = await positionApiInstance.get(
        "/positions/getallpositions"
      );
      const data = response.data;
      return data?.positions || data || [];
    } catch (error) {
      console.error("Failed to fetch positions from API:", error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Position | null> => {
    try {
      const response = await positionApiInstance.get(
        `/positions/getbyidposition?Id=${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch position ${id} from API:`, error);
      throw error;
    }
  },

  create: async (
    data: CreatePositionData
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const response = await positionApiInstance.post(
        "/positions/createposition",
        data
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      return { success: false, error: errorMessage };
    }
  },

  update: async (
    data: UpdatePositionData
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const response = await positionApiInstance.put(
        "/positions/updateposition",
        data
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      return { success: false, error: errorMessage };
    }
  },

  delete: async (id: number): Promise<{ success: boolean; error?: string }> => {
    try {
      await positionApiInstance.delete(`/positions/deleteposition?Id=${id}`);
      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      return { success: false, error: errorMessage };
    }
  },

  deleteMultiple: async (
    ids: number[]
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const deletePromises = ids.map((id) =>
        positionApiInstance.delete(`/positions/deleteposition?Id=${id}`)
      );
      await Promise.all(deletePromises);
      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      return { success: false, error: errorMessage };
    }
  },
};

export const departmentAPI = {
  getAll: async (): Promise<Department[]> => {
    try {
      const response = await positionApiInstance.get(
        "/department/getalldepartment"
      );
      const data = response.data;
      return data?.departments || data || [];
    } catch (error) {
      console.error("Failed to fetch departments from API:", error);
      throw error;
    }
  },
};

export const testPositionApiConnection = async (): Promise<boolean> => {
  try {
    const response = await positionApiInstance.get("/health", {
      timeout: 5000,
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const positionApiInfo = {
  baseUrl: getApiUrl(),
  endpoints: {
    getAll: "/positions/getallpositions",
    getById: "/positions/getbyidposition",
    create: "/positions/createposition",
    update: "/positions/updateposition",
    delete: "/positions/deleteposition",
    departments: "/department/getalldepartment",
  },
};

export default positionApiInstance;
