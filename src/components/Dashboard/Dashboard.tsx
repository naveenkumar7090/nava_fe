import React, { useState, useEffect, createContext, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Logout,
  AccountCircle,
  Settings,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';

// Create context for booking data
interface BookingData {
  staff_name: string;
  notes: string;
  customer_booking_start_time: string;
  post_buffer: number;
  staff_contact_number: string;
  customer_contact_no: string;
  booked_on: string;
  triggered_by: string;
  staff_designation: string;
  booking_id: string;
  workspace_id: string;
  duration: string;
  staff_id: string;
  service_id: string;
  cost_paid: string;
  currency: string;
  iso_end_time: string;
  workspace_name: string;
  customer_notification: string;
  pre_buffer: number;
  service_description: string;
  triggered_from: string;
  cost: string;
  service_name: string;
  payment_status: string;
  end_time: string;
  time_zone: string;
  iso_start_time: string;
  start_time: string;
  last_updated_time: string;
  due: string;
  customer_email: string;
  booking_type: string;
  booked_ip_address: string;
  customer_name: string;
  summary_url: string;
  staff_email: string;
  customer_booking_time_zone: string;
  status: string;
}

interface BookingContextType {
  bookings: BookingData[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
  fetchBookings: (page?: number) => Promise<void>;
}

const BookingContext = createContext<BookingContextType>({
  bookings: [],
  loading: true,
  error: null,
  currentPage: 1,
  hasNextPage: false,
  totalPages: 1,
  fetchBookings: async () => {},
});

export const useBookings = () => useContext(BookingContext);

const drawerWidth = 280;
const collapsedDrawerWidth = 73;

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Booking data state
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  
  // Fetch bookings function with pagination
  const fetchBookings = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🎫 Fetching bookings from /bookings endpoint... Page: ${page}`);
      
      // Add page parameter to the API call
      const response = await axios.get('/bookings', {
        params: { page }
      });
      console.log('✅ Bookings API Response:', response);
      console.log('📊 Response Data:', response.data);
      
      // Handle new API response structure: { status, message, data: { bookings, total, pagination } }
      // Also handle old Zoho API structure: { response: { returnvalue: { response, ... } } }
      let bookingsData = [];
      let nextPageAvailable = false;
      let currentPageFromAPI = page;
      let totalCount = 0;
      
      if (response.data?.data?.bookings) {
        // New API structure (direct bookings API)
        bookingsData = response.data.data.bookings;
        totalCount = response.data.data.total || 0;
        const pagination = response.data.data.pagination;
        if (pagination) {
          currentPageFromAPI = pagination.page || page;
          nextPageAvailable = pagination.page < pagination.totalPages;
          setTotalPages(pagination.totalPages || 1);
        } else {
          // No pagination info, assume single page
          nextPageAvailable = false;
          setTotalPages(1);
        }
        console.log('📊 Using new API structure');
      } else if (response.data?.response?.returnvalue?.response) {
        // Old Zoho API structure (for backward compatibility)
        bookingsData = response.data.response.returnvalue.response;
        nextPageAvailable = response.data.response.returnvalue.next_page_available;
        currentPageFromAPI = response.data.response.returnvalue.page || page;
        console.log('📊 Using old Zoho API structure');
      } else if (Array.isArray(response.data)) {
        // Direct array response
        bookingsData = response.data;
        console.log('📊 Using direct array response');
      } else {
        console.warn('⚠️ Unknown response structure:', response.data);
        bookingsData = [];
      }
      
      console.log('📊 Bookings Data:', bookingsData);
      console.log('📄 Next Page Available:', nextPageAvailable);
      console.log('📄 Current Page:', currentPageFromAPI);
      console.log('📄 Total Count:', totalCount);
      
      if (Array.isArray(bookingsData)) {
        setBookings(bookingsData);
        setCurrentPage(currentPageFromAPI);
        setHasNextPage(nextPageAvailable === true);
        
        // Calculate total pages if not provided
        if (!response.data?.data?.pagination && totalCount > 0) {
          const itemsPerPage = 50;
          const calculatedPages = Math.ceil(totalCount / itemsPerPage);
          setTotalPages(calculatedPages);
        }
      } else {
        console.warn('⚠️ Bookings data is not an array:', bookingsData);
        setBookings([]);
      }
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      setError('Failed to fetch bookings');
      if (axios.isAxiosError(error)) {
        console.error('📄 Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings(1);
  }, []);
  
  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/account/')) {
      return 'Account Details';
    }
    switch (path) {
      case '/consultations':
        return 'Consultations Management';
      case '/cms':
        return 'Content Management System';
      case '/consultants':
        return 'Consultants Management';  
      case '/reports':
        return 'Reports & Analytics';
      default:
        return 'Dashboard';
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const currentDrawerWidth = isSidebarCollapsed ? collapsedDrawerWidth : drawerWidth;

  return (
    <BookingContext.Provider value={{ 
      bookings, 
      loading, 
      error, 
      currentPage, 
      hasNextPage, 
      totalPages, 
      fetchBookings 
    }}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        {/* Top AppBar */}
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${currentDrawerWidth}px)`,
            ml: `${currentDrawerWidth}px`,
            backgroundColor: 'white',
            color: 'text.primary',
            boxShadow: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="toggle sidebar"
              onClick={toggleSidebar}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
              {getPageTitle()}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {user?.firstName} {user?.lastName}
              </Typography>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 32,
                    height: 32,
                    fontSize: 14,
                  }}
                >
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>
                  <AccountCircle sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Settings sx={{ mr: 1 }} />
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
        />

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 0,
            width: { sm: `calc(100% - ${currentDrawerWidth}px)` },
            mt: '64px', // AppBar height
            backgroundColor: theme.palette.grey[50],
            minHeight: 'calc(100vh - 64px)',
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </BookingContext.Provider>
  );
};

export default Dashboard;
