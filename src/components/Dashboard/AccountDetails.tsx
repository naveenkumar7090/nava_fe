import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
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
} from '@mui/icons-material';
import { useBookings } from './Dashboard';
import { fetchUserProfiles, fetchAccountUserById, AccountUser, UserProfile } from '../../services/apiService';
import axios from 'axios';

interface AccountDetailsProps {}

const AccountDetails: React.FC<AccountDetailsProps> = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { bookings } = useBookings();

  // State for API data
  const [accountUser, setAccountUser] = useState<AccountUser | null>(null);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [userLocations, setUserLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBackClick = () => {
    navigate('/consultations');
  };

  const handleDownloadKundli = () => {
    // Implement download functionality
    console.log('Download KUNDLI');
  };

  // Fetch account data from API using user_id
  useEffect(() => {
    const fetchAccountData = async () => {
      if (!userId) {
        setError('User ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Parse user_id from route parameter
        const userIdNumber = parseInt(userId, 10);
        
        if (isNaN(userIdNumber)) {
          setError('Invalid user ID');
          setLoading(false);
          return;
        }

        // Fetch account user data by ID from external API
        console.log('🔍 Fetching account user data for user ID:', userIdNumber);
        const user = await fetchAccountUserById(userIdNumber);
        
        if (user) {
          setAccountUser(user);
          
          // Fetch associated profiles if user ID is available
          console.log('👥 Fetching user profiles for user ID:', user.id);
          const profiles = await fetchUserProfiles(user.id);
          setUserProfiles(profiles);
        } else {
          console.warn('⚠️ No user found with ID:', userIdNumber);
          setError(`No account found with user ID: ${userIdNumber}`);
        }

        // Extract locations from booking details
        // Since bookings from context don't have user_id, we need to fetch details for all bookings
        // then filter by user_id from the details response
        try {
          console.log('🔍 All bookings in context:', bookings.length);
          console.log('🔍 Looking for user ID:', userIdNumber);
          
          // Extract all booking_ids from context
          const allBookingIds = bookings
            .map((b: any) => b.booking_id)
            .filter((id: any) => id);

          console.log('📋 Total booking IDs to fetch:', allBookingIds.length);

          if (allBookingIds.length > 0) {
            console.log('📍 Fetching booking details for all bookings to find locations for user:', userIdNumber);
            
            // Fetch booking details for all bookings - this response includes location data and user_id
            const detailsResponse = await axios.post('/bookings/details', {
              booking_ids: allBookingIds
            });

            console.log('📦 Booking details response received');

            // Filter bookings by user_id from the details response, then extract locations
            if (detailsResponse.data?.data?.bookings && Array.isArray(detailsResponse.data.data.bookings)) {
              console.log('📦 Processing', detailsResponse.data.data.bookings.length, 'booking details');
              
              // Filter bookings for this user
              const userBookings = detailsResponse.data.data.bookings.filter((booking: any) => {
                const bookingUserId = booking.user_id || 
                                     (booking.user && booking.user.id) ||
                                     null;
                const matches = bookingUserId === userIdNumber;
                if (matches) {
                  console.log('✅ Found matching booking:', booking.booking_id, 'user_id:', bookingUserId);
                }
                return matches;
              });

              console.log('📊 Found', userBookings.length, 'bookings for user ID:', userIdNumber);
              
              // Extract unique locations from user's bookings
              const locationsMap = new Map();
              
              userBookings.forEach((booking: any, index: number) => {
                console.log(`📦 User Booking ${index + 1}:`, {
                  booking_id: booking.booking_id,
                  user_id: booking.user_id,
                  has_location: !!booking.location,
                  location: booking.location
                });
                
                // Check for location object (from location table)
                if (booking.location && booking.location.name) {
                  const locationId = booking.location.id || booking.location.name;
                  
                  console.log('✅ Found location:', booking.location.name, 'ID:', locationId);
                  
                  // Only add if not already in map (to avoid duplicates)
                  if (!locationsMap.has(locationId)) {
                    locationsMap.set(locationId, {
                      id: booking.location.id,
                      name: booking.location.name,
                      short_name: booking.location.short_name,
                      image: booking.location.image,
                      data: booking.location.data
                    });
                  }
                } else {
                  console.log('⚠️ Booking', booking.booking_id, 'has no location or location.name');
                }
              });

              const uniqueLocations = Array.from(locationsMap.values());
              console.log('✅ Extracted', uniqueLocations.length, 'unique locations:', uniqueLocations);
              setUserLocations(uniqueLocations);
            } else {
              console.warn('⚠️ Unexpected booking details response structure:', detailsResponse.data);
              setUserLocations([]);
            }
          } else {
            console.warn('⚠️ No booking_ids found in context');
            setUserLocations([]);
          }
        } catch (locationError) {
          console.error('❌ Error extracting locations from booking details:', locationError);
          if (axios.isAxiosError(locationError)) {
            console.error('📄 Error response:', locationError.response?.data);
          }
          setUserLocations([]);
        }
      } catch (err) {
        console.error('❌ Error fetching account data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch account data');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [userId]);

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
    if (accountUser) {
      return {
        name: accountUser.name,
        initials: getUserInitials(accountUser.name),
        accountName: accountUser.name,
        placeOfBirth: accountUser.placeOfBirth || 'Not specified',
        dob: accountUser.dateOfBirth ? formatDate(accountUser.dateOfBirth) : (accountUser.dob || 'Not specified'),
        tob: accountUser.timeOfBirth ? formatTime(accountUser.timeOfBirth) : (accountUser.tob || 'Not specified'),
        sunSign: getSignName(accountUser.sunSign),
        moonSign: getSignName(accountUser.moonSign),
        email: accountUser.email || 'Not specified',
        phone: accountUser.mobile || accountUser.phone || 'Not specified',
        address: accountUser.address || 'Not specified',
        gender: accountUser.gender || 'Not specified',
        associatedProfiles: userProfiles.map(profile => ({
          id: profile.id,
          name: profile.name,
          relation: profile.relation || 'Unknown',
          email: profile.email || 'Not specified',
          mobile: profile.mobile || 'Not specified',
          dateOfBirth: profile.dateOfBirth ? formatDate(profile.dateOfBirth) : 'Not specified',
          gender: profile.gender || 'Not specified',
          placeOfBirth: profile.placeOfBirth || 'Not specified'
        })),
        // Use location data - show location names from location table
        vastuStates: userLocations.length > 0
          ? userLocations
              .filter((loc: any) => loc.name) // Only show if location name exists
              .map((loc: any) => ({
                name: loc.name, // Use location.name from location table
                short_name: loc.short_name || loc.name,
                id: loc.id,
                image: loc.image,
                data: loc.data
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
          { name: 'map1.jpg', type: 'image' },
          { name: 'map2.jpg', type: 'image' },
          { name: 'floor-plan.pdf', type: 'pdf' }
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
      legacyMaps: []
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
        <Typography variant="h6" sx={{ color: '#2563eb', ml: 2 }}>
          {accountData.name}
        </Typography>
        {/* Show API data indicator */}
        {accountUser && (
          <Chip 
            label="Live Data" 
            size="small" 
            color="success" 
            sx={{ ml: 2 }}
          />
        )}
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
                    Account Name
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {accountData.accountName}
                  </Typography>
                </Box>
                
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

          {/* Associated Profiles */}
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
                          <Chip 
                            label={profile.relation}
                            size="small"
                            sx={{
                              backgroundColor: '#dbeafe',
                              color: '#1e40af',
                              fontWeight: 500
                            }}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 0 }}>
                        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Email
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {profile.email}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Mobile
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {profile.mobile}
                            </Typography>
                          </Box>
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
        </Box>

        {/* Right Column */}
        <Box sx={{ flex: 1 }}>
          {/* Activity Section */}
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2, color: '#1f2937' }}>
                Activity
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {accountData.activity.map((activity, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        mt: 1,
                        flexShrink: 0
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" fontWeight="500" sx={{ mb: 0.5 }}>
                        {activity.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activity.date}
                        {activity.by && (
                          <>
                            {' by '}
                            <Typography component="span" sx={{ color: '#2563eb', fontWeight: 500 }}>
                              {activity.by}
                            </Typography>
                          </>
                        )}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              
              <Button 
                sx={{ 
                  mt: 2, 
                  color: '#2563eb',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Show less
              </Button>
            </CardContent>
          </Card>

          {/* Vastu States */}
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
                            {location.short_name && (
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Short Name:</Typography>
                                <Typography variant="body2" fontWeight="500">{location.short_name}</Typography>
                              </Box>
                            )}
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

          {/* Legacy Vastu Maps */}
          <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Business sx={{ color: '#1f2937' }} />
                <Typography variant="h6" fontWeight="600" sx={{ color: '#1f2937' }}>
                  Legacy Vastu Maps
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                gap: 2 
              }}>
                {accountData.legacyMaps.map((map, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: '1px solid #e5e7eb',
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: '#f8f9fa'
                      }
                    }}
                  >
                    <Description sx={{ fontSize: 40, color: '#6b7280', mb: 1 }} />
                    <Typography variant="body2" fontWeight="500">
                      {map.name}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountDetails;
