import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomAccordionForm from "../../shared/components/CollapsibleSection";
import PositionInformation from "./PositionInformation";
import useNotifications from "../../shared/components/useNotifications";
import { positionAPI, CreatePositionData } from "./api";

const PositionAdd = () => {
  const navigate = useNavigate();
  const { NotificationComponent, showSuccess, showError, showWarning } =
    useNotifications();

  const defaultFormData = {
    title: "",
    code: "",
    departmentId: "",
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

    if (!formData.title?.trim()) {
      errors.push("اسم المنصب مطلوب");
    }

    if (!formData.code?.trim()) {
      errors.push("رمز المنصب مطلوب");
    }

    if (!formData.departmentId) {
      errors.push("يرجى اختيار القسم");
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

      const dataToSend: CreatePositionData = {
        title: formData.title.trim(),
        code: formData.code.trim(),
        tenantId: 1, // قيمة ثابتة
        isActive: true, // قيمة ثابتة
        departmentId: parseInt(formData.departmentId, 10),
      };

      const result = await positionAPI.create(dataToSend);

      if (result.success) {
        showSuccess("تم إضافة المنصب بنجاح!");
        setTimeout(() => navigate("/modules/positions"), 2000);
      } else {
        showError(result.error || "فشل في إنشاء المنصب");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "فشل في حفظ المنصب";
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
      title: "معلومات المنصب",
      content: (
        <PositionInformation
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
        title="إضافة منصب جديد"
        sections={sections}
        onSubmit={handleSubmit}
        onBack={handleBack}
        submitButtonText={isSubmitting ? "جاري الإنشاء..." : "إنشاء المنصب"}
        backButtonText="إلغاء"
        isSubmitDisabled={isSubmitting}
      />
    </div>
  );
};

export default PositionAdd;
