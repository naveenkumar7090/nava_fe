import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper
} from '@mui/material';
import {
  ArrowBack,
  Person,
  LocationOn,
  Cake,
  AccessTime,
  WbSunny,
  NightsStay,
  PictureAsPdf,
  Download
} from '@mui/icons-material';
import { useCustomerProfileViewModel } from './useCustomerProfileViewModel';
import { Booking } from '../../../backend_api_client/models/booking';
import jsPDF from 'jspdf';

const CustomerProfile = () => {
  const { userId, userProfileId } = useParams<{ userId: string; userProfileId: string }>();
  const navigate = useNavigate();
  const { profile, bookings, loading, error, remedyDataMap } = useCustomerProfileViewModel(userId, userProfileId);

  const handleBack = () => {
    navigate(-1);
  };

  const generateAndDownloadRemedyPDF = (booking: Booking) => {
    const remedyData = remedyDataMap.get(booking.id);
    if (!remedyData) {
      alert('No remedy data available for this booking.');
      return;
    }

    // Validate that at least one remedy field has content
    const hasContent = remedyData.problems || remedyData.diagnosis || remedyData.suggestions || remedyData.products || remedyData.reminders;
    if (!hasContent) {
      alert('No remedy information available for this booking.');
      return;
    }

    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      // Set font and title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Remedy Report', 20, 30);
      
      let yPosition = 50;

      // Booking Information Section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Booking Information', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Booking ID: ${booking.bookingId}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Service: ${booking.service?.name || 'N/A'}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Consultation Type: ${booking.consultationType?.charAt(0).toUpperCase() + booking.consultationType?.slice(1) || 'N/A'}`, 20, yPosition);
      yPosition += 8;
      if (booking.scheduledStartTime) {
        const scheduledDate = new Date(booking.scheduledStartTime);
        doc.text(`Consultation Date: ${scheduledDate.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}`, 20, yPosition);
        yPosition += 8;
        doc.text(`Consultation Time: ${scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, 20, yPosition);
        yPosition += 8;
      }
      doc.text(`Status: ${booking.status}`, 20, yPosition);
      yPosition += 15;

      // Customer Information Section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Customer Information', 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${booking.account?.name || 'N/A'}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Email: ${booking.account?.email || 'N/A'}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Mobile: ${booking.account?.mobile || 'N/A'}`, 20, yPosition);
      yPosition += 15;

      // Profile Information Section (if available)
      if (booking.profile) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Astro Profile Information', 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Profile Name: ${booking.profile.name || 'N/A'}`, 20, yPosition);
        yPosition += 8;
        if (booking.profile.dateOfBirth) {
          const dob = new Date(booking.profile.dateOfBirth);
          doc.text(`Date of Birth: ${dob.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}`, 20, yPosition);
          yPosition += 8;
        }
        if (booking.profile.timeOfBirth) {
          const tob = new Date(booking.profile.timeOfBirth);
          doc.text(`Time of Birth: ${tob.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, 20, yPosition);
          yPosition += 8;
        }
        if (booking.profile.placeOfBirth) {
          doc.text(`Place of Birth: ${booking.profile.placeOfBirth}`, 20, yPosition);
          yPosition += 8;
        }
        if (booking.profile.gender) {
          doc.text(`Gender: ${booking.profile.gender}`, 20, yPosition);
          yPosition += 8;
        }
        if (booking.profile.sunSign) {
          doc.text(`Sun Sign: ${booking.profile.sunSign}`, 20, yPosition);
          yPosition += 8;
        }
        if (booking.profile.moonSign) {
          doc.text(`Moon Sign: ${booking.profile.moonSign}`, 20, yPosition);
          yPosition += 8;
        }
        yPosition += 10;
      }

      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }

      // Remedy Information Section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Remedy Information', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      // Problems section
      if (remedyData.problems) {
        doc.setFont('helvetica', 'bold');
        doc.text('Problems:', 20, yPosition);
        yPosition += 8;
        doc.setFont('helvetica', 'normal');
        const problemsLines = doc.splitTextToSize(remedyData.problems, 170);
        doc.text(problemsLines, 20, yPosition);
        yPosition += problemsLines.length * 6 + 10;
        
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
      }
      
      // Diagnosis section
      if (remedyData.diagnosis) {
        doc.setFont('helvetica', 'bold');
        doc.text('Diagnosis:', 20, yPosition);
        yPosition += 8;
        doc.setFont('helvetica', 'normal');
        const diagnosisLines = doc.splitTextToSize(remedyData.diagnosis, 170);
        doc.text(diagnosisLines, 20, yPosition);
        yPosition += diagnosisLines.length * 6 + 10;
        
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
      }
      
      // Suggestions section
      if (remedyData.suggestions) {
        doc.setFont('helvetica', 'bold');
        doc.text('Suggestions:', 20, yPosition);
        yPosition += 8;
        doc.setFont('helvetica', 'normal');
        const suggestionsLines = doc.splitTextToSize(remedyData.suggestions, 170);
        doc.text(suggestionsLines, 20, yPosition);
        yPosition += suggestionsLines.length * 6 + 10;
        
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
      }
      
      // Products section
      if (remedyData.products) {
        doc.setFont('helvetica', 'bold');
        doc.text('Recommended Products:', 20, yPosition);
        yPosition += 8;
        doc.setFont('helvetica', 'normal');
        const productsLines = doc.splitTextToSize(remedyData.products, 170);
        doc.text(productsLines, 20, yPosition);
        yPosition += productsLines.length * 6 + 10;
        
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
      }
      
      // Reminders section
      if (remedyData.reminders) {
        doc.setFont('helvetica', 'bold');
        doc.text('Reminders:', 20, yPosition);
        yPosition += 8;
        doc.setFont('helvetica', 'normal');
        const remindersLines = doc.splitTextToSize(remedyData.reminders, 170);
        doc.text(remindersLines, 20, yPosition);
      }
      
      // Add footer with date
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text(`Generated on: ${currentDate}`, 20, doc.internal.pageSize.height - 20);
      
      // Generate filename
      const customerName = booking.account?.name?.replace(/\s+/g, '_') || 'customer';
      const fileName = `remedy_${customerName}_${booking.bookingId}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Download the PDF
      doc.save(fileName);
      
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8f9fa' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Box sx={{ p: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mb: 2 }}>
          Go Back
        </Button>
        <Alert severity="error">
          {error || 'Profile not found'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{
            mr: 2,
            color: '#6b7280',
            textTransform: 'none',
            '&:hover': { bgcolor: '#e5e7eb' }
          }}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight="bold" color="text.primary">
          User Profile
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center" sx={{ mb: 4 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: profile.isDefault ? '#3b82f6' : '#8b5cf6',
                    fontSize: '2.5rem'
                  }}
                >
                  {profile.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {profile.name}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {profile.gender && (
                      <Typography variant="body1" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                        {profile.gender}
                      </Typography>
                    )}
                    {profile.isDefault && (
                      <Box sx={{
                        bgcolor: '#dbeafe',
                        color: '#1e40af',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        Default Profile
                      </Box>
                    )}
                  </Stack>

                  <Button
                    startIcon={<Download />}
                    variant="contained"
                    sx={{mt: 2}}
                  >
                    Download KUNDLI
                  </Button>
                </Box>
              </Stack>

              <Divider sx={{ mb: 4 }} />

              {/* Details Grid */}
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, color: 'text.secondary' }}>
                      <Cake fontSize="small" />
                      <Typography variant="subtitle2">Date of Birth</Typography>
                    </Stack>
                    <Typography variant="h6">
                      {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, color: 'text.secondary' }}>
                      <LocationOn fontSize="small" />
                      <Typography variant="subtitle2">Place of Birth</Typography>
                    </Stack>
                    <Typography variant="h6">
                      {profile.placeOfBirth || 'N/A'}
                    </Typography>
                    {profile.lat && profile.lon && (
                      <Typography variant="body2" color="text.secondary">
                        Lat: {profile.lat?.toFixed(4)}, Lon: {profile.lon?.toFixed(4)}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, color: 'text.secondary' }}>
                      <WbSunny fontSize="small" />
                      <Typography variant="subtitle2">Sun Sign</Typography>
                    </Stack>
                    <Typography variant="h6">
                      {profile.sunSign || 'Not calculated'}
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, color: 'text.secondary' }}>
                      <AccessTime fontSize="small" />
                      <Typography variant="subtitle2">Time of Birth</Typography>
                    </Stack>
                    <Typography variant="h6">
                      {profile.timeOfBirth ? new Date(profile.timeOfBirth).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Timezone Offset: {profile.timezoneOffset}
                    </Typography>
                  </Box>

                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, color: 'text.secondary' }}>
                      <NightsStay fontSize="small" />
                      <Typography variant="subtitle2">Moon Sign</Typography>
                    </Stack>
                    <Typography variant="h6">
                      {profile.moonSign || 'Not calculated'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Consultation History
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {bookings.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No consultations found for this profile.
                </Alert>
              ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ backgroundColor: '#ffffff' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '1rem', py: 2.5, borderBottom: '1px solid #f0f0f0' }}>Booking ID</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '1rem', py: 2.5, borderBottom: '1px solid #f0f0f0' }}>Consultant</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '1rem', py: 2.5, borderBottom: '1px solid #f0f0f0' }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '1rem', py: 2.5, borderBottom: '1px solid #f0f0f0' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '1rem', py: 2.5, borderBottom: '1px solid #f0f0f0' }}>Creation Date</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '1rem', py: 2.5, borderBottom: '1px solid #f0f0f0' }}>Booking Date & Time</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '1rem', py: 2.5, borderBottom: '1px solid #f0f0f0' }}>Remedy Info</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow
                          key={booking.id}
                          hover
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
                                if (booking.staff?.id) {
                                  navigate(`/consultant-details/${booking.staff.id}`);
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
                              {booking.staff?.name || 'Unassigned'}
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
                          <TableCell sx={{ fontSize: '1rem', py: 2.5, borderBottom: '1px solid #f0f0f0' }}>
                            {remedyDataMap.has(booking.id) ? (
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<PictureAsPdf />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  generateAndDownloadRemedyPDF(booking);
                                }}
                                sx={{
                                  textTransform: 'none',
                                  borderColor: '#dc2626',
                                  color: '#dc2626',
                                  '&:hover': {
                                    borderColor: '#b91c1c',
                                    backgroundColor: '#fef2f2'
                                  }
                                }}
                              >
                                Download PDF
                              </Button>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                N/A
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerProfile;
