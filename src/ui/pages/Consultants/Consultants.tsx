import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Avatar,
  Rating,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import {
  People,
  PersonAdd,
  Assignment,
  Search,
  Edit,
  Star,
  CalendarToday,
  TrendingUp,
  VpnKey,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useRef } from 'react';
import { container } from 'tsyringe';
import { BackendApiClient } from '../../../backend_api_client/backend_api_client';
/* import { useConsultantsViewModel } from './useConsultantsViewModel'; */
import { useConsultantsViewModel } from './useConsultantsViewModel';

/* ... imports ... */
/*
interface StaffMember {
  ...
}
*/
// Export StaffMember interface for ViewModel
export interface StaffMember {
  staff_id: string;
  staff_name: string;
  staff_email: string;
  staff_designation?: string;
  staff_contact_number?: string;
  additional_information?: string;
  photo?: string;
  assigned_services?: string[];
  // Calculated/Mock fields
  experience_years?: number;
  total_bookings?: number;
  avg_rating?: number;
  total_commission?: number;
  status?: 'Active' | 'Inactive';
  type?: 'Vastu' | 'Astro';
}

const Consultants: React.FC = () => {
  const navigate = useNavigate();
  const { staffData, loading, error } = useConsultantsViewModel();
  const backendApiClient = useRef(container.resolve(BackendApiClient)).current;

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // Password Dialog State
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleOpenPasswordDialog = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setNewPassword('');
    setPasswordDialogOpen(true);
  };

  const handleClosePasswordDialog = () => {
    setPasswordDialogOpen(false);
    setSelectedStaff(null);
    setNewPassword('');
    setShowPassword(false);
  };

  const handleSetPassword = async () => {
    if (!selectedStaff || !newPassword) return;

    setIsSubmitting(true);
    try {
      await backendApiClient.auth.assignPassword(
        selectedStaff.staff_id,
        newPassword
      );

      setSnackbar({
        open: true,
        message: `Password successfully set for ${selectedStaff.staff_name}`,
        severity: 'success'
      });
      handleClosePasswordDialog();
    } catch (err: any) {
      console.error('Failed to set password:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to set password',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  // Filter staff based on search and filters
  const filteredStaff = staffData.filter((staff) => {
    const matchesSearch = staff.staff_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.staff_designation?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All Types' || staff.type === typeFilter;
    const matchesStatus = statusFilter === 'All Status' || staff.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate statistics
  const totalConsultants = staffData.length;
  const activeConsultants = staffData.filter(staff => staff.status === 'Active').length;
  const totalBookings = staffData.reduce((sum, staff) => sum + (staff.total_bookings || 0), 0);
  const averageRating = staffData.length > 0
    ? staffData.reduce((sum, staff) => sum + (staff.avg_rating || 0), 0) / staffData.length
    : 0;

  const consultantStats = [
    {
      title: 'Total Consultants',
      value: totalConsultants.toString(),
      icon: <People sx={{ fontSize: 32, color: '#3b82f6' }} />
    },
    {
      title: 'Active',
      value: activeConsultants.toString(),
      icon: <TrendingUp sx={{ fontSize: 32, color: '#22c55e' }} />
    },
    {
      title: 'Total Bookings',
      value: totalBookings.toString(),
      icon: <CalendarToday sx={{ fontSize: 32, color: '#8b5cf6' }} />
    },
    {
      title: 'Average Rating',
      value: averageRating.toFixed(1),
      icon: <Star sx={{ fontSize: 32, color: '#f59e0b' }} />
    },
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Consultants Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your Vastu and Astro consultants
          </Typography>
        </Box>
        {/* <Button
          variant="contained"
          startIcon={<PersonAdd />}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 2,
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Add New Consultant
        </Button> */}
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}. Please check your API connection.
        </Alert>
      )}

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
        {consultantStats.map((stat, index) => (
          <Card key={index} sx={{ borderRadius: 2, boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {stat.icon}
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>All Consultants</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Search by Name or Specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>All Types</InputLabel>
              <Select
                value={typeFilter}
                label="All Types"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="All Types">All Types</MenuItem>
                <MenuItem value="Vastu">Vastu</MenuItem>
                <MenuItem value="Astro">Astro</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>All Status</InputLabel>
              <Select
                value={statusFilter}
                label="All Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All Status">All Status</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Consultants Table */}
      <Card sx={{ borderRadius: 2 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Designation / Experience</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total Bookings</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Avg Rating</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total Commission</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStaff.map((staff) => (
                <TableRow key={staff.staff_id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={staff.photo || undefined}
                        sx={{ bgcolor: 'primary.main' }}
                      >
                        {staff.staff_name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight="medium"
                          color="primary"
                          onClick={() => navigate(`/consultant-details/${staff.staff_id}`)}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              textDecoration: 'underline'
                            }
                          }}
                        >
                          {staff.staff_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {staff.staff_email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {staff.type ? (
                      <Chip
                        label={staff.type}
                        size="small"
                        sx={{
                          backgroundColor: staff.type === 'Vastu' ? '#fef3c7' : '#dbeafe',
                          color: staff.type === 'Vastu' ? '#92400e' : '#1e40af',
                          fontWeight: 500,
                        }}
                      />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>{staff.experience_years ? `${staff.experience_years} years` : '-'}</TableCell>
                  <TableCell>{staff.total_bookings || '-'}</TableCell>
                  <TableCell>
                    {staff.avg_rating ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={staff.avg_rating} readOnly size="small" />
                        <Typography variant="body2">{staff.avg_rating.toFixed(1)}</Typography>
                      </Box>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>{staff.total_commission ? `₹${staff.total_commission.toLocaleString()}` : '-'}</TableCell>
                  <TableCell>
                    {staff.status ? (
                      <Chip
                        label={staff.status}
                        size="small"
                        sx={{
                          backgroundColor: staff.status === 'Active' ? '#dcfce7' : '#fef2f2',
                          color: staff.status === 'Active' ? '#166534' : '#991b1b',
                          fontWeight: 500,
                        }}
                      />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary" title="Edit Details">
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="secondary"
                      title="Set Password"
                      onClick={() => handleOpenPasswordDialog(staff)}
                      sx={{ ml: 1 }}
                    >
                      <VpnKey />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Set Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={handleClosePasswordDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Set Staff Password</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Assign a password for <strong>{selectedStaff?.staff_name}</strong> ({selectedStaff?.staff_email})
              to enable dashboard login.
            </Typography>
            <TextField
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClosePasswordDialog} disabled={isSubmitting}>Cancel</Button>
          <Button
            onClick={handleSetPassword}
            variant="contained"
            disabled={isSubmitting || !newPassword || newPassword.length < 6}
          >
            {isSubmitting ? 'Saving...' : 'Set Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Consultants;
