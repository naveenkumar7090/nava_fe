import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Paper,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  Download,
  PictureAsPdf,
  Assessment,
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import { useBookings } from './Dashboard';
import axios from 'axios';

interface CustomerData {
  name: string;
  sunSign: string;
  moonSign: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
}

interface RemedyData {
  problems: string;
  diagnosis: string;
  suggestions: string;
  products: string;
  reminders: string;
}

const CustomerProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { bookings } = useBookings();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  
  // Customer data state
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: 'Loading...',
    sunSign: 'Not specified',
    moonSign: 'Not specified',
    dateOfBirth: 'Not specified',
    timeOfBirth: 'Not specified',
    placeOfBirth: 'Not specified',
  });

  // Remedy form data state
  const [remedyData, setRemedyData] = useState<RemedyData>({
    problems: '',
    diagnosis: '',
    suggestions: '',
    products: '',
    reminders: '',
  });

  const [previousPDFs, setPreviousPDFs] = useState<Array<{ id?: number; name: string; date: string; file_url?: string }>>([]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'Not specified') return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    } catch {
      return dateString;
    }
  };

  // Helper function to format time
  const formatTime = (timeString: string) => {
    if (!timeString || timeString === 'Not specified') return 'Not specified';
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return timeString;
    }
  };

  // Helper function to get sign name
  const getSignName = (sign: any) => {
    if (!sign) return 'Not specified';
    if (typeof sign === 'string') return sign;
    if (sign && typeof sign === 'object' && sign.name) return sign.name;
    return 'Not specified';
  };

  // Fetch customer data from booking details
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!userId) {
        setError('User ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const userIdNumber = parseInt(userId, 10);
        
        if (isNaN(userIdNumber)) {
          setError('Invalid user ID');
          setLoading(false);
          return;
        }

        console.log('🔍 Fetching customer data for user ID:', userIdNumber);

        // Get all booking_ids from context
        const allBookingIds = bookings
          .map((b: any) => b.booking_id)
          .filter((id: any) => id);

        if (allBookingIds.length === 0) {
          console.warn('⚠️ No bookings found in context');
          setLoading(false);
          return;
        }

        // Fetch booking details to get profile or customer_details data
        const detailsResponse = await axios.post('/bookings/details', {
          booking_ids: allBookingIds
        });

        if (detailsResponse.data?.data?.bookings && Array.isArray(detailsResponse.data.data.bookings)) {
          // Find bookings for this user
          const userBookings = detailsResponse.data.data.bookings.filter((booking: any) => {
            const bookingUserId = booking.user_id || 
                                 (booking.user && booking.user.id) ||
                                 null;
            return bookingUserId === userIdNumber;
          });

          console.log('📊 Found', userBookings.length, 'bookings for user');

          if (userBookings.length > 0) {
            // Get the first booking with data (prefer profile, fallback to customer_details)
            const bookingWithData = userBookings.find((b: any) => 
              (b.profile && b.profile.name) || 
              (b.customer_details && typeof b.customer_details === 'object' && b.customer_details.name)
            ) || userBookings[0];

            // Priority: profile > customer_details
            let profileData = null;
            let customerDetailsData = null;

            if (bookingWithData.profile && bookingWithData.profile.name) {
              profileData = bookingWithData.profile;
              console.log('✅ Using profile data:', profileData);
            }

            if (bookingWithData.customer_details) {
              if (typeof bookingWithData.customer_details === 'string') {
                try {
                  customerDetailsData = JSON.parse(bookingWithData.customer_details);
                } catch {
                  customerDetailsData = null;
                }
              } else {
                customerDetailsData = bookingWithData.customer_details;
              }
              console.log('📋 Customer details data:', customerDetailsData);
            }

            // Use profile data if available, otherwise use customer_details
            const dataSource = profileData || customerDetailsData;

            if (dataSource) {
              setCustomerData({
                name: dataSource.name || 'Not specified',
                sunSign: getSignName(dataSource.sunSign || dataSource.sun_sign),
                moonSign: getSignName(dataSource.moonSign || dataSource.moon_sign),
                dateOfBirth: formatDate(dataSource.date_of_birth || dataSource.dateOfBirth || dataSource.dob),
                timeOfBirth: formatTime(dataSource.time_of_birth || dataSource.timeOfBirth || dataSource.tob),
                placeOfBirth: dataSource.place_of_birth || dataSource.placeOfBirth || 'Not specified',
              });
            } else {
              console.warn('⚠️ No profile or customer_details data found');
              setError('No customer data found');
            }
          } else {
            console.warn('⚠️ No bookings found for user ID:', userIdNumber);
            setError('No bookings found for this user');
          }
        }
      } catch (err) {
        console.error('❌ Error fetching customer data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch customer data');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [userId, bookings]);

  // Fetch existing remedy PDFs (all remedies for this customer)
  useEffect(() => {
    const fetchRemedyPDFs = async () => {
      if (!userId) return;

      try {
        const userIdNumber = parseInt(userId, 10);
        if (isNaN(userIdNumber)) return;

        console.log('📄 Fetching existing remedy PDFs for user:', userIdNumber);
        const response = await axios.get(`/remedies/${userIdNumber}`);

        if (response.data?.status === 'success' && response.data?.data?.remedies) {
          const remedies = response.data.data.remedies;
          
          // Map all remedies with files to the PDF list
          const pdfs = remedies
            .filter((remedy: any) => remedy.file_name) // Only include remedies with files
            .map((remedy: any) => ({
              id: remedy.id,
              name: remedy.file_name,
              date: remedy.updated_at || remedy.created_at || new Date().toISOString(),
              file_url: remedy.file_url || `/remedies/file/${remedy.id}`
            }));
          
          console.log('✅ Found', pdfs.length, 'remedy PDFs');
          setPreviousPDFs(pdfs);
        } else {
          setPreviousPDFs([]);
        }
      } catch (error) {
        console.error('❌ Error fetching remedy PDFs:', error);
        // Don't show error if remedy doesn't exist (404 is expected for new customers)
        if (axios.isAxiosError(error) && error.response?.status !== 404) {
          console.warn('⚠️ Could not fetch remedy PDFs');
        }
        setPreviousPDFs([]);
      }
    };

    fetchRemedyPDFs();
  }, [userId]);

  const handleInputChange = (field: keyof RemedyData, value: string) => {
    setRemedyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGeneratePDF = async () => {
    // Validate that at least one field has content
    const hasContent = remedyData.problems || remedyData.diagnosis || remedyData.suggestions || remedyData.products || remedyData.reminders;
    
    if (!hasContent) {
      alert('Please fill in at least one field before generating the PDF.');
      return;
    }

    if (!userId) {
      alert('User ID is required to save remedy.');
      return;
    }
    
    setPdfGenerating(true);
    
    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      // Set font and title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Remedy Report', 20, 30);
      
      // Customer Information Section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Customer Information', 20, 50);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      let yPosition = 65;
      
      doc.text(`Name: ${customerData.name}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Sun Sign: ${customerData.sunSign}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Moon Sign: ${customerData.moonSign}`, 20, yPosition);
      yPosition += 10;
      const dobText = customerData.dateOfBirth === 'Not specified' 
        ? 'Not specified' 
        : new Date(customerData.dateOfBirth).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).replace(/\//g, '-');
      doc.text(`Date of Birth: ${dobText}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Time of Birth: ${customerData.timeOfBirth}`, 20, yPosition);
      yPosition += 10;
      doc.text(`Place of Birth: ${customerData.placeOfBirth}`, 20, yPosition);
      yPosition += 20;
      
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
      }
      
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
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
      
      // Generate PDF as blob
      const pdfBlob = doc.output('blob');
      const fileName = `remedy_${customerData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Create FormData to send to API
      const formData = new FormData();
      formData.append('customer_id', userId!);
      formData.append('problems', remedyData.problems || '');
      formData.append('diagnosis', remedyData.diagnosis || '');
      formData.append('suggestions', remedyData.suggestions || '');
      formData.append('products', remedyData.products || '');
      formData.append('reminders', remedyData.reminders || '');
      formData.append('file', pdfBlob, fileName);
      
      // Save to API
      console.log('💾 Saving remedy data and file to API...');
      const response = await axios.post('/remedies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.status === 'success') {
        // Download the PDF locally as well
        doc.save(fileName);
        
        // Refresh the previous PDFs list
        const userIdNumber = parseInt(userId!, 10);
        try {
          const remedyResponse = await axios.get(`/remedies/${userIdNumber}`);
          if (remedyResponse.data?.status === 'success' && remedyResponse.data?.data?.remedies) {
            const remedies = remedyResponse.data.data.remedies;
            const pdfs = remedies
              .filter((remedy: any) => remedy.file_name)
              .map((remedy: any) => ({
                id: remedy.id,
                name: remedy.file_name,
                date: remedy.updated_at || remedy.created_at || new Date().toISOString(),
                file_url: remedy.file_url || `/remedies/file/${remedy.id}`
              }));
            setPreviousPDFs(pdfs);
          }
        } catch (refreshError) {
          console.warn('⚠️ Could not refresh PDF list:', refreshError);
        }
        
        // Show success message
        alert('Remedy saved successfully and PDF downloaded!');
        console.log('✅ Remedy saved:', response.data);
      } else {
        throw new Error(response.data.message || 'Failed to save remedy');
      }
      
    } catch (error) {
      console.error('❌ Error generating/saving PDF:', error);
      if (axios.isAxiosError(error)) {
        alert(`Error: ${error.response?.data?.message || error.message}`);
      } else {
        alert('Error generating PDF. Please try again.');
      }
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleDownloadKundli = () => {
    // In a real app, this would download the Kundli
    console.log('Downloading Kundli for:', customerData.name);
    alert('Kundli download started!');
  };

  const handleDownloadPDF = async (pdfName: string, fileUrl?: string, remedyId?: number) => {
    if (!userId) {
      alert('User ID is required to download PDF');
      return;
    }

    try {
      console.log('📥 Downloading PDF:', pdfName, 'from URL:', fileUrl);
      
      // Use the file URL if available, otherwise construct it using remedy ID
      let downloadUrl = fileUrl;
      if (!downloadUrl && remedyId) {
        downloadUrl = `/remedies/file/${remedyId}`;
      } else if (!downloadUrl) {
        const userIdNumber = parseInt(userId, 10);
        if (isNaN(userIdNumber)) {
          alert('Invalid user ID');
          return;
        }
        downloadUrl = `/remedies/${userIdNumber}/file`;
      }
      
      // Create a temporary link and trigger download
      const response = await axios.get(downloadUrl, {
        responseType: 'blob',
      });

      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('✅ PDF downloaded successfully');
    } catch (error) {
      console.error('❌ Error downloading PDF:', error);
      if (axios.isAxiosError(error)) {
        alert(`Error downloading PDF: ${error.response?.data?.message || error.message}`);
      } else {
        alert('Error downloading PDF. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate(-1)}
          sx={{ mr: 2, color: '#6b7280' }}
        >
          <ArrowBack />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Assessment sx={{ fontSize: 32, color: '#3b82f6' }} />
          <Box>
            <Typography variant="h4" fontWeight="bold" color="#1f2937">
              Customer Profile - {customerData.name}
            </Typography>
            <Typography variant="body2" color="#6b7280" sx={{ mt: 0.5 }}>
              Back to Consultations
            </Typography>
          </Box>
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <Button
            variant="outlined"
            startIcon={<Assessment />}
            sx={{
              borderColor: '#d97706',
              color: '#d97706',
              '&:hover': {
                borderColor: '#b45309',
                backgroundColor: '#fef3c7',
              },
            }}
          >
            Reports
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Personal Information */}
        <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 3, color: '#1f2937' }}>
              Personal Information
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="500" color="#374151" sx={{ mb: 0.5 }}>
                      Name
                    </Typography>
                    <Typography variant="body1" color="#1f2937">
                      {customerData.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="500" color="#374151" sx={{ mb: 0.5 }}>
                      Moon Sign
                    </Typography>
                    <Typography variant="body1" color="#1f2937">
                      {customerData.moonSign}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="500" color="#374151" sx={{ mb: 0.5 }}>
                      Time of Birth
                    </Typography>
                    <Typography variant="body1" color="#1f2937">
                      {customerData.timeOfBirth}
                    </Typography>
                  </Box>
                </Box>
                
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="500" color="#374151" sx={{ mb: 0.5 }}>
                      Sun Sign
                    </Typography>
                    <Typography variant="body1" color="#1f2937">
                      {customerData.sunSign}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="500" color="#374151" sx={{ mb: 0.5 }}>
                      Date of Birth
                    </Typography>
                    <Typography variant="body1" color="#1f2937">
                      {new Date(customerData.dateOfBirth).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      }).replace(/\//g, '-')}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="500" color="#374151" sx={{ mb: 0.5 }}>
                      Place of Birth
                    </Typography>
                    <Typography variant="body1" color="#1f2937">
                      {customerData.placeOfBirth}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

        {/* Remedy PDF Generator */}
        <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 3, color: '#1f2937' }}>
                Remedy PDF Generator
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                <Box>
                  <TextField
                    fullWidth
                    label="Problems"
                    placeholder="Describe the problems..."
                    multiline
                    rows={4}
                    value={remedyData.problems}
                    onChange={(e) => handleInputChange('problems', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Diagnosis"
                    placeholder="Enter diagnosis..."
                    multiline
                    rows={4}
                    value={remedyData.diagnosis}
                    onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Suggestions"
                    placeholder="Enter suggestions..."
                    multiline
                    rows={4}
                    value={remedyData.suggestions}
                    onChange={(e) => handleInputChange('suggestions', e.target.value)}
                  />
                </Box>
                
                <Box>
                  <TextField
                    fullWidth
                    label="Products"
                    placeholder="Recommended products..."
                    multiline
                    rows={4}
                    value={remedyData.products}
                    onChange={(e) => handleInputChange('products', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Reminders"
                    placeholder="Enter reminders..."
                    multiline
                    rows={8}
                    value={remedyData.reminders}
                    onChange={(e) => handleInputChange('reminders', e.target.value)}
                  />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={pdfGenerating ? <CircularProgress size={20} color="inherit" /> : <PictureAsPdf />}
                  onClick={handleGeneratePDF}
                  disabled={pdfGenerating}
                  sx={{
                    backgroundColor: '#d97706',
                    '&:hover': {
                      backgroundColor: '#b45309',
                    },
                    '&:disabled': {
                      backgroundColor: '#9ca3af',
                    },
                    px: 3,
                    py: 1,
                  }}
                >
                  {pdfGenerating ? 'Generating PDF...' : 'Generate & Upload PDF'}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleDownloadKundli}
                  sx={{
                    borderColor: '#6b7280',
                    color: '#6b7280',
                    '&:hover': {
                      borderColor: '#374151',
                      backgroundColor: '#f9fafb',
                    },
                    px: 3,
                    py: 1,
                  }}
                >
                  Download Kundli
                </Button>
              </Box>
            </CardContent>
          </Card>

        {/* Previous Remedy PDFs */}
        <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 3, color: '#1f2937' }}>
                Previous Remedy PDFs
              </Typography>
              
              {previousPDFs.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No previous remedy PDFs found
                </Typography>
              ) : (
                previousPDFs.map((pdf, index) => (
                <Box key={pdf.id || index}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    py: 2,
                  }}>
                    <Box>
                      <Typography variant="body1" fontWeight="500" color="#1f2937">
                        {pdf.name}
                      </Typography>
                      <Typography variant="body2" color="#6b7280">
                        Generated on {(() => {
                          try {
                            const date = new Date(pdf.date);
                            if (isNaN(date.getTime())) return pdf.date;
                            return date.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            });
                          } catch {
                            return pdf.date;
                          }
                        })()}
                      </Typography>
                    </Box>
                    
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={() => handleDownloadPDF(pdf.name, pdf.file_url, pdf.id)}
                      size="small"
                      sx={{
                        borderColor: '#6b7280',
                        color: '#6b7280',
                        '&:hover': {
                          borderColor: '#374151',
                          backgroundColor: '#f9fafb',
                        },
                      }}
                    >
                      Download
                    </Button>
                  </Box>
                  {index < previousPDFs.length - 1 && <Divider />}
                </Box>
                ))
              )}
            </CardContent>
          </Card>
      </Box>
    </Box>
  );
};

export default CustomerProfile;
