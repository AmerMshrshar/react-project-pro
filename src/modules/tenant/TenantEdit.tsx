import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import CustomAccordionForm from "../../shared/components/CollapsibleSection";
import TenantInformation from "./TenantInformation";
import useNotifications from "../../shared/components/useNotifications";
import { tenantAPI, UpdateTenantData, Tenant } from "./api";

const TenantEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { NotificationComponent, showSuccess, showError } = useNotifications();

  const [formData, setFormData] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const dataFetchedRef = useRef(false);
  const currentIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!id || (currentIdRef.current === id && dataFetchedRef.current)) {
      return;
    }

    const fetchTenantData = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        const tenantData = await tenantAPI.getById(parseInt(id));

        if (tenantData) {
          setFormData(tenantData);
          dataFetchedRef.current = true;
          currentIdRef.current = id;
          console.log("تم تحميل بيانات المؤسسة:", tenantData);
        } else {
          setLoadError("المؤسسة غير موجودة");
        }
      } catch (error: any) {
        const errorMessage = error.message || "فشل في جلب بيانات المؤسسة";
        setLoadError(errorMessage);
        showError(errorMessage);
        console.error("فشل في جلب بيانات المؤسسة:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, [id]);

  const handleDataChange = (data: any) => {
    if (!formData) return;

    const updatedData = { ...formData, ...data };
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(updatedData);

    if (hasChanged) {
      setFormData(updatedData);
    }
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData?.tenantName?.trim()) {
      errors.push("اسم المؤسسة مطلوب");
    }

    if (!formData?.institutionName?.trim()) {
      errors.push("اسم المنشأة مطلوب");
    }

    if (!formData?.cityId) {
      errors.push("يرجى اختيار المدينة");
    }

    if (!formData?.address?.trim()) {
      errors.push("العنوان مطلوب");
    }

    if (!formData?.phone?.trim()) {
      errors.push("رقم الهاتف مطلوب");
    } else {
      const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
      if (!phoneRegex.test(formData.phone)) {
        errors.push("رقم الهاتف غير صحيح");
      }
    }

    if (!formData?.email?.trim()) {
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
    if (!formData || !id) return;

    setIsSubmitting(true);
    try {
      const validation = validateForm();
      if (!validation.isValid) {
        showError(validation.errors.join("، "));
        return;
      }

      const dataToSend: UpdateTenantData = {
        id: parseInt(id, 10),
        tenantName: formData.tenantName.trim(),
        institutionName: formData.institutionName.trim(),
        cityId: Number(formData.cityId),
        isActive: formData.isActive !== undefined ? formData.isActive : true,
        email: formData.email.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
      };

      console.log("تحديث المؤسسة:", dataToSend);

      const result = await tenantAPI.update(dataToSend);

      if (result.success) {
        showSuccess("تم تحديث المؤسسة بنجاح!");
        setTimeout(() => navigate("/modules/tenant"), 2000);
      } else {
        showError(result.error || "فشل في تحديث المؤسسة");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "فشل في تحديث المؤسسة";
      showError(errorMessage);
      console.error("خطأ في التحديث:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      const result = await tenantAPI.delete(parseInt(id));
      if (result.success) {
        showSuccess("تم حذف المؤسسة بنجاح!");
        setTimeout(() => navigate("/modules/tenant"), 1500);
      } else {
        showError(result.error || "فشل في حذف المؤسسة");
      }
    } catch (error: any) {
      showError("فشل في حذف المؤسسة");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
          direction: "rtl",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>جاري تحميل بيانات المؤسسة...</Typography>
      </Box>
    );
  }

  if (loadError || !formData) {
    return (
      <Box sx={{ p: 3, direction: "rtl" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError || "فشل في تحميل بيانات المؤسسة"}
        </Alert>
        <Box sx={{ display: "flex", gap: 2 }}>
          <button onClick={() => window.location.reload()}>
            إعادة المحاولة
          </button>
          <button onClick={() => navigate("/modules/tenant")}>
            العودة إلى القائمة
          </button>
        </Box>
      </Box>
    );
  }

  const sections = [
    {
      title: "تعديل معلومات المؤسسة",
      content: (
        <TenantInformation
          updateData={handleDataChange}
          initialData={formData}
          isEditMode={true}
        />
      ),
    },
  ];

  const isFormValid =
    formData.tenantName?.trim() &&
    formData.institutionName?.trim() &&
    formData.cityId &&
    formData.address?.trim() &&
    formData.phone?.trim() &&
    formData.email?.trim();

  return (
    <div style={{ direction: "rtl" }}>
      <NotificationComponent />
      <CustomAccordionForm
        title={`تعديل المؤسسة: ${formData.tenantName}`}
        sections={sections}
        onSubmit={handleSubmit}
        onBack={handleBack}
        submitButtonText={isSubmitting ? "جاري التحديث..." : "تحديث المؤسسة"}
        backButtonText="إلغاء"
        isSubmitDisabled={isSubmitting || !isFormValid}
        errorMessage={
          !isFormValid && formData.tenantName
            ? "يرجى ملء جميع الحقول المطلوبة بشكل صحيح"
            : ""
        }
        showCancelButton={true}
        onCancel={handleDelete}
      />
    </div>
  );
};

export default TenantEdit;
