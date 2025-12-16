// import React, { useState, useMemo, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//   Box,
//   Paper,
//   Typography,
//   Card,
//   CardContent,
//   Chip,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   IconButton,
//   CircularProgress,
//   Alert,
//   Pagination,
//   Stack,
// } from '@mui/material';
// import {
//   CalendarToday,
//   CheckCircle,
//   Group,
//   TrendingUp,
//   Search,
// } from '@mui/icons-material';
// import { dummyConsultationData, ConsultationData } from '../../config/tableConfig';
// import StatusCell from './StatusCell';
// import { useBookings } from './Dashboard';

// // Transform booking data to consultation data format
// const transformBookingToConsultation = (booking: any, index: number): ConsultationData => {
//   // Map status from API to our format
//   const getStatus = (apiStatus: string) => {
//     switch (apiStatus.toLowerCase()) {
//       case 'completed':
//         return 'Completed';
//       case 'yet_to_mark':
//       case 'scheduled':
//         return 'Scheduled';
//       case 'in_progress':
//         return 'In Progress';
//       case 'cancelled':
//         return 'Cancelled';
//       default:
//         return 'Scheduled';
//     }
//   };

//   // Get consultation type from booking data
//   const getConsultationType = (): 'Vastu' | 'Astro' => {
//     // First, try to use consultation_type from booking data
//     if (booking.consultation_type) {
//       const consultationType = String(booking.consultation_type).toLowerCase();
//       if (consultationType.includes('vastu')) {
//         return 'Vastu';
//       } else if (consultationType.includes('astro') || consultationType.includes('astrology')) {
//         return 'Astro';
//       }
//     }
    
//     // Fallback: Determine service type based on service name
//     const serviceName = booking.service_name || '';
//     if (serviceName.toLowerCase().includes('vastu')) {
//       return 'Vastu';
//     } else if (serviceName.toLowerCase().includes('astro')) {
//       return 'Astro';
//     }
    
//     return 'Vastu'; // Default to Vastu
//   };

//   // Get account name from customer_details.name (from details API) or fallback to customer_name
//   const getAccountName = () => {
//     // First try customer_details.name from details API
//     if (booking.customer_details && typeof booking.customer_details === 'object') {
//       if (booking.customer_details.name) {
//         return booking.customer_details.name;
//       }
//     }
//     // Fallback to customer_name from booking API
//     return booking.customer_name || 'N/A';
//   };

//   // Get customer name - prefer profile name, then customer_details.name, then customer_name
//   const getCustomerName = () => {
//     // Try profile name first (from details API)
//     if (booking.profile && booking.profile.name) {
//       return booking.profile.name;
//     }
//     // Then try customer_details.name
//     if (booking.customer_details && typeof booking.customer_details === 'object') {
//       if (booking.customer_details.name) {
//         return booking.customer_details.name;
//       }
//     }
//     // Fallback to customer_name
//     return booking.customer_name || 'N/A';
//   };

//   return {
//     id: booking.booking_id || `booking-${index}`,
//     bookingId: booking.booking_id || `#BK-${index.toString().padStart(3, '0')}`,
//     accountName: getAccountName(), // Use customer_details.name from details API
//     customerName: getCustomerName(), // Use profile name or customer_details.name
//     consultant: booking.staff_name || 'N/A',
//     type: getConsultationType(),
//     status: getStatus(booking.status || 'scheduled'),
//     creationDate: booking.booked_on ? booking.booked_on.split(' ')[0] : new Date().toISOString().split('T')[0],
//     bookingDateTime: booking.customer_booking_start_time || booking.start_time || new Date().toISOString(),
//     orderValue: parseFloat(booking.cost || booking.cost_paid || '0'),
//     // Store user_id for navigation
//     userId: booking.user_id || null,
//   };
// };

// const ConsultationsTable: React.FC = () => {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [typeFilter, setTypeFilter] = useState('All Types');
//   const [statusFilter, setStatusFilter] = useState('All Status');
//   const [bookingDetails, setBookingDetails] = useState<Record<string, any>>({});
//   const [detailsLoading, setDetailsLoading] = useState(false);
  
