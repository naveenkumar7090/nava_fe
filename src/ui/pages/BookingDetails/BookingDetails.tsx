import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Grid,
    Chip,
    Button,
    Divider,
    Card,
    CardContent,
    Avatar,
    Stack,
    Alert,
    TextField
} from '@mui/material';
import {
    ArrowBack,
    Event,
    AccessTime,
    Schedule,
    VideoCameraFront,
    Star,
    LocationOn,
    Person,
    Save
} from '@mui/icons-material';
import { useBookingDetailsViewModel } from './useBookingDetailsViewModel';

const BookingDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        booking,
        loading,
        error,
        remedyData,
        handleRemedyInputChange,
        isSaving,
        saveRemedyData
    } = useBookingDetailsViewModel(id ? parseInt(id) : null);

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8f9fa' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !booking) {
        return (
            <Box sx={{ p: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mb: 2 }}>
                    Go Back
                </Button>
                <Alert severity="error">
                    {error || 'Booking not found'}
                </Alert>
            </Box>
        );
    }

    // Determine status color
    const getStatusColor = (status: string) => {
        const s = status?.toLowerCase() || '';
        if (s === 'upcoming' || s === 'ongoing') return 'primary';
        if (s === 'completed') return 'success';
        if (s === 'cancelled' || s === 'noshow') return 'error';
        return 'default';
    };

    return (
        <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh', pb: 8 }}>
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
                    Booking Details
                </Typography>
                <Chip
                    label={booking.status}
                    color={getStatusColor(booking.status)}
                    sx={{
                        ml: 2,
                        textTransform: 'capitalize',
                        fontWeight: 'bold',
                        height: 28
                    }}
                />
            </Box>

            {/* Main Grid */}
            <Grid container spacing={4}>
                {/* Left Col: Overview, Service, Remedy */}
                <Grid size={{ xs: 12, md: 8 }}>
                    {/* Consultation Info */}
                    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    Consultation Info
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ID: #{booking.bookingId}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3, p: 2, bgcolor: '#f3f4f6', borderRadius: 2 }}>
                                <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 48, height: 48, boxShadow: 1 }}>
                                    <VideoCameraFront />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                                        {booking.service?.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                                        {booking.consultationType} Consultation
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Stack spacing={1}>
                                        <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                                            <Event fontSize="small" />
                                            <Typography variant="body2" fontWeight="500">Date</Typography>
                                        </Stack>
                                        <Typography variant="body1" fontWeight="600">
                                            {booking.scheduledStartTime ? new Date(booking.scheduledStartTime).toLocaleDateString(undefined, {
                                                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                                            }) : 'Not Scheduled'}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Stack spacing={1}>
                                        <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                                            <AccessTime fontSize="small" />
                                            <Typography variant="body2" fontWeight="500">Time</Typography>
                                        </Stack>
                                        <Typography variant="body1" fontWeight="600">
                                            {booking.scheduledStartTime
                                                ? `${new Date(booking.scheduledStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                                : 'TBD'}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <Stack spacing={1}>
                                        <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                                            <Schedule fontSize="small" />
                                            <Typography variant="body2" fontWeight="500">Duration</Typography>
                                        </Stack>
                                        <Typography variant="body1" fontWeight="600">
                                            {booking.duration}
                                        </Typography>
                                    </Stack>
                                </Grid>
                            </Grid>

                            {booking.topicOfDiscussion && (
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Topic of Discussion
                                    </Typography>
                                    <Typography variant="body1">
                                        {booking.topicOfDiscussion}
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>

                    {/* Feedback / Rating */}
                    {booking.rating && (
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Feedback
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Star sx={{ color: '#fbbf24', fontSize: 28 }} />
                                    <Typography variant="h5" fontWeight="bold">
                                        {booking.rating}
                                        <Typography component="span" variant="body1" color="text.secondary">/5</Typography>
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    )}

                    {/* Remedy Form (Visible only if status is completed) */}
                    {booking.status?.toLowerCase() === 'completed' && (
                        <Card sx={{ mt: 3, borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Remedy PDF Generator
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Stack spacing={2}>
                                            <TextField
                                                label="Problems"
                                                multiline rows={4}
                                                value={remedyData.problems}
                                                onChange={(e) => handleRemedyInputChange('problems', e.target.value)}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Diagnosis"
                                                multiline rows={4}
                                                value={remedyData.diagnosis}
                                                onChange={(e) => handleRemedyInputChange('diagnosis', e.target.value)}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Suggestions"
                                                multiline rows={4}
                                                value={remedyData.suggestions}
                                                onChange={(e) => handleRemedyInputChange('suggestions', e.target.value)}
                                                fullWidth
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Stack spacing={2}>
                                            <TextField
                                                label="Recommended Products"
                                                multiline rows={4}
                                                value={remedyData.products}
                                                onChange={(e) => handleRemedyInputChange('products', e.target.value)}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Reminders"
                                                multiline rows={8}
                                                value={remedyData.reminders}
                                                onChange={(e) => handleRemedyInputChange('reminders', e.target.value)}
                                                fullWidth
                                            />
                                        </Stack>
                                    </Grid>
                                </Grid>
                                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                        onClick={saveRemedyData}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Saving...' : 'Save Remedy Data'}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                </Grid>

                {/* Right Col: Customer, Staff */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Customer
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <Avatar sx={{ width: 48, height: 48, bgcolor: '#3b82f6' }}>
                                    {booking.account?.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box sx={{ overflow: 'hidden' }}>
                                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                        {booking.account?.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        {booking.account?.email}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {booking.account?.mobile || 'No mobile'}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Preferred Language
                                </Typography>
                                <Typography variant="body2" fontWeight="500">
                                    {booking.preferredLanguage}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Subject Details (Profile & Location) */}
                    {(booking.profile || booking.location) && (
                        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Subject Details
                                </Typography>

                                {booking.profile && (
                                    <Box sx={{ mb: booking.location ? 3 : 0 }}>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                            <Person fontSize="small" color="action" />
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Astro Profile
                                            </Typography>
                                        </Stack>

                                        <Box sx={{ pl: 3.5 }}>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                {booking.profile.name}
                                            </Typography>

                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="text.secondary" display="block">Date of Birth</Typography>
                                                    <Typography variant="body2" fontWeight="500">
                                                        {booking.profile.dateOfBirth
                                                            ? new Date(booking.profile.dateOfBirth).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                                                            : 'Not Specified'}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="text.secondary" display="block">Time of Birth</Typography>
                                                    <Typography variant="body2" fontWeight="500">
                                                        {booking.profile.timeOfBirth
                                                            ? new Date(booking.profile.timeOfBirth).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                            : 'Not Specified'}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <Typography variant="caption" color="text.secondary" display="block">Place of Birth</Typography>
                                                    <Typography variant="body2" fontWeight="500">
                                                        {booking.profile.placeOfBirth || 'Not Specified'}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="text.secondary" display="block">Gender</Typography>
                                                    <Typography variant="body2" fontWeight="500" sx={{ textTransform: 'capitalize' }}>
                                                        {booking.profile.gender || 'Not Specified'}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="text.secondary" display="block">Sun Sign</Typography>
                                                    <Typography variant="body2" fontWeight="500">
                                                        {booking.profile.sunSign || 'Not Specified'}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="text.secondary" display="block">Moon Sign</Typography>
                                                    <Typography variant="body2" fontWeight="500">
                                                        {booking.profile.moonSign || 'Not Specified'}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Box>
                                )}

                                {booking.profile && booking.location && <Divider sx={{ my: 2 }} />}

                                {booking.location && (
                                    <Box>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                            <LocationOn fontSize="small" color="action" />
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Vastu Location
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body1" fontWeight="500" sx={{ pl: 3.5 }}>
                                            {booking.location.name}
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Assigned Expert
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: '#dbeafe', color: '#1e40af', width: 48, height: 48 }}>
                                    {booking.staff?.name?.charAt(0)?.toUpperCase() || 'E'}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {booking.staff?.name || 'Pending Assignment'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Staff ID: {booking.staff?.id}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BookingDetails;
