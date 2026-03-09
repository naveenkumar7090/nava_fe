import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Alert,
    Button,
    Paper,
} from '@mui/material';
import { Star, Refresh, ArrowBack } from '@mui/icons-material';
import { useKundiChartsViewModel } from './useKundiChartsViewModel';

const KundiChartsPage: React.FC = () => {
    const {
        loading,
        charts,
        error,
        fetchCharts,
        handleBack,
        userId,
        profileId
    } = useKundiChartsViewModel();

    return (
        <Box sx={{ p: 4, backgroundColor: '#f3f4f6', minHeight: 'calc(100vh - 64px)' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    sx={{
                        mr: 2,
                        color: '#6b7280',
                        '&:hover': {
                            backgroundColor: '#f3f4f6'
                        }
                    }}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
                    onClick={fetchCharts}
                    disabled={loading || (!userId && !profileId)}
                >
                    {loading ? 'Refreshing...' : 'Refresh Charts'}
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            {charts && !loading && (
                <Grid container spacing={4}>
                    {[
                        { key: 'birth', label: 'Birth/Lagna' },
                        { key: 'd2', label: 'Hora' },
                        { key: 'd3', label: 'Dreshkan' },
                        { key: 'd4', label: 'Chaturthamsha' },
                        { key: 'd7', label: 'Saptamansha' },
                        { key: 'navamsha', label: 'Navamsha' },
                        { key: 'dashamsha', label: 'Dashamansha' },
                        { key: 'd12', label: 'Dwadashamsha' },
                        { key: 'd16', label: 'Shodashamsha' },
                        { key: 'd20', label: 'Vishamansha' },
                        { key: 'd24', label: 'Chaturvimshamsha' },
                        { key: 'd27', label: 'Bhamsha)' },
                        { key: 'd30', label: 'Trishamansha' },
                        { key: 'd40', label: 'Khavedamsha' },
                        { key: 'd45', label: 'Akshvedansha' },
                        { key: 'd60', label: 'Shashtyamsha' },
                        { key: 'moon', label: 'Moon' },
                        { key: 'sun', label: 'Sun' },
                        { key: 'chalit', label: 'Chalit' },
                        { key: 'cuspal', label: 'Cuspal' },
                    ].map(({ key, label }) => {
                        const svg = (charts as any)[key];
                        if (!svg) return null;

                        return (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={key}>
                                <Card sx={{
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)'
                                    }
                                }}>
                                    <Box sx={{
                                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                                        color: 'white',
                                        px: 4,
                                        py: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Typography variant="subtitle1" fontWeight="800" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {label} Chart
                                        </Typography>
                                    </Box>
                                    <CardContent sx={{ p: 0, backgroundColor: 'white' }}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                width: '100%',
                                                aspectRatio: '1/1',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                p: 3,
                                            }}
                                            dangerouslySetInnerHTML={{ __html: svg }}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {!charts && !loading && !error && (
                <Paper sx={{
                    p: 10,
                    textAlign: 'center',
                    borderRadius: 4,
                    border: '2px dashed #e2e8f0',
                    backgroundColor: 'white'
                }}>
                    <Star sx={{ fontSize: 60, color: '#e2e8f0', mb: 2 }} />
                    <Typography variant="h5" fontWeight="700" color="text.primary" gutterBottom>
                        No Customer Selected
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                        Please navigate to a customer's account or profile page and click "View Kundli" to analyze their charts.
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default KundiChartsPage;
