import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  Phone,
  Email,
  LocationOn,
  Star,
  CalendarToday,
  TrendingUp,
  Assignment,
  Edit,
  Schedule,
  Assessment,
} from '@mui/icons-material';
import axios from 'axios';

interface StaffMember {
  staff_id: string;
  staff_name: string;
  staff_email: string;
  staff_designation?: string;
  staff_contact_number?: string;
  additional_information?: string;
  photo?: string;
  assigned_services?: string[];
  experience_years?: number;
  total_bookings?: number;
  avg_rating?: number;
  total_commission?: number;
  status?: 'Active' | 'Inactive';
  type?: 'Vastu' | 'Astro';
}

interface RecentActivity {
  id: string;
  type: 'consultation' | 'upload' | 'schedule' | 'join';
  description: string;
  timestamp: string;
}

const ConsultantDetails: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();
  
  const [consultant, setConsultant] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock recent activities - in real app, this would come from API
  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'consultation',
      description: 'Completed consultation for Priya Kumar',
      timestamp: 'Mar 19, 2024, 6:19 PM'
    },
    {
      id: '2',
      type: 'upload',
      description: 'Uploaded remedy PDF for Amit Gupta',
      timestamp: 'Mar 18, 2024, 3:45 PM'
    },
    {
      id: '3',
      type: 'schedule',
      description: 'Updated availability schedule',
      timestamp: 'Mar 17, 2024, 10:30 AM'
    },
    {
      id: '4',
      type: 'join',
      description: 'Joined new consultation with Sunita Patel',
      timestamp: 'Mar 16, 2024, 4:15 PM'
    }
  ];

  useEffect(() => {
    if (staffId) {
      fetchConsultantDetails();
    }
  }, [staffId]);

  const fetchConsultantDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔍 Fetching consultant details for staff ID: ${staffId}`);
      
      const response = await axios.get('/staff');
      console.log('✅ Staff API Response:', response.data);
      
      // Extract staff data from response
      const staffList = response.data.data.response?.returnvalue?.data || response.data.data?.response || response.data.data || [];
      
      // Find the specific consultant
      const consultantData = Array.isArray(staffList) ? staffList.find((staff: any) => staff.id === staffId) : null;
      
      if (consultantData) {
        const transformedConsultant: StaffMember = {
          staff_id: consultantData.id,
          staff_name: consultantData.name || 'Unknown',
          staff_email: consultantData.email || '',
          staff_designation: consultantData.designation || '',
          staff_contact_number: consultantData.phone || consultantData.contact_number || '',
          additional_information: consultantData.additional_information || '',
          photo: consultantData.photo || '',
          assigned_services: consultantData.assigned_services || [],
          experience_years: 15, // Mock data - would come from API
          total_bookings: 245, // Mock data - would come from API
          avg_rating: 4.8, // Mock data - would come from API
          total_commission: 185000, // Mock data - would come from API
          status: 'Active' as 'Active' | 'Inactive',
          type: 'Vastu' as 'Vastu' | 'Astro',
        };
        
        setConsultant(transformedConsultant);
      } else {
        setError('Consultant not found');
      }
    } catch (error) {
      console.error('❌ Error fetching consultant details:', error);
      setError('Failed to fetch consultant details');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 3);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3b82f6' }} />;
      case 'upload':
        return <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3b82f6' }} />;
      case 'schedule':
        return <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3b82f6' }} />;
      case 'join':
        return <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3b82f6' }} />;
      default:
        return <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#6b7280' }} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading consultant details...</Typography>
      </Box>
    );
  }

  if (error || !consultant) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Consultant not found'}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/consultants')}
        >
          Back to Consultants
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/consultants')}
          sx={{ mr: 2, color: '#6b7280' }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" fontWeight="600" color="#1f2937">
          Consultant Details
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Left Column */}
        <Box sx={{ flex: { xs: 1, md: 2 } }}>
          {/* Consultant Profile Card */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 4 }}>
                <Avatar
                  src={consultant.photo || undefined}
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                  }}
                >
                  {getInitials(consultant.staff_name)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" fontWeight="700" color="#1f2937" gutterBottom>
                    {consultant.staff_name}
                  </Typography>
                  <Chip
                    label={`${consultant.type} Consultant`}
                    size="small"
                    sx={{
                      backgroundColor: consultant.type === 'Vastu' ? '#fef3c7' : '#dbeafe',
                      color: consultant.type === 'Vastu' ? '#92400e' : '#1e40af',
                      fontWeight: 500,
                      mb: 2,
                    }}
                  />
                  <Chip
                    label={consultant.status}
                    size="small"
                    sx={{
                      backgroundColor: consultant.status === 'Active' ? '#dcfce7' : '#fef2f2',
                      color: consultant.status === 'Active' ? '#166534' : '#991b1b',
                      fontWeight: 500,
                      ml: 1,
                      mb: 2,
                    }}
                  />
                  <Typography variant="body1" color="#6b7280" sx={{ mb: 2 }}>
                    Residential Vastu
                  </Typography>
                </Box>
              </Box>

              {/* Stats Grid */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
                gap: 3 
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <Star sx={{ color: '#f59e0b', mr: 0.5 }} />
                    <Typography variant="h6" fontWeight="600" color="#1f2937">
                      {consultant.experience_years}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="#6b7280">
                    Years Exp
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <Star sx={{ color: '#f59e0b', mr: 0.5 }} />
                    <Typography variant="h6" fontWeight="600" color="#1f2937">
                      {consultant.avg_rating}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="#6b7280">
                    Avg Rating
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <CalendarToday sx={{ color: '#10b981', mr: 0.5, fontSize: '1.2rem' }} />
                    <Typography variant="h6" fontWeight="600" color="#1f2937">
                      {consultant.total_bookings}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="#6b7280">
                    Total Bookings
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <TrendingUp sx={{ color: '#8b5cf6', mr: 0.5, fontSize: '1.2rem' }} />
                    <Typography variant="h6" fontWeight="600" color="#1f2937">
                      ₹{consultant.total_commission?.toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="#6b7280">
                    This Month
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUp sx={{ mr: 1, color: '#6b7280' }} />
                <Typography variant="h6" fontWeight="600" color="#1f2937">
                  Recent Activity
                </Typography>
              </Box>
              
              {recentActivities.map((activity, index) => (
                <Box key={activity.id}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 2 }}>
                    {getActivityIcon(activity.type)}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="#1f2937" fontWeight="500">
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" color="#6b7280">
                        {activity.timestamp}
                      </Typography>
                    </Box>
                  </Box>
                  {index < recentActivities.length - 1 && (
                    <Divider sx={{ my: 1, ml: 3 }} />
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>

        {/* Right Column */}
        <Box sx={{ flex: { xs: 1, md: 1 } }}>
          {/* Contact Information */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" color="#1f2937" gutterBottom>
                Contact Information
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Phone sx={{ color: '#6b7280', fontSize: '1.2rem' }} />
                <Box>
                  <Typography variant="body2" color="#6b7280">
                    Phone
                  </Typography>
                  <Typography variant="body2" fontWeight="500" color="#1f2937">
                    {consultant.staff_contact_number || '+91 98765 43210'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Email sx={{ color: '#6b7280', fontSize: '1.2rem' }} />
                <Box>
                  <Typography variant="body2" color="#6b7280">
                    Email
                  </Typography>
                  <Typography variant="body2" fontWeight="500" color="#1f2937">
                    {consultant.staff_email || 'arun.sharma@example.com'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LocationOn sx={{ color: '#6b7280', fontSize: '1.2rem' }} />
                <Box>
                  <Typography variant="body2" color="#6b7280">
                    Location
                  </Typography>
                  <Typography variant="body2" fontWeight="500" color="#1f2937">
                    Delhi
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" color="#1f2937" gutterBottom>
                Professional Details
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="#6b7280">
                  Join Date
                </Typography>
                <Typography variant="body2" fontWeight="500" color="#1f2937">
                  2020-03-15
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="#6b7280">
                  Consultant ID
                </Typography>
                <Typography variant="body2" fontWeight="500" color="#1f2937">
                  CONS001
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="#6b7280">
                  Total Commission
                </Typography>
                <Typography variant="body2" fontWeight="500" color="#1f2937">
                  ₹1,85,000
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Edit />}
              sx={{
                backgroundColor: '#f97316',
                '&:hover': {
                  backgroundColor: '#ea580c',
                },
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Edit Details
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Schedule />}
              sx={{
                borderColor: '#3b82f6',
                color: '#3b82f6',
                '&:hover': {
                  backgroundColor: '#eff6ff',
                  borderColor: '#3b82f6',
                },
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              View Schedule
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Assessment />}
              sx={{
                borderColor: '#6b7280',
                color: '#6b7280',
                '&:hover': {
                  backgroundColor: '#f9fafb',
                  borderColor: '#6b7280',
                },
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Performance Report
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ConsultantDetails;
