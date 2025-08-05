import React, { useState, useEffect, useRef } from "react";
import {
  InputField,
  InputNoFormButton,
} from "../../shared/components/InputFieldNew";
import { cityAPI, Tenant, City } from "./api";

interface TenantInformationProps {
  initialData?: any;
  updateData?: (data: any) => void;
  isEditMode?: boolean;
  hasTriedSubmit?: boolean;
}

const TenantInformation: React.FC<TenantInformationProps> = ({
  initialData,
  updateData,
  isEditMode = false,
  hasTriedSubmit = false,
}) => {
  const [formData, setFormData] = useState({
    tenantName: "",
    institutionName: "",
    cityId: "",
    address: "",
    phone: "",
    email: "",
    isActive: true,
  });

  const [cityOptions, setCityOptions] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const citiesLoadedRef = useRef(false);
  const initialDataLoadedRef = useRef(false);
  const lastInitialDataId = useRef(null);

  useEffect(() => {
    if (citiesLoadedRef.current) return;

    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const cities: City[] = await cityAPI.getAll();
        const options = cities.map((city: City) => ({
          id: city.id,
          name: city.name,
        }));
        setCityOptions(options);
        citiesLoadedRef.current = true;
      } catch (error: any) {
        setCityOptions([]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    if (!initialData || lastInitialDataId.current === initialData.id) return;

    const updatedData = {
      tenantName: initialData.tenantName || "",
      institutionName: initialData.institutionName || "",
      cityId: initialData.cityId
        ? initialData.cityId.toString()
        : initialData.cityName
        ? findCityIdByName(initialData.cityName)
        : "",
      address: initialData.address || "",
      phone: initialData.phone || "",
      email: initialData.email || "",
      isActive:
        initialData.isActive !== undefined ? initialData.isActive : true,
    };

    setFormData(updatedData);
    lastInitialDataId.current = initialData.id;
    initialDataLoadedRef.current = true;
  }, [initialData?.id, cityOptions]);

  const findCityIdByName = (cityName: string): string => {
    const city = cityOptions.find((option) => option.name === cityName);
    return city ? city.id.toString() : "";
  };

  useEffect(() => {
    if (initialDataLoadedRef.current && updateData) {
      updateData(formData);
    }
  }, [formData, updateData]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    let val = type === "checkbox" ? checked : value;

    if (name === "cityId") {
      val = value?.toString() || "";
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: val,
    }));
  };

  const activeOptions = [
    { id: true, name: "نشط" },
    { id: false, name: "غير نشط" },
  ];

  // دوال التحقق
  const validateEmail = (
    email: string
  ): { error: boolean; helperText: string } => {
    if (!email) return { error: false, helperText: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: true, helperText: "يرجى إدخال بريد إلكتروني صحيح" };
    }
    return { error: false, helperText: "" };
  };

  const validatePhone = (
    phone: string
  ): { error: boolean; helperText: string } => {
    if (!phone) return { error: false, helperText: "" };
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      return { error: true, helperText: "يرجى إدخال رقم هاتف صحيح" };
    }
    return { error: false, helperText: "" };
  };

  const emailValidation = validateEmail(formData.email);
  const phoneValidation = validatePhone(formData.phone);

  return (
    <div style={{ direction: "rtl" }}>
      <InputNoFormButton>
        <InputField
          label="اسم المؤسسة *"
          name="tenantName"
          value={formData.tenantName}
          onChange={handleChange}
          type="text"
          required
          error={(hasTriedSubmit || isEditMode) && !formData.tenantName}
          helperText={
            (hasTriedSubmit || isEditMode) && !formData.tenantName
              ? "اسم المؤسسة مطلوب"
              : ""
          }
        />

        <InputField
          label="اسم المنشأة *"
          name="institutionName"
          value={formData.institutionName}
          onChange={handleChange}
          type="text"
          required
          error={(hasTriedSubmit || isEditMode) && !formData.institutionName}
          helperText={
            (hasTriedSubmit || isEditMode) && !formData.institutionName
              ? "اسم المنشأة مطلوب"
              : ""
          }
        />

        <InputField
          label="المدينة"
          name="cityId"
          value={formData.cityId}
          onChange={handleChange}
          type="select"
          options={cityOptions}
          loading={loadingCities}
          required={false}
          error={false}
          helperText=""
          placeholder="اختر المدينة "
        />

        <InputField
          label="العنوان *"
          name="address"
          value={formData.address}
          onChange={handleChange}
          type="textarea"
          required
          rows={1}
          error={(hasTriedSubmit || isEditMode) && !formData.address}
          helperText={
            (hasTriedSubmit || isEditMode) && !formData.address
              ? "العنوان مطلوب"
              : ""
          }
        />

        <InputField
          label="رقم الهاتف *"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          type="text"
          required
          error={phoneValidation.error}
          helperText={phoneValidation.helperText}
        />

        <InputField
          label="البريد الإلكتروني *"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          required
          error={emailValidation.error}
          helperText={emailValidation.helperText}
        />

        {isEditMode && (
          <InputField
            label="حالة المؤسسة"
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

export default TenantInformation;


