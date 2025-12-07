import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Assessment, TrendingUp, BarChart, PieChart } from '@mui/icons-material';

const Reports: React.FC = () => {
  const reportTypes = [
    { title: 'Revenue Reports', icon: <TrendingUp sx={{ fontSize: 32, color: '#22c55e' }} />, description: 'Monthly and yearly revenue analysis' },
    { title: 'Performance Analytics', icon: <BarChart sx={{ fontSize: 32, color: '#3b82f6' }} />, description: 'Consultant performance metrics' },
    { title: 'Customer Insights', icon: <PieChart sx={{ fontSize: 32, color: '#3b82f6' }} />, description: 'Customer behavior and preferences' },
    { title: 'Service Analysis', icon: <Assessment sx={{ fontSize: 32, color: '#8b5cf6' }} />, description: 'Vastu vs Astro service comparison' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Reports & Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Comprehensive reporting and analytics for business insights
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          md: 'repeat(2, 1fr)' 
        }, 
        gap: 3, 
        mb: 3 
      }}>
        {reportTypes.map((report, index) => (
          <Card key={index} sx={{ p: 3, height: '100%' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                {report.icon}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {report.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {report.description}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card sx={{ p: 4, textAlign: 'center' }}>
        <CardContent>
          <Assessment sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Advanced Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Detailed reporting features are coming soon. This will include interactive dashboards, 
            custom report generation, data visualization, and export capabilities.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reports;