//   // Get booking data from context
//   const { bookings, loading, error, currentPage, hasNextPage, totalPages, fetchBookings } = useBookings();
  
//   // Fetch booking details and merge with bookings
//   useEffect(() => {
//     const fetchAndMergeBookingDetails = async () => {
//       // Only proceed if we have bookings data and not loading
//       if (!bookings || bookings.length === 0 || loading) {
//         return;
//       }

//       try {
//         setDetailsLoading(true);
//         console.log('📦 Fetching booking details for', bookings.length, 'bookings');
        
//         // Extract booking_id (string) from bookings array
//         const bookingIds = bookings
//           .map((booking: any) => {
//             if (booking.booking_id && typeof booking.booking_id === 'string') {
//               return booking.booking_id;
//             }
//             return null;
//           })
//           .filter((id: any) => id !== null && id !== '');

//         if (bookingIds.length === 0) {
//           console.log('⚠️ No valid booking_ids found');
//           setDetailsLoading(false);
//           return;
//         }

//         console.log('📤 Calling POST /api/bookings/details with', bookingIds.length, 'booking IDs');

//         // Call the POST API endpoint with booking_ids
//         const response = await axios.post('/bookings/details', {
//           booking_ids: bookingIds
//         });

//         console.log('✅ Booking Details API Response received');
        
//         if (response.data?.data?.bookings && Array.isArray(response.data.data.bookings)) {
//           // Create a map of booking_id -> booking details for quick lookup
//           const detailsMap: Record<string, any> = {};
//           response.data.data.bookings.forEach((detail: any) => {
//             if (detail.booking_id) {
//               detailsMap[detail.booking_id] = detail;
//             }
//           });
          
//           console.log('📊 Mapped', Object.keys(detailsMap).length, 'booking details');
//           setBookingDetails(detailsMap);
//         }

//       } catch (error) {
//         console.error('❌ Error fetching booking details:', error);
//         if (axios.isAxiosError(error)) {
//           console.error('📄 Error details:', error.response?.data);
//         }
//       } finally {
//         setDetailsLoading(false);
//       }
//     };

//     // Call the API when bookings are loaded
//     fetchAndMergeBookingDetails();
//   }, [bookings, loading]);
  
//   // Transform booking data to consultation format, merging with details
//   // Show ALL bookings from bookings API, merge details if available
//   const consultationData = useMemo(() => {
//     if (!bookings || bookings.length === 0) {
//       return dummyConsultationData; // Fallback to dummy data if no real data
//     }
    
//     // Sort bookings by created_at (newest first)
//     const sortedBookings = [...bookings].sort((a: any, b: any) => {
//       const dateA = a.created_at || a.booked_on || '';
//       const dateB = b.created_at || b.booked_on || '';
//       // Convert to timestamps for comparison
//       const timestampA = dateA ? new Date(dateA).getTime() : 0;
//       const timestampB = dateB ? new Date(dateB).getTime() : 0;
//       // Sort descending (newest first)
//       return timestampB - timestampA;
//     });
    
//     return sortedBookings.map((booking, index) => {
//       // Merge booking with its details if available (don't filter if details missing)
//       const bookingId = booking.booking_id;
//       const details = bookingId ? bookingDetails[bookingId] : null;
//       // Merge details into booking, but keep original booking data
//       const mergedBooking = details ? { ...booking, ...details } : booking;
//       return transformBookingToConsultation(mergedBooking, index);
//     });
//   }, [bookings, bookingDetails]);


//   // Calculate statistics from real data
//   const totalBookings = consultationData.length;
//   const completedBookings = consultationData.filter(row => row.status === 'Completed').length;
//   const activeConsultants = new Set(consultationData.map(row => row.consultant)).size;
//   const totalRevenue = consultationData
//     .filter(row => row.status === 'Completed')
//     .reduce((sum, row) => sum + row.orderValue, 0);

