import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ArrowBack,
  Star,
  Assessment,
} from '@mui/icons-material';
import axios from 'axios';

interface BookingData {
  booking_id: string;
  customer_name: string;
  customer_booking_start_time: string;
  status: string;
  service_name: string;
  cost: string;
  customer_email: string;
  customer_contact_no: string;
}

interface ConsultantStats {
  totalBookings: number;
  averageRating: number;
  yearsExperience: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ConsultantOverview: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [consultantName, setConsultantName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState<ConsultantStats>({
    totalBookings: 0,
    averageRating: 0,
    yearsExperience: 0,
  });

  useEffect(() => {
    if (staffId) {
      fetchConsultantBookings();
    }
  }, [staffId]);

  const fetchConsultantBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔍 Fetching bookings for staff ID: ${staffId}`);
      
      // Call the API endpoint with staff_id in the body
      const response = await axios.post('/bookings/by-staff', {
        staff_id: staffId
      });
      
      console.log('✅ Consultant bookings response:', response.data);
      
      if (response.data.status === 'success') {
        const bookingsData = response.data.response?.returnvalue?.response || [];
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        
        // Extract consultant name from first booking
        if (bookingsData.length > 0) {
          setConsultantName(bookingsData[0].staff_name || 'Unknown Consultant');
          
          // Calculate stats
          const totalBookings = bookingsData.length;
          const completedBookings = bookingsData.filter((b: BookingData) => 
            b.status.toLowerCase() === 'completed'
          ).length;
          
          setStats({
            totalBookings,
            averageRating: 4.8, // Mock rating - would come from API
            yearsExperience: 15, // Mock experience - would come from API
          });
        }
      }
    } catch (error) {
      console.error('❌ Error fetching consultant bookings:', error);
      setError('Failed to fetch consultant bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return { backgroundColor: '#d1fae5', color: '#065f46' };
      case 'scheduled':
      case 'yet_to_mark':
        return { backgroundColor: '#dbeafe', color: '#1e40af' };
      case 'in_progress':
        return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'cancelled':
        return { backgroundColor: '#fee2e2', color: '#991b1b' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  const formatStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'yet_to_mark':
        return 'Scheduled';
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading consultant details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/consultations')}
        >
          Back to Consultations
        </Button>
      </Box>
    );
  }

  const upcomingBookings = bookings.filter(booking => 
    booking.status.toLowerCase() === 'scheduled' || booking.status.toLowerCase() === 'yet_to_mark'
  );
  
  const pastBookings = bookings.filter(booking => 
    booking.status.toLowerCase() === 'completed'
  );

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/consultations')}
          sx={{ mr: 2, color: '#6b7280' }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" fontWeight="600" color="#1f2937">
          Consultant Overview - {consultantName}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="outlined"
          startIcon={<Assessment />}
          sx={{ 
            color: '#f97316',
            borderColor: '#f97316',
            '&:hover': {
              backgroundColor: '#fff7ed',
              borderColor: '#f97316',
            }
          }}
        >
          Reports
        </Button>
      </Box>

      {/* Consultant Profile Card */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                fontSize: '1.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                color: 'white',
              }}
            >
              {getInitials(consultantName)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight="700" color="#1f2937" gutterBottom>
                {consultantName}
              </Typography>
              <Typography variant="body1" color="#6b7280" sx={{ mb: 2 }}>
                Expert Vastu consultant with {stats.yearsExperience}+ years of experience
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
        gap: 3, 
        mb: 4 
      }}>
        <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h3" fontWeight="700" color="#3b82f6" gutterBottom>
              {stats.totalBookings}
            </Typography>
            <Typography variant="body2" color="#6b7280" fontWeight="500">
              Total Bookings
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 1 }}>
              <Typography variant="h3" fontWeight="700" color="#f97316">
                {stats.averageRating}
              </Typography>
              <Star sx={{ color: '#f97316', fontSize: '2rem' }} />
            </Box>
            <Typography variant="body2" color="#6b7280" fontWeight="500">
              Average Rating
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h3" fontWeight="700" color="#22c55e" gutterBottom>
              {stats.yearsExperience}
            </Typography>
            <Typography variant="body2" color="#6b7280" fontWeight="500">
              Years Experience
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Bookings Tabs */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ px: 3 }}
          >
            <Tab 
              label={`Upcoming Bookings`}
              sx={{ 
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            />
            <Tab 
              label={`Past Bookings`}
              sx={{ 
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {/* Upcoming Bookings */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Customer Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Booking Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {upcomingBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No upcoming bookings
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  upcomingBookings.map((booking) => (
                    <TableRow key={booking.booking_id}>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {booking.customer_name}
                      </TableCell>
                      <TableCell>
                        {new Date(booking.customer_booking_start_time).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        }).replace(/\//g, '-')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatStatus(booking.status)}
                          size="small"
                          sx={{
                            ...getStatusColor(booking.status),
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Past Bookings */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Customer Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Booking Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pastBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No past bookings
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  pastBookings.map((booking) => (
                    <TableRow key={booking.booking_id}>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {booking.customer_name}
                      </TableCell>
                      <TableCell>
                        {new Date(booking.customer_booking_start_time).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        }).replace(/\//g, '-')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatStatus(booking.status)}
                          size="small"
                          sx={{
                            ...getStatusColor(booking.status),
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Card>
    </Box>
  );
};

export default ConsultantOverview;
