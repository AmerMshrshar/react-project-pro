import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomAccordionForm from "../../shared/components/CollapsibleSection";
import TenantInformation from "./TenantInformation";
import useNotifications from "../../shared/components/useNotifications";
import { tenantAPI, CreateTenantData } from "./api";

const TenantAdd = () => {
  const navigate = useNavigate();
  const { NotificationComponent, showSuccess, showError } = useNotifications();

  const defaultFormData = {
    tenantName: "",
    institutionName: "",
    cityId: "",
    address: "",
    phone: "",
    email: "",
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
  const handleDataChange = (data: any) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData.tenantName?.trim()) {
      errors.push("اسم المؤسسة مطلوب");
    }

    if (!formData.institutionName?.trim()) {
      errors.push("اسم المنشأة مطلوب");
    }

    if (!formData.address?.trim()) {
      errors.push("العنوان مطلوب");
    }

    if (!formData.phone?.trim()) {
      errors.push("رقم الهاتف مطلوب");
    } else {
      const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
      if (!phoneRegex.test(formData.phone)) {
        errors.push("رقم الهاتف غير صحيح");
      }
    }

    if (!formData.email?.trim()) {
      errors.push("البريد الإلكتروني مطلوب");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.push("البريد الإلكتروني غير صحيح");
      }
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async () => {
    setHasTriedSubmit(true);
    setIsSubmitting(true);

    try {
      const validation = validateForm();
      if (!validation.isValid) {
        showError(validation.errors.join("، "));
        setIsSubmitting(false);
        return;
      }

      const dataToSend: CreateTenantData = {
        tenantName: formData.tenantName.trim(),
        institutionName: formData.institutionName.trim(),
        cityId: formData.cityId ? parseInt(formData.cityId, 10) : 0,
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
      };

      console.log("إنشاء مؤسسة:", dataToSend);

      const result = await tenantAPI.create(dataToSend);

      if (result.success) {
        showSuccess("تم إضافة المؤسسة بنجاح!");
        setTimeout(() => navigate("/modules/tenant"), 2000);
      } else {
        showError(result.error || "فشل في إنشاء المؤسسة");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "فشل في حفظ المؤسسة";
      showError(errorMessage);
      console.error("خطأ في الإرسال:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const isFormValid =
    formData.tenantName?.trim() &&
    formData.institutionName?.trim() &&
    formData.address?.trim() &&
    formData.phone?.trim() &&
    formData.email?.trim();

  const sections = [
    {
      title: "معلومات المؤسسة",
      content: (
        <TenantInformation
          updateData={handleDataChange}
          initialData={formData}
          isEditMode={false}
          hasTriedSubmit={hasTriedSubmit}
        />
      ),
    },
  ];

  return (
    <div style={{ direction: "rtl" }}>
      <NotificationComponent />
      <CustomAccordionForm
        title="إضافة مؤسسة جديدة"
        sections={sections}
        onSubmit={handleSubmit}
        onBack={handleBack}
        submitButtonText={isSubmitting ? "جاري الإنشاء..." : "إنشاء المؤسسة"}
        backButtonText="إلغاء"
        isSubmitDisabled={isSubmitting}
        errorMessage=""
      />
    </div>
  );
};

export default TenantAdd;
