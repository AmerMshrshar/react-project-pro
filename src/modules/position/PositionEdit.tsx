import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import CustomAccordionForm from "../../shared/components/CollapsibleSection";
import PositionInformation from "./PositionInformation";
import useNotifications from "../../shared/components/useNotifications";
import { positionAPI, UpdatePositionData, Position } from "./api";

const PositionEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { NotificationComponent, showSuccess, showError } = useNotifications();

  const [formData, setFormData] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPositionData = async () => {
      if (!id) {
        setLoadError("معرف المنصب مطلوب");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setLoadError(null);

        const positionData = await positionAPI.getById(parseInt(id));

        if (positionData) {
          setFormData(positionData);
          console.log("تم تحميل بيانات المنصب:", positionData);
        } else {
          setLoadError("المنصب غير موجود");
        }
      } catch (error: any) {
        const errorMessage = error.message || "فشل في جلب بيانات المنصب";
        setLoadError(errorMessage);
        showError(errorMessage);
        console.error("فشل في جلب بيانات المنصب:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPositionData();
  }, [id, showError]);

  const handleDataChange = (data: any) => {
    setFormData((prevData: Position | null) => {
      if (!prevData) return null;
      return {
        ...prevData,
        ...data,
      };
    });
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData?.title?.trim()) {
      errors.push("اسم المنصب مطلوب");
    }

    if (!formData?.code?.trim()) {
      errors.push("رمز المنصب مطلوب");
    }

    if (!formData?.departmentId) {
      errors.push("يرجى اختيار القسم");
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async () => {
    if (!formData || !id) return;

    setIsSubmitting(true);
    try {
      // تحقق من صحة البيانات
      const validation = validateForm();
      if (!validation.isValid) {
        showError(validation.errors.join("، "));
        return;
      }

      const dataToSend: UpdatePositionData = {
        id: parseInt(id, 10),
        title: formData.title.trim(),
        code: formData.code.trim(),
        tenantId: formData.tenantId || 1,
        departmentId: Number(formData.departmentId),
        isActive: formData.isActive !== undefined ? formData.isActive : true,
      };

      console.log("تحديث المنصب:", dataToSend);

      const result = await positionAPI.update(dataToSend);

      if (result.success) {
        showSuccess("تم تحديث المنصب بنجاح!");
        setTimeout(() => navigate("/modules/positions"), 2000);
      } else {
        showError(result.error || "فشل في تحديث المنصب");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "فشل في تحديث المنصب";
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
      const result = await positionAPI.delete(parseInt(id));
      if (result.success) {
        showSuccess("تم حذف المنصب بنجاح!");
        setTimeout(() => navigate("/modules/positions"), 1500);
      } else {
        showError(result.error || "فشل في حذف المنصب");
      }
    } catch (error: any) {
      showError("فشل في حذف المنصب");
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
        <Typography sx={{ ml: 2 }}>جاري تحميل بيانات المنصب...</Typography>
      </Box>
    );
  }

  if (loadError || !formData) {
    return (
      <Box sx={{ p: 3, direction: "rtl" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError || "فشل في تحميل بيانات المنصب"}
        </Alert>
        <Box sx={{ display: "flex", gap: 2 }}>
          <button onClick={() => window.location.reload()}>
            إعادة المحاولة
          </button>
          <button onClick={() => navigate("/modules/positions")}>
            العودة إلى القائمة
          </button>
        </Box>
      </Box>
    );
  }

  const sections = [
    {
      title: "تعديل معلومات المنصب",
      content: (
        <PositionInformation
          updateData={handleDataChange}
          initialData={formData}
          isEditMode={true}
        />
      ),
    },
  ];

  const isFormValid =
    formData.title?.trim() && formData.code?.trim() && formData.departmentId;

  return (
    <div style={{ direction: "rtl" }}>
      <NotificationComponent />
      <CustomAccordionForm
        title={`تعديل المنصب: ${formData.title}`}
        sections={sections}
        onSubmit={handleSubmit}
        onBack={handleBack}
        submitButtonText={isSubmitting ? "جاري التحديث..." : "تحديث المنصب"}
        backButtonText="إلغاء"
        isSubmitDisabled={isSubmitting || !isFormValid}
        errorMessage={
          !isFormValid && formData.title
            ? "يرجى ملء جميع الحقول المطلوبة بشكل صحيح"
            : ""
        }
        showCancelButton={true}
        onCancel={handleDelete}
      />
    </div>
  );
};

export default PositionEdit;
