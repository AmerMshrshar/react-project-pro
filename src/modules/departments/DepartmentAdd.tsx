import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomAccordionForm from "../../shared/components/CollapsibleSection";
import DepartmentInformation from "./DepartmentInformation";
import useNotifications from "../../shared/components/useNotifications";
import { departmentAPI, CreateDepartmentData } from "./api";

const DepartmentAdd = () => {
  const navigate = useNavigate();
  const { NotificationComponent, showSuccess, showError, showWarning } =
    useNotifications();

  const defaultFormData = {
    departmentName: "",
    parentDepartmentId: "",
    managerId: "",
    budget: "",
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDataChange = (data: any) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData.departmentName?.trim()) {
      errors.push("اسم القسم مطلوب");
    }

    if (!formData.budget || isNaN(Number(formData.budget))) {
      errors.push("مبلغ الميزانية صحيح مطلوب");
    } else if (Number(formData.budget) <= 0) {
      errors.push("يجب أن تكون الميزانية أكبر من الصفر");
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const validation = validateForm();
      if (!validation.isValid) {
        showError(validation.errors.join("، "));
        setIsSubmitting(false);
        return;
      }

      const dataToSend: CreateDepartmentData = {
        departmentName: formData.departmentName.trim(),
        tenantId: 1,
        parentDepartmentId: formData.parentDepartmentId
          ? parseInt(formData.parentDepartmentId, 10)
          : undefined,
        managerId: formData.managerId
          ? parseInt(formData.managerId, 10)
          : undefined,
        budget: Number(formData.budget),
      };

      console.log("إنشاء قسم:", dataToSend);

      const result = await departmentAPI.create(dataToSend);

      if (result.success) {
        showSuccess("تم إضافة القسم بنجاح!");
        setTimeout(() => navigate("/modules/departments"), 2000);
      } else {
        showError(result.error || "فشل في إنشاء القسم");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "فشل في حفظ القسم";
      showError(errorMessage);
      console.error("خطأ في الإرسال:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const sections = [
    {
      title: "معلومات القسم",
      content: (
        <DepartmentInformation
          updateData={handleDataChange}
          initialData={formData}
          isEditMode={false}
        />
      ),
    },
  ];

  return (
    <div style={{ direction: "rtl" }}>
      <NotificationComponent />
      <CustomAccordionForm
        title="إضافة قسم جديد"
        sections={sections}
        onSubmit={handleSubmit}
        onBack={handleBack}
        submitButtonText={isSubmitting ? "جاري الإنشاء..." : "إنشاء القسم"}
        backButtonText="إلغاء"
        isSubmitDisabled={isSubmitting}
      />
    </div>
  );
};

export default DepartmentAdd;
