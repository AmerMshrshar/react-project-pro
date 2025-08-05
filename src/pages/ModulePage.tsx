import React from 'react';
import { Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

const ModulePage: React.FC = () => {
  const { moduleName } = useParams<{ moduleName: string }>();

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ textTransform: 'capitalize' }}>
        وحدة {moduleName?.replace('-', ' ')}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        مرحباً بك في وحدة {moduleName}. من هنا يمكنك إدارة جميع الوظائف ذات الصلة.
      </Typography>
    </Box>
  );
};

export default ModulePage;