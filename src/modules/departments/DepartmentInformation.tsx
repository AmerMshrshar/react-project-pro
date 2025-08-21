import React, { useState, useEffect } from "react";
import {
  InputField,
  InputNoFormButton,
} from "../../shared/components/InputFieldNew";
import { departmentAPI, userAPI, Department, Manager } from "./api";

interface DepartmentInformationProps {
  initialData?: any;
  updateData?: (data: any) => void;
  isEditMode?: boolean;
}

const DepartmentInformation: React.FC<DepartmentInformationProps> = ({
  initialData,
  updateData,
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState({
    departmentName: "",
    parentDepartmentId: "",
    managerId: "",
    budget: "",
    isActive: true,
  });

  const [parentDepartmentOptions, setParentDepartmentOptions] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [managerOptions, setManagerOptions] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [loadingParents, setLoadingParents] = useState(false);
  const [loadingManagers, setLoadingManagers] = useState(false);

  useEffect(() => {
    const fetchParentDepartments = async () => {
      setLoadingParents(true);
      try {
        const departments: Department[] = await departmentAPI.getAll();

        const currentDeptId = initialData?.id;
        const filteredDepartments = currentDeptId
          ? departments.filter((dept) => dept.id !== currentDeptId)
          : departments;

        const options = filteredDepartments.map((dept: Department) => ({
          id: dept.id,
          name: dept.departmentName,
        }));

        setParentDepartmentOptions(options);
      } catch (error: any) {
        setParentDepartmentOptions([]);
      } finally {
        setLoadingParents(false);
      }
    };

    const fetchManagers = async () => {
      setLoadingManagers(true);
      try {
        const managers: Manager[] = await userAPI.getManagers();
        const options = managers.map((manager: Manager) => ({
          id: manager.id,
          name: manager.fullName || manager.name || `مدير ${manager.id}`,
        }));
        setManagerOptions(options);
      } catch (error: any) {
        setManagerOptions([]);
      } finally {
        setLoadingManagers(false);
      }
    };

    fetchParentDepartments();
    fetchManagers();
  }, [initialData?.id]);

  useEffect(() => {
    if (initialData) {
      const updatedData = {
        departmentName: initialData.departmentName || "",
        parentDepartmentId: initialData.parentDepartmentId?.toString() || "",
        managerId: initialData.managerId?.toString() || "",
        budget: initialData.budget?.toString() || "",
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

  const validateBudget = (
    value: string
  ): { error: boolean; helperText: string } => {
    if (!value) return { error: false, helperText: "" };

    const numValue = Number(value);
    if (isNaN(numValue)) {
      return { error: true, helperText: "يرجى إدخال رقم صحيح" };
    }
    if (numValue < 0) {
      return { error: true, helperText: "لا يمكن أن تكون الميزانية سالبة" };
    }
    if (numValue === 0) {
      return { error: true, helperText: "يجب أن تكون الميزانية أكبر من الصفر" };
    }
    return { error: false, helperText: "" };
  };

  const budgetValidation = validateBudget(formData.budget);

  return (
    <div style={{ direction: "rtl" }}>
      <InputNoFormButton>
        <InputField
          label="اسم القسم *"
          name="departmentName"
          value={formData.departmentName}
          onChange={handleChange}
          type="text"
          required
          error={!formData.departmentName && isEditMode}
          helperText={
            !formData.departmentName && isEditMode ? "اسم القسم مطلوب" : ""
          }
        />

        <InputField
          label="الميزانية *"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          type="number"
          required
          error={budgetValidation.error}
          helperText={budgetValidation.helperText}
        />

        <InputField
          label="القسم الأب"
          name="parentDepartmentId"
          value={formData.parentDepartmentId}
          onChange={handleChange}
          type="select"
          options={parentDepartmentOptions}
          loading={loadingParents}
          readOnly
        />

        <InputField
          label="المدير"
          name="managerId"
          value={formData.managerId}
          onChange={handleChange}
          type="select"
          options={managerOptions}
          loading={loadingManagers}
        />

        {isEditMode && (
          <InputField
            label="حالة القسم"
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

export default DepartmentInformation;
