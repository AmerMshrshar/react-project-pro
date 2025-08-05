import React from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";
import {
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Group as GroupIcon,
  Engineering as EngineeringIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "إدارة المؤسسات",
      description: "إدارة المؤسسات والمنشآت",
      icon: BusinessIcon,
      path: "/modules/tenant",
      color: "#673ab7",
    },
    {
      title: "إدارة الأقسام",
      description: "إضافة وتعديل أقسام الشركة",
      icon: BusinessIcon,
      path: "/modules/departments",
      color: "#1976d2",
    },
    {
      title: "إدارة المناصب",
      description: "تعريف وإدارة المناصب الوظيفية",
      icon: EngineeringIcon,
      path: "/modules/positions",
      color: "#d32f2f",
    },
    // {
    //   title: "التقارير المالية",
    //   description: "عرض التقارير والإحصائيات",
    //   icon: TrendingUpIcon,
    //   path: "/modules/reports",
    //   color: "#388e3c",
    // },
    // {
    //   title: "إدارة المستخدمين",
    //   description: "إدارة المستخدمين والصلاحيات",
    //   icon: GroupIcon,
    //   path: "/modules/users",
    //   color: "#7b1fa2",
    // },
  ];
  const recentStats = [
    { label: "إجمالي المؤسسات", value: "14", color: "#388e3c" },
    { label: "إجمالي الأقسام", value: "0", color: "#1976d2" },
    { label: "إجمالي المناصب", value: "0", color: "#d32f2f" },
  ];

  return (
    <Box sx={{ direction: "rtl" }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          مرحباً بك في لوحة التحكم المحترفة
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: "1.1rem" }}
        >
          إدارة شاملة لجميع عمليات الشركة والموارد البشرية
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {recentStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: "100%",
                background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                border: `1px solid ${stat.color}30`,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 3,
                },
                transition: "all 0.3s ease",
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    color: stat.color,
                    mb: 1,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          الإجراءات السريعة
        </Typography>

        <Grid container spacing={3}>
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                    transition: "all 0.3s ease",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <CardContent
                    sx={{
                      textAlign: "center",
                      p: 3,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      <IconComponent
                        sx={{
                          fontSize: 48,
                          color: action.color,
                        }}
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                        color: "text.primary",
                      }}
                    >
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {action.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Card
        sx={{ p: 3, backgroundColor: "#f8f9fa", border: "1px solid #e0e0e0" }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          نصائح للبدء
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              • ابدأ بإعداد الأقسام والوحدات التنظيمية
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              • أضف المستخدمين وحدد صلاحياتهم
            </Typography>
            <Typography variant="body2">
              • راجع التقارير الدورية لمتابعة الأداء
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              • استخدم المفضلة للوصول السريع للوحدات
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              • تابع الأنشطة الحديثة من قسم "الأحدث"
            </Typography>
            <Typography variant="body2">
              • نظم عملك باستخدام مساحات العمل المختلفة
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default HomePage;
