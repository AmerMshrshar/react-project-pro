import React, { useState, useEffect } from "react";
import {
  InputField,
  InputNoFormButton,
} from "../../shared/components/InputFieldNew";
import { departmentAPI, Position, Department } from "./api";

interface PositionInformationProps {
  initialData?: any;
  updateData?: (data: any) => void;
  isEditMode?: boolean;
}

const PositionInformation: React.FC<PositionInformationProps> = ({
  initialData,
  updateData,
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    departmentId: "",
    isActive: true,
  });

  const [departmentOptions, setDepartmentOptions] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepartments(true);
      try {
        const departments: Department[] = await departmentAPI.getAll();
        const options = departments.map((dept: Department) => ({
          id: dept.id,
          name: dept.departmentName,
        }));
        setDepartmentOptions(options);
      } catch (error: any) {
        setDepartmentOptions([]);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    if (initialData) {
      const updatedData = {
        title: initialData.title || "",
        code: initialData.code || "",
        departmentId: initialData.departmentId?.toString() || "",
        isActive:
          initialData.isActive !== undefined ? initialData.isActive : true,
      };
      setFormData(updatedData);
    }
  }, [initialData]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    const updatedData = { ...formData, [name]: val };
    setFormData(updatedData);

    if (updateData) {
      updateData(updatedData);
    }
  };

  const activeOptions = [
    { id: true, name: "نشط" },
    { id: false, name: "غير نشط" },
  ];

  return (
    <div style={{ direction: "rtl" }}>
      <InputNoFormButton>
        <InputField
          label="اسم المنصب *"
          name="title"
          value={formData.title}
          onChange={handleChange}
          type="text"
          required
        />

        <InputField
          label="رمز المنصب *"
          name="code"
          value={formData.code}
          onChange={handleChange}
          type="text"
          required
        />

        <InputField
          label="القسم *"
          name="departmentId"
          value={formData.departmentId}
          onChange={handleChange}
          type="select"
          options={departmentOptions}
          loading={loadingDepartments}
          required
        />

        {isEditMode && (
          <InputField
            label="حالة المنصب"
            name="isActive"
            value={formData.isActive.toString()}
            onChange={(e) =>
              handleChange({
                target: { name: "isActive", value: e.target.value === "true" },
              })
            }
            type="radio"
            options={activeOptions}
          />
        )}
      </InputNoFormButton>
    </div>
  );
};

export default PositionInformation;
