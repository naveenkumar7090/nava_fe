import React, { useState, useRef, useEffect, useMemo, JSX } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BackendApiClient } from '../../../backend_api_client/backend_api_client';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  Download,
  ExpandMore,
  Description,
  Home,
  Business,
  Upload,
  PictureAsPdf,
} from '@mui/icons-material';
import { useAccountDetailsViewModel } from './useAccountDetailsViewModel';

interface AccountDetailsProps { }

/**
 * Account Details Page
 * Displays detailed information about a user account including profiles, bookings, and vastu locations.
 */
const AccountDetails: React.FC<AccountDetailsProps> = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // Parse user ID
  const userIdNumber = userId ? parseInt(userId, 10) : null;

  // Use View Model
  const {
    account,
    profiles,
    locations,
    loading,
    error,
  } = useAccountDetailsViewModel(userIdNumber);

  // State for uploaded maps
  const [uploadedMaps, setUploadedMaps] = useState<Array<{ 
    id?: number;
    name: string; 
    type: string; 
    file?: File;
    downloadUrl?: string;
    createdAt?: string;
  }>>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const apiClient = useMemo(() => new BackendApiClient(), []);

  const handleBackClick = () => {
    navigate('/consultations');
  };

  const handleDownloadKundli = () => {
    // Implement download functionality
    console.log('Download KUNDLI');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Filter PDF files
    const pdfFiles = Array.from(files).filter(file => {
      const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      if (!isPDF) {
        alert(`${file.name} is not a PDF file. Only PDF files are allowed.`);
        return false;
      }
      return true;
    });

    if (pdfFiles.length === 0) return;

    // Check if we have at least one location
    if (!locations || locations.length === 0) {
      alert('No locations found. Please create a location first.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Use the first location for upload (you can enhance this to let user select)
    const userLocationId = locations[0].id;
    setUploading(true);

    try {
      // Upload each file directly to database
      for (const file of pdfFiles) {
        try {
          const result = await apiClient.uploadMapPdf(userLocationId, file);
          
          // Add to local state
          setUploadedMaps(prev => [...prev, {
            id: result.id,
            name: result.fileName,
            type: 'pdf',
            downloadUrl: `/location/user/${userLocationId}/map/${result.id}`,
          }]);
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          alert(`Failed to upload ${file.name}. Please try again.`);
        }
      }

      // Refresh maps list
      await fetchMapsForLocations();
      alert(`${pdfFiles.length} PDF file(s) uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Fetch maps for all locations
  const fetchMapsForLocations = async () => {
    if (!locations || locations.length === 0) {
      console.log('No locations available, skipping map fetch');
      setUploadedMaps([]);
      return;
    }

    console.log('Fetching maps for locations:', locations.map(l => ({ id: l.id, name: l.locationName })));

    try {
      const allMaps: Array<{ 
        id?: number;
        name: string; 
        type: string; 
        fileUrl?: string;
        createdAt?: string;
      }> = [];

      // Fetch maps for each location
      for (const location of locations) {
        try {
          console.log(`Fetching maps for location ${location.id}...`);
          const maps = await apiClient.getMapPdfs(location.id);
          console.log(`Found ${maps.length} maps for location ${location.id}`);
          allMaps.push(...maps.map(map => ({
            id: map.id,
            name: map.fileName,
            type: 'pdf',
            downloadUrl: map.downloadUrl,
            createdAt: map.createdAt,
          })));
        } catch (error) {
          console.error(`Failed to fetch maps for location ${location.id}:`, error);
        }
      }

      console.log(`Total maps fetched: ${allMaps.length}`);
      setUploadedMaps(allMaps);
    } catch (error) {
      console.error('Failed to fetch maps:', error);
      setUploadedMaps([]);
    }
  };

  // Fetch maps when locations are loaded
  useEffect(() => {
    console.log('🔍 Locations effect triggered:', {
      locationsLength: locations?.length || 0,
      locations: locations,
      loading: loading
    });
    
    if (!loading && locations && locations.length > 0) {
      console.log('✅ Fetching maps for', locations.length, 'locations');
      fetchMapsForLocations();
    } else if (!loading) {
      console.log('⚠️ No locations available or still loading');
      // Clear maps if no locations
      setUploadedMaps([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations, loading]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleMapClick = async (map: { id?: number; name: string; type: string; file?: File; downloadUrl?: string }) => {
    if (map.file) {
      // Create a blob URL and download the file
      const url = URL.createObjectURL(map.file);
      const link = document.createElement('a');
      link.href = url;
      link.download = map.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (map.downloadUrl && map.id && locations && locations.length > 0) {
      // For existing maps, download from API
      try {
        await apiClient.downloadMapPdf(locations[0].id, map.id, map.name);
      } catch (error) {
        console.error('Failed to download map:', error);
        alert('Failed to download map. Please try again.');
      }
    } else {
      console.log('Opening map:', map.name);
    }
  };

  // Helper function to get user initials
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    } catch {
      return dateString;
    }
  };

  // Helper function to format time
  const formatTime = (timeString: string) => {
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
    if (typeof sign === 'string') return sign;
    if (sign && typeof sign === 'object' && sign.name) return sign.name;
    return 'Not specified';
  };

  // Fallback data structure for when API data is not available
  const getAccountData = () => {
    if (account) {
      return {
        name: account.name,
        initials: getUserInitials(account.name),
        accountName: account.name,
        placeOfBirth: account.placeOfBirth || 'Not specified',
        dob: account.dateOfBirth ? formatDate(account.dateOfBirth) : 'Not specified',
        tob: account.timeOfBirth ? formatTime(account.timeOfBirth) : 'Not specified',
        sunSign: getSignName(account.sunSign),
        moonSign: getSignName(account.moonSign),
        email: account.email || 'Not specified',
        phone: account.mobile || 'Not specified',
        address: 'Not specified', // Address not available in new API model
        gender: account.gender || 'Not specified',
        associatedProfiles: profiles.map(profile => ({
          id: profile.id,
          name: profile.name,
          isDefault: profile.isDefault,
          relation: profile.isDefault ? 'Default' : '',
          dateOfBirth: profile.dateOfBirth ? formatDate(profile.dateOfBirth) : 'Not specified',
          gender: profile.gender || 'Not specified',
          sunSign: getSignName(profile.sunSign),
          moonSign: getSignName(profile.moonSign),
          placeOfBirth: profile.placeOfBirth || 'Not specified'
        })),
        // Use location data - show location names from API
        vastuStates: locations.length > 0
          ? locations.map((loc: any) => ({
            name: loc.locationName || loc.name, // Handle both structures
            buildingType: loc.location?.name || 'Not specified', // Use location name as Building Type
            floorCount: loc.floorCount !== undefined ? loc.floorCount : 'N/A',
            id: loc.id,
            image: undefined,
            data: undefined
          }))
          : [],
        activity: [
          {
            type: 'payment',
            description: 'Paid ₹50 for Vastu Consultation',
            date: 'Mar 19, 2024, 6:19 PM',
            by: 'Peerana Jain'
          },
          {
            type: 'booking',
            description: 'Booking created for 15th Sep 2025',
            date: 'Mar 19, 2024, 6:19 PM'
          }
        ],
        legacyMaps: [
          ...(uploadedMaps.length > 0 ? uploadedMaps : [
            { name: 'map1.jpg', type: 'image' },
            { name: 'map2.jpg', type: 'image' },
            { name: 'floor-plan.pdf', type: 'pdf' }
          ])
        ]
      };
    }

    // Fallback to original mock data if no API data
    return {
      name: 'Unknown Account',
      initials: getUserInitials('UA'),
      accountName: 'Unknown Account',
      placeOfBirth: 'Not specified',
      dob: 'Not specified',
      tob: 'Not specified',
      sunSign: 'Not specified',
      moonSign: 'Not specified',
      email: 'Not specified',
      phone: 'Not specified',
      address: 'Not specified',
      gender: 'Not specified',
      associatedProfiles: [],
      vastuStates: [],
      activity: [],
      legacyMaps: uploadedMaps
    };
  };

  const accountData = getAccountData();

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBackClick}
            sx={{
              mr: 2,
              color: '#6b7280',
              '&:hover': {
                backgroundColor: '#f3f4f6'
              }
            }}
          >
            Back to Consultations
          </Button>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#1f2937' }}>
            Account Details
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Loading account information...
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBackClick}
            sx={{
              mr: 2,
              color: '#6b7280',
              '&:hover': {
                backgroundColor: '#f3f4f6'
              }
            }}
          >
            Back to Consultations
          </Button>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#1f2937' }}>
            Account Details
          </Typography>
        </Box>
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const renderUserLocationsArea = (): JSX.Element => {
    return (
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Home sx={{ color: '#1f2937' }} />
            <Typography variant="h6" fontWeight="600" sx={{ color: '#1f2937' }}>
              Vastu States
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {accountData.vastuStates.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No locations found for this user
              </Typography>
            ) : (
              accountData.vastuStates.map((location: any, index: number) => (
                <Accordion
                  key={index}
                  sx={{
                    boxShadow: 'none',
                    border: '1px solid #e5e7eb',
                    '&:before': { display: 'none' },
                    borderRadius: '8px !important'
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      minHeight: 48,
                      '& .MuiAccordionSummary-content': {
                        margin: '8px 0'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      <Description sx={{ fontSize: 20, color: '#6b7280' }} />
                      <Typography variant="body1" fontWeight="500">
                        {typeof location === 'string' ? location : location.name}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    {typeof location === 'object' && location.name ? (
                      <Box sx={{ display: 'grid', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Location Name:</Typography>
                          <Typography variant="body2" fontWeight="500">{location.name}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Building Type:</Typography>
                          <Typography variant="body2" fontWeight="500" sx={{ textTransform: 'capitalize' }}>{location.buildingType}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">No. of Floors:</Typography>
                          <Typography variant="body2" fontWeight="500">{location.floorCount}</Typography>
                        </Box>

                        {location.data && location.data.space && Array.isArray(location.data.space) && (
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Spaces:</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {location.data.space.map((space: any, idx: number) => (
                                <Chip
                                  key={idx}
                                  label={space.name}
                                  size="small"
                                  sx={{
                                    backgroundColor: '#f3f4f6',
                                    color: '#374151',
                                    fontWeight: 500
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        )}

                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => navigate(`/user-location/${location.id}`)}
                          >
                            View Details
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {typeof location === 'string' ? `Details for ${location} would be displayed here.` : 'No location details available.'}
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderUserProfilesArea = (): JSX.Element => {
    return (
      <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="600" sx={{ mb: 2, color: '#1f2937' }}>
            Associated Profiles ({accountData.associatedProfiles.length})
          </Typography>

          {accountData.associatedProfiles.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              No associated profiles found
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {accountData.associatedProfiles.map((profile, index) => (
                <Accordion
                  key={profile.id || index}
                  sx={{
                    boxShadow: 'none',
                    border: '1px solid #e5e7eb',
                    '&:before': { display: 'none' },
                    borderRadius: '8px !important'
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      minHeight: 48,
                      '& .MuiAccordionSummary-content': {
                        margin: '8px 0',
                        alignItems: 'center'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: '0.875rem',
                          fontWeight: 'bold',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white'
                        }}
                      >
                        {profile.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" fontWeight="500">
                          {profile.name}
                        </Typography>
                      </Box>
                      {profile.relation && (
                        <Chip
                          label={profile.relation}
                          size="small"
                          sx={{
                            backgroundColor: profile.relation === 'Default' ? '#dcfce7' : '#dbeafe',
                            color: profile.relation === 'Default' ? '#166534' : '#1e40af',
                            fontWeight: 500
                          }}
                        />
                      )}
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Date of Birth
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {profile.dateOfBirth}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Gender
                        </Typography>
                        <Typography variant="body2" fontWeight="500" sx={{ textTransform: 'capitalize' }}>
                          {profile.gender}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Sun Sign
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {profile.sunSign}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Moon Sign
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {profile.moonSign}
                        </Typography>
                      </Box>
                      <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Place of Birth
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                          {profile.placeOfBirth}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header with Back Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackClick}
          sx={{
            mr: 2,
            color: '#6b7280',
            '&:hover': {
              backgroundColor: '#f3f4f6'
            }
          }}
        >
          Back to Consultations
        </Button>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#1f2937' }}>
          Account Details
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Left Column */}
        <Box sx={{ flex: 1 }}>
          {/* Profile Card */}
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                borderRadius: 2,
                p: 3,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                    color: 'white'
                  }}
                >
                  {accountData.initials}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
                    {accountData.name}
                  </Typography>
                  <Button
                    startIcon={<Download />}
                    onClick={handleDownloadKundli}
                    variant="contained"
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.3)'
                      }
                    }}
                  >
                    Download KUNDLI
                  </Button>
                </Box>
              </Box>

              {/* Summary Section */}
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2, color: '#1f2937' }}>
                Summary
              </Typography>

              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Place of Birth
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {accountData.placeOfBirth}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    DOB
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {accountData.dob}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    TOB
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {accountData.tob}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Sun Sign
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {accountData.sunSign}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Moon Sign
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {accountData.moonSign}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {accountData.email}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Phone
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {accountData.phone}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Address
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {accountData.address}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Gender
                  </Typography>
                  <Typography variant="body1" fontWeight="500" sx={{ textTransform: 'capitalize' }}>
                    {accountData.gender}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Right Column */}
        <Box sx={{ flex: 1 }}>
          {renderUserLocationsArea()}
          {renderUserProfilesArea()}
        </Box>
      </Box>
    </Box>
  );
};

export default AccountDetails;
