import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import CustomAccordionForm from "../../shared/components/CollapsibleSection";
import DepartmentInformation from "./DepartmentInformation";
import useNotifications from "../../shared/components/useNotifications";
import { departmentAPI, UpdateDepartmentData, Department } from "./api";

const DepartmentEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { NotificationComponent, showSuccess, showError, showWarning } =
    useNotifications();

  const [formData, setFormData] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      if (!id) {
        setLoadError("معرف القسم مطلوب");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setLoadError(null);

        const departmentData = await departmentAPI.getById(parseInt(id));

        if (departmentData) {
          setFormData(departmentData);
          console.log("تم تحميل بيانات القسم:", departmentData);
        } else {
          setLoadError("القسم غير موجود");
        }
      } catch (error: any) {
        const errorMessage = error.message || "فشل في جلب بيانات القسم";
        setLoadError(errorMessage);
        showError(errorMessage);
        console.error("فشل في جلب بيانات القسم:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, [id, showError]);

  const handleDataChange = (data: any) => {
    setFormData((prevData: Department | null) => {
      if (!prevData) return null;
      return {
        ...prevData,
        ...data,
      };
    });
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData?.departmentName?.trim()) {
      errors.push("اسم القسم مطلوب");
    }

    if (!formData?.budget || isNaN(Number(formData.budget))) {
      errors.push("مبلغ الميزانية صحيح مطلوب");
    } else if (Number(formData.budget) <= 0) {
      errors.push("يجب أن تكون الميزانية أكبر من الصفر");
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

      const dataToSend: UpdateDepartmentData = {
        id: parseInt(id, 10),
        departmentName: formData.departmentName.trim(),
        tenantId: formData.tenantId || 1,
        parentDepartmentId: formData.parentDepartmentId || undefined,
        managerId: formData.managerId || undefined,
        budget: Number(formData.budget),
        isActive: formData.isActive !== undefined ? formData.isActive : true,
      };

      console.log("تحديث القسم:", dataToSend);

      const result = await departmentAPI.update(dataToSend);

      if (result.success) {
        showSuccess("تم تحديث القسم بنجاح!");
        setTimeout(() => navigate("/modules/departments"), 2000);
      } else {
        showError(result.error || "فشل في تحديث القسم");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "فشل في تحديث القسم";
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
      const result = await departmentAPI.delete(parseInt(id));
      if (result.success) {
        showSuccess("تم حذف القسم بنجاح!");
        setTimeout(() => navigate("/modules/departments"), 1500);
      } else {
        showError(result.error || "فشل في حذف القسم");
      }
    } catch (error: any) {
      showError("فشل في حذف القسم");
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
        <Typography sx={{ ml: 2 }}>جاري تحميل بيانات القسم...</Typography>
      </Box>
    );
  }

  if (loadError || !formData) {
    return (
      <Box sx={{ p: 3, direction: "rtl" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError || "فشل في تحميل بيانات القسم"}
        </Alert>
        <Box sx={{ display: "flex", gap: 2 }}>
          <button onClick={() => window.location.reload()}>
            إعادة المحاولة
          </button>
          <button onClick={() => navigate("/modules/departments")}>
            العودة إلى القائمة
          </button>
        </Box>
      </Box>
    );
  }

  const sections = [
    {
      title: "تعديل معلومات القسم",
      content: (
        <DepartmentInformation
          updateData={handleDataChange}
          initialData={formData}
          isEditMode={true}
        />
      ),
    },
  ];

  const isFormValid =
    formData.departmentName?.trim() &&
    formData.budget &&
    !isNaN(Number(formData.budget)) &&
    Number(formData.budget) > 0;

  return (
    <div style={{ direction: "rtl" }}>
      <NotificationComponent />
      <CustomAccordionForm
        title={`تعديل القسم: ${formData.departmentName}`}
        sections={sections}
        onSubmit={handleSubmit}
        onBack={handleBack}
        submitButtonText={isSubmitting ? "جاري التحديث..." : "تحديث القسم"}
        backButtonText="إلغاء"
        isSubmitDisabled={isSubmitting || !isFormValid}
        errorMessage={
          !isFormValid && formData.departmentName
            ? "يرجى ملء جميع الحقول المطلوبة بشكل صحيح"
            : ""
        }
        showCancelButton={true}
        onCancel={handleDelete}
      />
    </div>
  );
};

export default DepartmentEdit;
