import React from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { Article, Add, Edit, Settings } from '@mui/icons-material';

const CMS: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 1 }}>
            Cms Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage dynamic pages for your mobile app
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          size="large"
        >
          Create New Page
        </Button>
      </Box>

      {/* Button Showcase Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 1 }}>
          Semantic Button System
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Clean, semantic button designs with clear meaning and purpose
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4, p: 3, backgroundColor: '#f8fafc', borderRadius: 2 }}>
          <Button variant="contained" color="primary" startIcon={<Add />}>
            Primary Action
          </Button>
          <Button variant="contained" color="secondary" startIcon={<Edit />}>
            Secondary Action
          </Button>
          <Button variant={"destructive" as any} startIcon={<Settings />} size="small">
            Delete Item
          </Button>
          <Button variant={"success" as any} startIcon={<Article />} size="small">
            Confirm Action
          </Button>
          <Button variant="outlined">
            Outlined Button
          </Button>
          <Button variant="text">
            Text Button
          </Button>
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
          <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 1, border: '1px solid #e5e7eb' }}>
            <Typography variant="subtitle2" fontWeight="600" color="#2563eb" gutterBottom>
              Primary (Blue)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Main actions, save, submit, create
            </Typography>
          </Box>
          <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 1, border: '1px solid #e5e7eb' }}>
            <Typography variant="subtitle2" fontWeight="600" color="#6b7280" gutterBottom>
              Secondary (Gray)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Cancel, back, neutral actions
            </Typography>
          </Box>
          <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 1, border: '1px solid #e5e7eb' }}>
            <Typography variant="subtitle2" fontWeight="600" color="#dc2626" gutterBottom>
              Destructive (Red)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Delete, remove, dangerous actions
            </Typography>
          </Box>
          <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 1, border: '1px solid #e5e7eb' }}>
            <Typography variant="subtitle2" fontWeight="600" color="#059669" gutterBottom>
              Success (Green)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Confirm, approve, success actions
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 1 }}>
          Pages Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Create and manage dynamic pages for your mobile app
        </Typography>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
          gap: 3 
        }}>
          {/* Create Pages Card */}
          <Card sx={{ 
            p: 3, 
            textAlign: 'center', 
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            }
          }}>
            <CardContent sx={{ pb: 2 }}>
              <Add sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Create Pages
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Build dynamic pages with custom layouts and content
              </Typography>
            </CardContent>
          </Card>

          {/* Manage Content Card */}
          <Card sx={{ 
            p: 3, 
            textAlign: 'center', 
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            }
          }}>
            <CardContent sx={{ pb: 2 }}>
              <Edit sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Manage Content
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Edit existing pages and update content dynamically
              </Typography>
            </CardContent>
          </Card>

          {/* Page Settings Card */}
          <Card sx={{ 
            p: 3, 
            textAlign: 'center', 
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
            }
          }}>
            <CardContent sx={{ pb: 2 }}>
              <Settings sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Page Settings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure page permissions and publishing options
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default CMS;
