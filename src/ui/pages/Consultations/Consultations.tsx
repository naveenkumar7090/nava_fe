import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  CircularProgress,
  Alert,
  Pagination,
  Stack,
} from '@mui/material';
import {
  CalendarToday,
  CheckCircle,
  Group,
  TrendingUp,
  Search,
} from '@mui/icons-material';
import StatusCell from './components/StatusCell';
import { useConsultationsViewModel } from './useConsultationsViewModel';

const ConsultationsTable: React.FC = () => {
  const navigate = useNavigate();

  // Use the view model hook
  const {
    bookings,
    filteredData,
    statistics,
    loading,
    error,
    currentPage,
    hasNextPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    fetchBookings,
  } = useConsultationsViewModel();

  // Stats cards configuration
  const statsCards = [
    {
      title: 'Total Bookings',
      value: statistics.totalBookings.toString(),
      icon: <CalendarToday />,
      bgColor: '#dbeafe',
      iconColor: '#3b82f6',
    },
    {
      title: 'Completed',
      value: statistics.completedBookings.toString(),
      icon: <CheckCircle />,
      bgColor: '#dcfce7',
      iconColor: '#22c55e',
    },
    {
      title: 'Active Consultants',
      value: statistics.activeConsultants.toString(),
      icon: <Group />,
      bgColor: '#dbeafe',
      iconColor: '#3b82f6',
    },
    {
      title: 'Total Revenue',
      value: `₹${statistics.totalRevenue.toLocaleString()}`,
      icon: <TrendingUp />,
      bgColor: '#f3e8ff',
      iconColor: '#a855f7',
    },
  ];


  // Show loading state
  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>
          Loading bookings...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      {/* <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Consultations Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and track all consultation bookings and appointments
        </Typography>
      </Box> */}

      {/* Statistics Cards */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)'
        },
        gap: 3,
        mb: 4
      }}>
        {statsCards.map((card, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: 'white',
              borderRadius: '12px',
              p: '20px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Box sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              height: '100%'
            }}>
              <Box
                sx={{
                  backgroundColor: card.bgColor,
                  borderRadius: '10px',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Box sx={{
                  color: card.iconColor,
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {React.cloneElement(card.icon, {
                    sx: {
                      fontSize: '20px',
                      color: card.iconColor
                    }
                  })}
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '28px',
                    color: '#1f2937',
                    mb: '4px',
                    lineHeight: 1.1,
                    letterSpacing: '-0.025em'
                  }}
                >
                  {card.value}
                </Typography>
                <Typography
                  sx={{
                    color: '#6b7280',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: 1.4
                  }}
                >
                  {card.title}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Data Table */}
      <Box sx={{ backgroundColor: 'white', borderRadius: 2, overflow: 'hidden' }}>
        {/* Table Header */}
        <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
          <Typography variant="h6" fontWeight="600" sx={{ mb: 1, fontSize: '1.1rem' }}>
            All Consultations
          </Typography>

          {/* Search and Filters */}
          <Box sx={{
            display: 'flex',
            gap: 2,
            mt: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' }
          }}>
            <TextField
              placeholder="Search by Booking ID, Account Name, Subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f8f9fa',
                  '& fieldset': {
                    borderColor: '#e9ecef',
                  },
                }
              }}
              InputProps={{
                startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                displayEmpty
                sx={{ backgroundColor: '#f8f9fa' }}
              >
                <MenuItem value="All Types">All Types</MenuItem>
                <MenuItem value="Vastu">Vastu</MenuItem>
                <MenuItem value="Astro">Astro</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                displayEmpty
                sx={{ backgroundColor: '#f8f9fa' }}
              >
                <MenuItem value="All Status">All Status</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Table */}
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#ffffff' }}>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '1rem',
                  py: 2.5,
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  Booking ID
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '1rem',
                  py: 2.5,
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  Account Name
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '1rem',
                  py: 2.5,
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  Subject
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '1rem',
                  py: 2.5,
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  Consultant
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '1rem',
                  py: 2.5,
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  Type
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '1rem',
                  py: 2.5,
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  Status
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '1rem',
                  py: 2.5,
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  Creation Date
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '1rem',
                  py: 2.5,
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  Booking Date & Time
                </TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: '1rem',
                  py: 2.5,
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  Order Value
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {filteredData.length === 0 ? 'No bookings available' : 'No bookings match your search criteria'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f8f9fa'
                      },
                      '&:last-child td': {
                        borderBottom: 0
                      }
                    }}
                  >
                    <TableCell sx={{
                      fontSize: '1rem',
                      color: '#111827',
                      py: 2.5,
                      borderBottom: '1px solid #f0f0f0',
                      fontWeight: 500
                    }}>
                      {row.bookingId}
                    </TableCell>
                    <TableCell sx={{
                      fontSize: '1rem',
                      py: 2.5,
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      <Typography
                        component="span"
                        onClick={() => {
                          // Use user_id from booking data if available, otherwise use account name
                          if (row.userId) {
                            navigate(`/account/${row.userId}`);
                          } else {
                            navigate(`/account/${encodeURIComponent(row.accountName)}`);
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
                        {row.accountName}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{
                      fontSize: '1rem',
                      py: 2.5,
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      <Typography
                        component="span"
                        onClick={() => {
                          // Use user_id from booking data if available, otherwise use customer name
                          if (row.userProfileId) {
                            navigate(`/customer/${row.userProfileId}`);
                          } else {
                            navigate(`/location/${row.userLocationId}`);
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
                        {row.subject}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{
                      fontSize: '1rem',
                      py: 2.5,
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      <Typography
                        component="span"
                        onClick={() => {
                          // Get staffId from the original booking data
                          const originalBooking = bookings.find(booking =>
                            booking.staff.name === row.consultant &&
                            booking.bookingId === row.id
                          );
                          if (originalBooking && originalBooking.staff.id) {
                            navigate(`/consultant/${originalBooking.staff.id}`);
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
                        {row.consultant}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{
                      fontSize: '1rem',
                      color: '#111827',
                      py: 2.5,
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      <Chip
                        label={row.type}
                        size="medium"
                        sx={{
                          backgroundColor: row.type === 'Vastu' ? '#fef3c7' : '#dbeafe',
                          color: row.type === 'Vastu' ? '#92400e' : '#1e40af',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          height: 28,
                          minWidth: 60
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{
                      fontSize: '1rem',
                      color: '#111827',
                      py: 2.5,
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      <Chip
                        label={row.status}
                        size="medium"
                        sx={{
                          backgroundColor:
                            row.status === 'Completed' ? '#d1fae5' :
                              row.status === 'Scheduled' ? '#dbeafe' :
                                row.status === 'In Progress' ? '#fef3c7' : '#f3f4f6',
                          color:
                            row.status === 'Completed' ? '#065f46' :
                              row.status === 'Scheduled' ? '#1e40af' :
                                row.status === 'In Progress' ? '#92400e' : '#374151',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          height: 28,
                          minWidth: 80
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{
                      fontSize: '1rem',
                      color: '#111827',
                      py: 2.5,
                      borderBottom: '1px solid #f0f0f0',
                      fontWeight: 500
                    }}>
                      {new Date(row.creationDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      }).replace(/\//g, '-')}
                    </TableCell>
                    <TableCell sx={{
                      fontSize: '1rem',
                      color: '#111827',
                      py: 2.5,
                      borderBottom: '1px solid #f0f0f0',
                      fontWeight: 500
                    }}>
                      {new Date(row.bookingDateTime).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      }).replace(/\//g, '-')} {new Date(row.bookingDateTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </TableCell>
                    <TableCell sx={{
                      fontSize: '1rem',
                      color: '#111827',
                      py: 2.5,
                      borderBottom: '1px solid #f0f0f0',
                      fontWeight: 700
                    }}>
                      ₹{row.orderValue.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        {filteredData.length > 0 && !loading && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 3,
            borderTop: '1px solid #f0f0f0'
          }}>
            <Typography variant="body2" color="text.secondary">
              Page {currentPage} of {totalPages} • Showing {filteredData.length} bookings
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, page) => fetchBookings(page)}
                color="primary"
                shape="rounded"
                showFirstButton
                showLastButton
                disabled={loading}
                siblingCount={1}
                boundaryCount={1}
              />

              {hasNextPage && (
                <Typography variant="caption" color="text.secondary">
                  More pages available
                </Typography>
              )}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ConsultationsTable;
