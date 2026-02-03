import React, { JSX, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    CircularProgress,
    Alert,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stack
} from '@mui/material';
import {
    ArrowBack,
    LocationOn,
    Layers,
    ExpandMore,
    CompassCalibration,
    CloudUpload,
    Download,
    Description,
    PictureAsPdf
} from '@mui/icons-material';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useUserLocationDetailsViewModel } from './useUserLocationDetailsViewModel';
import { Booking } from '../../../backend_api_client/models/booking';
import { container } from 'tsyringe';
import { BackendApiClient } from '../../../backend_api_client/backend_api_client';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const UserLocationDetails: React.FC = () => {
    const backendApiClient = useRef(container.resolve(BackendApiClient)).current;

    const navigate = useNavigate();
    const { location, loading, uploading, error, bookings, remedyDataMap, uploadReport, downloadMap } = useUserLocationDetailsViewModel();

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadReport(file);
        }
    };

    const handleViewRemedyPDF = async (booking: Booking) => {
        try {
            await backendApiClient.viewRemedyPDF(booking.id);
        } catch (error) {
            console.error('❌ Error viewing PDF:', error);
            alert('Error viewing PDF. Please try again.');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !location) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error || 'Location not found'}</Alert>
            </Box>
        );
    }

    const renderSitemapSection = (): JSX.Element => {
        if (location.scanningMethod !== "upload") {
            return <></>;
        }

        return (
            <>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                    Sitemap & Report
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ borderRadius: 2, height: '100%', border: '1px solid #e5e7eb' }}>
                            <CardContent sx={{ height: "100%" }}>
                                <Stack height="100%">
                                    <Stack flexDirection="row" alignItems="center" gap={2} mb={2}>
                                        <Description color="primary" />
                                        <Typography variant="h6" fontWeight="600">User Sitemap</Typography>
                                    </Stack>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        The sitemap uploaded by the user for this location.
                                    </Typography>

                                    <Box sx={{ flexGrow: 1, flexBasis: 0 }} />

                                    {location.sitemap?.sitemapPdf ? (
                                        <Button
                                            variant="outlined"
                                            startIcon={<Download />}
                                            href={location.sitemap.sitemapPdf}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            fullWidth
                                        >
                                            Download Sitemap
                                        </Button>
                                    ) : (
                                        <Alert severity="warning">No sitemap uploaded by user</Alert>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ borderRadius: 2, height: '100%', border: '1px solid #e5e7eb' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <CloudUpload color="primary" />
                                    <Typography variant="h6" fontWeight="600">Vastu Report</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Upload a PDF report based on the sitemap provided above.
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {location.userLocationMap ? (
                                        <Box sx={{ p: 2, backgroundColor: '#f0f9ff', borderRadius: 1, border: '1px solid #bae6fd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Description fontSize="small" sx={{ color: '#0369a1' }} />
                                                <Typography variant="body2" fontWeight="600" sx={{ color: '#0369a1' }}>
                                                    Report PDF Uploaded
                                                </Typography>
                                            </Box>
                                            <Button
                                                size="small"
                                                startIcon={<Download />}
                                                onClick={() => downloadMap(location.userLocationMap!.id, `Report_${location.locationName}.pdf`)}
                                            >
                                                View
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Alert severity="info" sx={{ mb: 0 }}>No report uploaded yet.</Alert>
                                    )}

                                    <Button
                                        component="label"
                                        variant="contained"
                                        startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                                        disabled={uploading}
                                        fullWidth
                                    >
                                        {uploading ? 'Uploading...' : location.userLocationMap ? 'Update Report' : 'Upload Report'}
                                        <VisuallyHiddenInput type="file" accept="application/pdf" onChange={handleFileUpload} />
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </>
        );
    };

    const renderFloorDetails = (): JSX.Element => {
        if (location.scanningMethod !== "manual") {
            return <></>;
        }

        return (
            <>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                    Floor Details
                </Typography>

                {location.floors.map((floor) => (
                    <Accordion key={floor.id} defaultExpanded sx={{ mb: 2, borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', pr: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Layers color="primary" />
                                    <Typography variant="h6" fontWeight="600">
                                        Floor {floor.floorNumber}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Chip
                                        label={`Score: ${floor.vastuScore}`}
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                    />
                                    <Chip
                                        label={floor.status}
                                        size="small"
                                        sx={{
                                            backgroundColor: floor.status === 'mapped' ? '#dcfce7' : '#f3f4f6',
                                            color: floor.status === 'mapped' ? '#166534' : '#374151',
                                            textTransform: 'capitalize'
                                        }}
                                    />
                                </Box>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Divider sx={{ mb: 2 }} />

                            <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2 }}>
                                Mapped Spaces
                            </Typography>

                            {floor.space && floor.space.length > 0 ? (
                                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e5e7eb' }}>
                                    <Table size="small">
                                        <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600 }}>Space Name</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Direction</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Bearing</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {floor.space.map((space, idx) => (
                                                <TableRow key={space.id || idx} hover>
                                                    <TableCell>{space.name}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={space.direction}
                                                            size="small"
                                                            icon={<CompassCalibration sx={{ fontSize: '14px !important' }} />}
                                                            sx={{ backgroundColor: '#eff6ff', color: '#1e40af' }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{space.bearing}°</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Alert severity="info">No spaces mapped for this floor.</Alert>
                            )}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </>
        );
    };

    const renderConsultationHistory = (): JSX.Element => {
        return (
            <Card sx={{ mt: 4, borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Consultation History
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    {bookings.length === 0 ? (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            No consultations found for this location.
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
                                                            handleViewRemedyPDF(booking);
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
        );
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{ mb: 2, '&:hover': { backgroundColor: '#f3f4f6' } }}
                >
                    <ArrowBack />
                </IconButton>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#111827' }}>
                            {location.locationName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                            <LocationOn sx={{ fontSize: 20 }} />
                            <Typography variant="body1">
                                {location.location.name}
                            </Typography>
                        </Box>
                    </Box>

                </Box>
            </Box>

            {/* Overview Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card sx={{ borderRadius: 2, height: '100%' }}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>Floors</Typography>
                            <Typography variant="h4" fontWeight="bold">{location.floorCount}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card sx={{ borderRadius: 2, height: '100%' }}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>Scanning Method</Typography>
                            <Typography variant="h5" fontWeight="bold">{location.scanningMethod}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card sx={{ borderRadius: 2, height: '100%' }}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>Created At</Typography>
                            <Typography variant="h6">
                                {new Date(location.createdAt).toLocaleDateString()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {renderSitemapSection()}

            {renderFloorDetails()}

            {renderConsultationHistory()}
        </Box>
    );
};

export default UserLocationDetails;
