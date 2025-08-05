import axios, { AxiosInstance } from "axios";
import { getApiUrl, isDevelopment } from "../../utils/enc";

const createDepartmentApiInstance = (): AxiosInstance => {
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
      console.error("Department API Request Error:", error);
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

const departmentApiInstance = createDepartmentApiInstance();

export interface Department {
  id: number;
  departmentName: string;
  budget: number;
  isActive: boolean;
  parentDepartmentId?: number;
  managerId?: number;
  tenantId?: number;
}

export interface CreateDepartmentData {
  departmentName: string;
  tenantId: number;
  parentDepartmentId?: number;
  managerId?: number;
  budget: number;
}

export interface UpdateDepartmentData extends CreateDepartmentData {
  id: number;
  isActive: boolean;
}

export interface Manager {
  id: number;
  fullName: string;
  name?: string;
  email?: string;
}

export const departmentAPI = {
  getAll: async (): Promise<Department[]> => {
    try {
      const response = await departmentApiInstance.get(
        "/department/getalldepartment"
      );
      const data = response.data;
      return data?.departments || [];
    } catch (error) {
      throw error; // Rethrow the error to be handled by the caller
    }
  },

  getById: async (id: number): Promise<Department | null> => {
    try {
      const response = await departmentApiInstance.get(
        `/department/getbyiddepartment?Id=${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (
    data: CreateDepartmentData
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const response = await departmentApiInstance.post(
        "/department/createdepartment",
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
    data: UpdateDepartmentData
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const response = await departmentApiInstance.put(
        "/department/updatedepartment",
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
      await departmentApiInstance.delete(
        `/department/deletedepartment?Id=${id}`
      );
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
        departmentApiInstance.delete(`/department/deletedepartment?Id=${id}`)
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

export const userAPI = {
  getManagers: async (): Promise<Manager[]> => {
    try {
      const response = await departmentApiInstance.get("/users");
      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Failed to fetch managers from API:", error);
      throw error;
    }
  },

  getAll: async (): Promise<Manager[]> => {
    try {
      const response = await departmentApiInstance.get("/users");
      const data = response.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      throw error;
    }
  },
};

export const testDepartmentApiConnection = async (): Promise<boolean> => {
  try {
    const response = await departmentApiInstance.get("/health", {
      timeout: 5000,
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const departmentApiInfo = {
  baseUrl: getApiUrl(),
  endpoints: {
    getAll: "/department/getalldepartment",
    getById: "/department/getbyiddepartment",
    create: "/department/createdepartment",
    update: "/department/updatedepartment",
    delete: "/department/deletedepartment",
    managers: "/users",
  },
};

export default departmentApiInstance;
