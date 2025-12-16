import React from 'react';
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
    AccordionDetails
} from '@mui/material';
import {
    ArrowBack,
    LocationOn,
    Layers,
    ExpandMore,
    CompassCalibration
} from '@mui/icons-material';
import { useUserLocationDetailsViewModel } from './useUserLocationDetailsViewModel';

const UserLocationDetails: React.FC = () => {
    const navigate = useNavigate();
    const { location, loading, error } = useUserLocationDetailsViewModel();

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
                                {location.location.name} • {location.buildingType || 'Unknown Type'}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                            label={location.status}
                            sx={{
                                backgroundColor: location.status === 'mapped' ? '#dcfce7' : '#fef3c7',
                                color: location.status === 'mapped' ? '#166534' : '#92400e',
                                fontWeight: 600
                            }}
                        />
                        <Chip
                            label={`Score: ${location.vastuScore}`}
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                        />
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

            {/* Floors Details */}
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
        </Box>
    );
};

export default UserLocationDetails;
