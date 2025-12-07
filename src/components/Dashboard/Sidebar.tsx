import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Avatar,
  Divider,
  useTheme,
} from '@mui/material';
import {
  CalendarToday,
  People,
  Article,
  Assessment,
  Settings,
  Star,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 280;
const collapsedDrawerWidth = 73;

interface SidebarProps {
  isCollapsed: boolean;
}

const menuItems = [
  { id: 'consultations', label: 'Consultations', icon: <CalendarToday />, path: '/consultations' },
  { id: 'cms', label: 'CMS', icon: <Article />, path: '/cms' },
  { id: 'consultants', label: 'Consultants', icon: <People />, path: '/consultants' },
  // { id: 'reports', label: 'Reports', icon: <Assessment />, path: '/reports' },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentDrawerWidth = isCollapsed ? collapsedDrawerWidth : drawerWidth;
  
  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: currentDrawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: currentDrawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.default,
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      {/* Brand Section */}
      <Box
        sx={{
          p: isCollapsed ? 1.5 : 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          minHeight: 80,
        }}
      >
        <Star sx={{ fontSize: 32, color: theme.palette.primary.main }} />
        {!isCollapsed && (
          <Box>
            <Typography variant="h6" fontWeight="bold" color="primary">
              Smart Vastu & Astro
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Admin Panel
            </Typography>
          </Box>
        )}
      </Box>

      {/* User Profile Section */}
      {!isCollapsed && (
        <Box sx={{ p: 2, backgroundColor: theme.palette.grey[50] }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 40,
                height: 40,
              }}
            >
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight="medium">
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role === 'admin' ? 'Administrator' : 
                 user?.role === 'consultant' ? 'Consultant' : 
                 user?.role === 'editor' ? 'Content Editor' : 'User'}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ flex: 1, p: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleMenuItemClick(item.path)}
              sx={{
                borderRadius: 1,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                px: isCollapsed ? 1 : 2,
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
                  color: theme.palette.primary.main,
                  border: `1px solid ${theme.palette.primary.light}`,
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #bfdbfe 0%, #dbeafe 100%)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: isCollapsed ? 'auto' : 40,
                justifyContent: 'center'
              }}>
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 'medium' : 'normal',
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Settings */}
      <List sx={{ p: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            sx={{
              borderRadius: 1,
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              px: isCollapsed ? 1 : 2,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon sx={{ 
              minWidth: isCollapsed ? 'auto' : 40,
              justifyContent: 'center'
            }}>
              <Settings />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Settings" />}
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
