import axios, { AxiosInstance } from "axios";
import { getApiUrl, isDevelopment } from "../../utils/enc";

const createTenantApiInstance = (): AxiosInstance => {
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

const tenantApiInstance = createTenantApiInstance();

export interface Tenant {
  id: number;
  tenantName: string;
  institutionName: string;
  cityId?: number;
  address: string;
  phone: string;
  email: string;
  isActive?: boolean;
  cityName?: string;
}

export interface CreateTenantData {
  tenantName: string;
  institutionName: string;
  cityId?: number;
  address: string;
  phone: string;
  email: string;
}

export interface UpdateTenantData {
  id: number;
  tenantName: string;
  institutionName: string;
  cityId: number;
  isActive: boolean;
  email: string;
  address: string;
  phone: string;
}

export interface City {
  id: number;
  name: string;
}

export const tenantAPI = {
  getAll: async (): Promise<Tenant[]> => {
    try {
      const response = await tenantApiInstance.get("/tenant/getalltenants");
      const data = response.data;

      if (data?.tenants && Array.isArray(data.tenants)) {
        return data.tenants.map((tenant: any) => ({
          ...tenant,
          isActive: tenant.isActive !== undefined ? tenant.isActive : true,
          cityId: tenant.cityId || 0,
        }));
      }

      return data || [];
    } catch (error) {
      throw error;
    }
  },

  getById: async (id: number): Promise<Tenant | null> => {
    try {
      const response = await tenantApiInstance.get(
        `/tenant/getbyidtenant?Id=${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (
    data: CreateTenantData
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const response = await tenantApiInstance.post(
        "/tenant/creartetenant",
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
    data: UpdateTenantData
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const response = await tenantApiInstance.put(
        "/tenant/updatetenant",
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
      await tenantApiInstance.delete(`/tenant/deletetenant?Id=${id}`);
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
        tenantApiInstance.delete(`/tenant/deletetenant?Id=${id}`)
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

export const cityAPI = {
  getAll: async (): Promise<City[]> => {
    try {
      const response = await tenantApiInstance.get("/city/getallcities");

      const data = response.data;

      if (Array.isArray(data)) {
        return data.map((city: any) => ({
          id: city.id,
          name: city.name,
        }));
      }

      // الخيار 2: إذا كانت البيانات داخل object
      if (data?.cities && Array.isArray(data.cities)) {
        return data.cities.map((city: any) => ({
          id: city.id,
          name: city.name,
        }));
      }

      if (data?.data && Array.isArray(data.data)) {
        return data.data.map((city: any) => ({
          id: city.id,
          name: city.name,
        }));
      }

      return [];
    } catch (error) {
      return [
        { id: 1, name: "دمشق" },
        { id: 2, name: "حلب " },
        { id: 3, name: "ادلب " },
        { id: 4, name: "حماة " },
        { id: 5, name: " حمص " },
      ];
    }
  },
};

export const testTenantApiConnection = async (): Promise<boolean> => {
  try {
    const response = await tenantApiInstance.get("/health", { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const tenantApiInfo = {
  baseUrl: getApiUrl(),
  endpoints: {
    getAll: "/tenant/getalltenants",
    getById: "/tenant/getbyidtenant",
    create: "/tenant/creartetenant",
    update: "/tenant/updatetenant",
    delete: "/tenant/deletetenant",
    cities: "/city/getallcities",
  },
};

export default tenantApiInstance;