//   const statsCards = [
//     {
//       title: 'Total Bookings',
//       value: totalBookings.toString(),
//       icon: <CalendarToday />,
//       bgColor: '#dbeafe',
//       iconColor: '#3b82f6',
//     },
//     {
//       title: 'Completed',
//       value: completedBookings.toString(),
//       icon: <CheckCircle />,
//       bgColor: '#dcfce7',
//       iconColor: '#22c55e',
//     },
//     {
//       title: 'Active Consultants',
//       value: activeConsultants.toString(),
//       icon: <Group />,
//       bgColor: '#dbeafe',
//       iconColor: '#3b82f6',
//     },
//     {
//       title: 'Total Revenue',
//       value: `₹${totalRevenue.toLocaleString()}`,
//       icon: <TrendingUp />,
//       bgColor: '#f3e8ff',
//       iconColor: '#a855f7',
//     },
//   ];

//   // Apply client-side filtering on current page data
//   const filteredData = useMemo(() => {
//     return consultationData.filter((row) => {
//       const matchesSearch = 
//         row.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         row.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         row.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         row.consultant.toLowerCase().includes(searchTerm.toLowerCase());
      
//       const matchesType = typeFilter === 'All Types' || row.type === typeFilter;
//       const matchesStatus = statusFilter === 'All Status' || row.status === statusFilter;
      
//       return matchesSearch && matchesType && matchesStatus;
//     });
//   }, [consultationData, searchTerm, typeFilter, statusFilter]);

//   // Show loading state
//   if (loading || detailsLoading) {
//     return (
//       <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
//         <CircularProgress />
//         <Typography sx={{ ml: 2 }}>
//           {loading ? 'Loading bookings...' : 'Loading booking details...'}
//         </Typography>
//       </Box>
//     );
//   }

//   // Show error state
//   if (error) {
//     return (
//       <Box sx={{ p: 3 }}>
//         <Alert severity="error" sx={{ mb: 3 }}>
//           {error}. Showing demo data instead.
//         </Alert>
//         {/* Continue with the rest of the component using dummy data */}
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Header */}
//       {/* <Box sx={{ mb: 3 }}>
//         <Typography variant="h4" fontWeight="bold" gutterBottom>
//           Consultations Management
//         </Typography>
//         <Typography variant="body1" color="text.secondary">
//           Manage and track all consultation bookings and appointments
//         </Typography>
//       </Box> */}

//       {/* Statistics Cards */}
//       <Box sx={{ 
//         display: 'grid', 
//         gridTemplateColumns: { 
//           xs: '1fr', 
//           sm: 'repeat(2, 1fr)', 
//           md: 'repeat(4, 1fr)' 
//         }, 
//         gap: 3, 
//         mb: 4 
//       }}>
//         {statsCards.map((card, index) => (
//           <Box 
//             key={index}
//             sx={{
//               backgroundColor: 'white',
//               borderRadius: '12px',
//               p: '20px',
//               border: '1px solid #e5e7eb',
//               boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
//               transition: 'all 0.2s ease-in-out',
//               '&:hover': {
//                 boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
//                 transform: 'translateY(-2px)'
//               }
//             }}
//           >
//             <Box sx={{ 
//               display: 'flex', 
//               alignItems: 'flex-start', 
//               gap: 2,
//               height: '100%'
//             }}>
//               <Box 
//                 sx={{
//                   backgroundColor: card.bgColor,
//                   borderRadius: '10px',
//                   width: '44px',
//                   height: '44px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   flexShrink: 0
//                 }}
//               >
//                 <Box sx={{ 
//                   color: card.iconColor,
//                   fontSize: '20px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center'
//                 }}>
//                   {React.cloneElement(card.icon, { 
//                     sx: { 
//                       fontSize: '20px',
//                       color: card.iconColor
//                     }
//                   })}
//                 </Box>
//               </Box>
//               <Box sx={{ flex: 1 }}>
//                 <Typography 
//                   sx={{ 
//                     fontWeight: 700,
//                     fontSize: '28px',
//                     color: '#1f2937',
//                     mb: '4px',
//                     lineHeight: 1.1,
//                     letterSpacing: '-0.025em'
//                   }}
//                 >
//                     {card.value}
//                   </Typography>
//                 <Typography 
//                   sx={{ 
//                     color: '#6b7280',
//                     fontSize: '14px',
//                     fontWeight: 500,
//                     lineHeight: 1.4
//                   }}
//                 >
//                     {card.title}
//                   </Typography>
//               </Box>
//             </Box>
//           </Box>
//         ))}
//       </Box>

