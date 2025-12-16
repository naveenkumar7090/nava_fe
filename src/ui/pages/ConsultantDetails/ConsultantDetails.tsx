import React from 'react';
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
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';
import {
  ArrowBack,
  Phone,
  Email,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useConsultantDetailsViewModel } from './useConsultantDetailsViewModel';

// Interface moved to ViewModel, but we might need it for prop types if we break components down
// For now, relying on ViewModel return type inference

interface RecentActivity {
  id: string;
  type: 'consultation' | 'upload' | 'schedule' | 'join';
  description: string;
  timestamp: string;
}

const ConsultantDetails: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();

  const { consultant, bookings, loading, error } = useConsultantDetailsViewModel(staffId);

  // Mock recent activities - in real app, this would come from API or be derived from booking history
  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'consultation',
      description: 'Completed consultation',
      timestamp: 'Recent'
    }
  ];

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

      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
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
                {getInitials(consultant.name)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight="700" color="#1f2937" gutterBottom>
                  {consultant.name}
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
                  label={consultant.status || 'Active'}
                  size="small"
                  sx={{
                    backgroundColor: consultant.status === 'active' ? '#dcfce7' : '#fef2f2',
                    color: consultant.status === 'active' ? '#166534' : '#991b1b',
                    fontWeight: 500,
                    ml: 1,
                    mb: 2,
                  }}
                />
                <Typography variant="body1" color="#6b7280" sx={{ mb: 2 }}>
                  {consultant.designation || 'Consultant'}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Contact Info (Replaces Stats Grid) */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Phone sx={{ color: '#6b7280', fontSize: '1.5rem' }} />
                <Box>
                  <Typography variant="caption" color="#6b7280">
                    Phone
                  </Typography>
                  <Typography variant="body1" fontWeight="500" color="#1f2937">
                    {consultant.phone || 'N/A'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Email sx={{ color: '#6b7280', fontSize: '1.5rem' }} />
                <Box>
                  <Typography variant="caption" color="#6b7280">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="500" color="#1f2937" sx={{ wordBreak: 'break-all' }}>
                    {consultant.email || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Box>

          </CardContent>
        </Card>

        {/* Assigned Bookings */}
        <Typography variant="h6" fontWeight="600" color="#1f2937" sx={{ mb: 2 }}>
          Assigned Bookings
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#ffffff' }}>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '1rem', py: 2.5, borderBottom: '1px solid #f0f0f0' }}>Booking ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '1rem', py: 2.5, borderBottom: '1px solid #f0f0f0' }}>Account Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '1rem', py: 2.5, borderBottom: '1px solid #f0f0f0' }}>Subject</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '1rem', py: 2.5, borderBottom: '1px solid #f0f0f0' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '1rem', py: 2.5, borderBottom: '1px solid #f0f0f0' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '1rem', py: 2.5, borderBottom: '1px solid #f0f0f0' }}>Creation Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '1rem', py: 2.5, borderBottom: '1px solid #f0f0f0' }}>Booking Date & Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <TableRow
                    key={booking.id}
                    onClick={() => navigate(`/bookings/${booking.id}`)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f8f9fa'
                      },
                      '&:last-child td': {
                        borderBottom: 0
                      }
                    }}
                  >
                    <TableCell sx={{ fontSize: '1rem', color: '#111827', py: 2.5, borderBottom: '1px solid #f0f0f0', fontWeight: 500 }}>
                      {booking.bookingId}
                    </TableCell>
                    <TableCell sx={{ fontSize: '1rem', py: 2.5, borderBottom: '1px solid #f0f0f0' }}>
                      <Typography
                        component="span"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (booking.account?.userId) {
                            navigate(`/account/${booking.account.userId}`);
                          }
                        }}
                        sx={{
                          color: '#2563eb',
                          fontSize: '1rem',
                          fontWeight: 500,
                          textDecoration: 'none',
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {booking.account?.name || 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '1rem', py: 2.5, borderBottom: '1px solid #f0f0f0' }}>
                      <Typography
                        component="span"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (booking.account?.userId) {
                            navigate(`/user-profiles/${booking.account.userId}/${booking.profile?.id || 'default'}`);
                          }
                        }}
                        sx={{
                          color: '#2563eb',
                          fontSize: '1rem',
                          fontWeight: 500,
                          textDecoration: 'none',
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {booking.profile?.name || booking.account?.name || 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: '1rem', color: '#111827', py: 2.5, borderBottom: '1px solid #f0f0f0' }}>
                      <Chip
                        label={booking.consultationType}
                        size="medium"
                        sx={{
                          backgroundColor: booking.consultationType?.toLowerCase() === 'vastu' ? '#fef3c7' : '#dbeafe',
                          color: booking.consultationType?.toLowerCase() === 'vastu' ? '#92400e' : '#1e40af',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          height: 28,
                          minWidth: 60
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '1rem', color: '#111827', py: 2.5, borderBottom: '1px solid #f0f0f0' }}>
                      <Chip
                        label={booking.status ? booking.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Pending'}
                        size="medium"
                        sx={{
                          backgroundColor:
                            booking.status?.toLowerCase() === 'completed' ? '#d1fae5' :
                              booking.status?.toLowerCase() === 'upcoming' ? '#dbeafe' :
                                booking.status?.toLowerCase() === 'ongoing' ? '#fef3c7' : '#f3f4f6',
                          color:
                            booking.status?.toLowerCase() === 'completed' ? '#065f46' :
                              booking.status?.toLowerCase() === 'upcoming' ? '#1e40af' :
                                booking.status?.toLowerCase() === 'ongoing' ? '#92400e' : '#374151',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          height: 28,
                          minWidth: 80
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '1rem', color: '#111827', py: 2.5, borderBottom: '1px solid #f0f0f0', fontWeight: 500 }}>
                      {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      }).replace(/\//g, '-') : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ fontSize: '1rem', color: '#111827', py: 2.5, borderBottom: '1px solid #f0f0f0', fontWeight: 500 }}>
                      {booking.scheduledStartTime
                        ? `${new Date(booking.scheduledStartTime).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        }).replace(/\//g, '-')} ${new Date(booking.scheduledStartTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}`
                        : 'Not Scheduled'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3, color: '#6b7280' }}>
                    No bookings assigned.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box >
  );
};

export default ConsultantDetails;