//       {/* Data Table */}
//       <Box sx={{ backgroundColor: 'white', borderRadius: 2, overflow: 'hidden' }}>
//         {/* Table Header */}
//         <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
//           <Typography variant="h6" fontWeight="600" sx={{ mb: 1, fontSize: '1.1rem' }}>
//             All Consultations
//           </Typography>
          
//           {/* Search and Filters */}
//           <Box sx={{ 
//             display: 'flex', 
//             gap: 2, 
//             mt: 2,
//             flexDirection: { xs: 'column', sm: 'row' },
//             alignItems: { xs: 'stretch', sm: 'center' }
//           }}>
//             <TextField
//               placeholder="Search by Booking ID, Account Name, Customer Name..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               size="small"
//               sx={{ 
//                 flexGrow: 1,
//                 '& .MuiOutlinedInput-root': {
//                   backgroundColor: '#f8f9fa',
//                   '& fieldset': {
//                     borderColor: '#e9ecef',
//                   },
//                 }
//               }}
//               InputProps={{
//                 startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
//               }}
//             />
            
//             <FormControl size="small" sx={{ minWidth: 120 }}>
//               <Select
//                 value={typeFilter}
//                 onChange={(e) => setTypeFilter(e.target.value)}
//                 displayEmpty
//                 sx={{ backgroundColor: '#f8f9fa' }}
//               >
//                 <MenuItem value="All Types">All Types</MenuItem>
//                 <MenuItem value="Vastu">Vastu</MenuItem>
//                 <MenuItem value="Astro">Astro</MenuItem>
//               </Select>
//             </FormControl>
            
//             <FormControl size="small" sx={{ minWidth: 120 }}>
//               <Select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 displayEmpty
//                 sx={{ backgroundColor: '#f8f9fa' }}
//               >
//                 <MenuItem value="All Status">All Status</MenuItem>
//                 <MenuItem value="Completed">Completed</MenuItem>
//                 <MenuItem value="Scheduled">Scheduled</MenuItem>
//                 <MenuItem value="In Progress">In Progress</MenuItem>
//               </Select>
//             </FormControl>
//           </Box>
//         </Box>
        
//         {/* Table */}
//         <TableContainer>
//           <Table sx={{ minWidth: 650 }}>
//             <TableHead>
//               <TableRow sx={{ backgroundColor: '#ffffff' }}>
//                 <TableCell sx={{ 
//                   fontWeight: 600, 
//                   color: '#374151',
//                   fontSize: '1rem',
//                   py: 2.5,
//                   borderBottom: '1px solid #f0f0f0'
//                 }}>
//                   Booking ID
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 600, 
//                   color: '#374151',
//                   fontSize: '1rem',
//                   py: 2.5,
//                   borderBottom: '1px solid #f0f0f0'
//                 }}>
//                   Account Name
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 600, 
//                   color: '#374151',
//                   fontSize: '1rem',
//                   py: 2.5,
//                   borderBottom: '1px solid #f0f0f0'
//                 }}>
//                   Customer Name
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 600, 
//                   color: '#374151',
//                   fontSize: '1rem',
//                   py: 2.5,
//                   borderBottom: '1px solid #f0f0f0'
//                 }}>
//                   Consultant
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 600, 
//                   color: '#374151',
//                   fontSize: '1rem',
//                   py: 2.5,
//                   borderBottom: '1px solid #f0f0f0'
//                 }}>
//                   Type
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 600, 
//                   color: '#374151',
//                   fontSize: '1rem',
//                   py: 2.5,
//                   borderBottom: '1px solid #f0f0f0'
//                 }}>
//                   Status
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 600, 
//                   color: '#374151',
//                   fontSize: '1rem',
//                   py: 2.5,
//                   borderBottom: '1px solid #f0f0f0'
//                 }}>
//                   Creation Date
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 600, 
//                   color: '#374151',
//                   fontSize: '1rem',
//                   py: 2.5,
//                   borderBottom: '1px solid #f0f0f0'
//                 }}>
//                   Booking Date & Time
//                 </TableCell>
//                 <TableCell sx={{ 
//                   fontWeight: 600, 
//                   color: '#374151',
//                   fontSize: '1rem',
//                   py: 2.5,
//                   borderBottom: '1px solid #f0f0f0'
//                 }}>
//                   Order Value
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredData.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
//                     <Typography variant="body1" color="text.secondary">
//                       {consultationData.length === 0 ? 'No bookings available' : 'No bookings match your search criteria'}
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredData.map((row) => (
//                   <TableRow 
//                     key={row.id}
//                     sx={{ 
//                       '&:hover': { 
//                         backgroundColor: '#f8f9fa'
//                       },
//                       '&:last-child td': {
//                         borderBottom: 0
//                       }
//                     }}
//                   >
//                   <TableCell sx={{ 
//                     fontSize: '1rem',
//                     color: '#111827',
//                     py: 2.5,
//                     borderBottom: '1px solid #f0f0f0',
//                     fontWeight: 500
//                   }}>
//                     {row.bookingId}
//                   </TableCell>
//                   <TableCell sx={{ 
//                     fontSize: '1rem',
//                     py: 2.5,
//                     borderBottom: '1px solid #f0f0f0'
//                   }}>
//                     <Typography 
//                       component="span" 
//                       onClick={() => {
//                         // Use user_id from booking data if available, otherwise use account name
//                         if (row.userId) {
//                           navigate(`/account/${row.userId}`);
//                         } else {
//                           navigate(`/account/${encodeURIComponent(row.accountName)}`);
//                         }
//                       }}
//                       sx={{ 
//                         color: '#2563eb',
//                         fontSize: '1rem',
//                         fontWeight: 500,
//                         textDecoration: 'none',
//                         cursor: 'pointer',
//                         '&:hover': {
//                           textDecoration: 'underline'
//                         }
//                       }}
//                     >
//                       {row.accountName}
//                     </Typography>
//                   </TableCell>
//                   <TableCell sx={{ 
//                     fontSize: '1rem',
//                     py: 2.5,
//                     borderBottom: '1px solid #f0f0f0'
//                   }}>
//                     <Typography 
//                       component="span" 
//                       onClick={() => {
//                         // Use user_id from booking data if available, otherwise use customer name
//                         if (row.userId) {
//                           navigate(`/customer/${row.userId}`);
//                         } else {
//                           navigate(`/customer/${encodeURIComponent(row.customerName)}`);
//                         }
//                       }}
//                       sx={{ 
//                         color: '#2563eb',
//                         fontSize: '1rem',
//                         fontWeight: 500,
//                         textDecoration: 'none',
//                         cursor: 'pointer',
//                         '&:hover': {
//                           textDecoration: 'underline'
//                         }
//                       }}
//                     >
//                       {row.customerName}
//                     </Typography>
//                   </TableCell>
//                   <TableCell sx={{ 
//                     fontSize: '1rem',
//                     py: 2.5,
//                     borderBottom: '1px solid #f0f0f0'
//                   }}>
//                     <Typography 
//                       component="span" 
//                       onClick={() => {
//                         // Get staff_id from the original booking data
//                         const originalBooking = bookings.find(booking => 
//                           booking.staff_name === row.consultant && 
//                           booking.booking_id === row.id
//                         );
//                         if (originalBooking && originalBooking.staff_id) {
//                           navigate(`/consultant/${originalBooking.staff_id}`);
//                         }
//                       }}
//                       sx={{ 
//                         color: '#2563eb',
//                         fontSize: '1rem',
//                         fontWeight: 500,
//                         textDecoration: 'none',
//                         cursor: 'pointer',
//                         '&:hover': {
//                           textDecoration: 'underline'
//                         }
//                       }}
//                     >
//                       {row.consultant}
//                     </Typography>
//                   </TableCell>
//                   <TableCell sx={{ 
//                     fontSize: '1rem',
//                     color: '#111827',
//                     py: 2.5,
//                     borderBottom: '1px solid #f0f0f0'
//                   }}>
//                     <Chip
//                       label={row.type}
//                       size="medium"
//                       sx={{
//                         backgroundColor: row.type === 'Vastu' ? '#fef3c7' : '#dbeafe',
//                         color: row.type === 'Vastu' ? '#92400e' : '#1e40af',
//                         fontWeight: 600,
//                         fontSize: '0.875rem',
//                         height: 28,
//                         minWidth: 60
//                       }}
//                     />
//                   </TableCell>
//                   <TableCell sx={{ 
//                     fontSize: '1rem',
//                     color: '#111827',
//                     py: 2.5,
//                     borderBottom: '1px solid #f0f0f0'
//                   }}>
//                     <Chip
//                       label={row.status}
//                       size="medium"
//                       sx={{
//                         backgroundColor: 
//                           row.status === 'Completed' ? '#d1fae5' :
//                           row.status === 'Scheduled' ? '#dbeafe' :
//                           row.status === 'In Progress' ? '#fef3c7' : '#f3f4f6',
//                         color: 
//                           row.status === 'Completed' ? '#065f46' :
//                           row.status === 'Scheduled' ? '#1e40af' :
//                           row.status === 'In Progress' ? '#92400e' : '#374151',
//                         fontWeight: 600,
//                         fontSize: '0.875rem',
//                         height: 28,
//                         minWidth: 80
//                       }}
//                     />
//                   </TableCell>
//                   <TableCell sx={{ 
//                     fontSize: '1rem',
//                     color: '#111827',
//                     py: 2.5,
//                     borderBottom: '1px solid #f0f0f0',
//                     fontWeight: 500
//                   }}>
//                     {new Date(row.creationDate).toLocaleDateString('en-US', {
//                       year: 'numeric',
//                       month: '2-digit',
//                       day: '2-digit'
//                     }).replace(/\//g, '-')}
//                   </TableCell>
//                   <TableCell sx={{ 
//                     fontSize: '1rem',
//                     color: '#111827',
//                     py: 2.5,
//                     borderBottom: '1px solid #f0f0f0',
//                     fontWeight: 500
//                   }}>
//                     {new Date(row.bookingDateTime).toLocaleDateString('en-US', {
//                       year: 'numeric',
//                       month: '2-digit',
//                       day: '2-digit'
//                     }).replace(/\//g, '-')} {new Date(row.bookingDateTime).toLocaleTimeString('en-US', {
//                       hour: '2-digit',
//                       minute: '2-digit',
//                       hour12: true
//                     })}
//                   </TableCell>
//                   <TableCell sx={{ 
//                     fontSize: '1rem',
//                     color: '#111827',
//                     py: 2.5,
//                     borderBottom: '1px solid #f0f0f0',
//                     fontWeight: 700
//                   }}>
//                     ₹{row.orderValue.toLocaleString()}
//                   </TableCell>
//                 </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
        
//         {/* Pagination Controls */}
//         {consultationData.length > 0 && !loading && (
//           <Box sx={{ 
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             alignItems: 'center', 
//             p: 3,
//             borderTop: '1px solid #f0f0f0'
//           }}>
//             <Typography variant="body2" color="text.secondary">
//               Page {currentPage} of {totalPages} • Showing {consultationData.length} bookings
//             </Typography>
            
//             <Stack direction="row" spacing={2} alignItems="center">
//               <Pagination
//                 count={totalPages}
//                 page={currentPage}
//                 onChange={(event, page) => fetchBookings(page)}
//                 color="primary"
//                 shape="rounded"
//                 showFirstButton
//                 showLastButton
//                 disabled={loading}
//                 siblingCount={1}
//                 boundaryCount={1}
//               />
              
//               {hasNextPage && (
//                 <Typography variant="caption" color="text.secondary">
//                   More pages available
//                 </Typography>
//               )}
//             </Stack>
//           </Box>
//         )}
//         </Box>
//     </Box>
//   );
// };

// export default ConsultationsTable;

export {};