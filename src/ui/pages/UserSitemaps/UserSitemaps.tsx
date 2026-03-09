import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    CircularProgress,
    Alert,
    IconButton,
    Button,
    Tooltip,
} from '@mui/material';
import {
    Search,
    Download,
    Visibility,
    Refresh,
} from '@mui/icons-material';
import { useUserSitemapsViewModel } from './useUserSitemapsViewModel';

const UserSitemapsPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        sitemaps,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        refresh,
    } = useUserSitemapsViewModel();

    if (loading && sitemaps.length === 0) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        User Sitemaps
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        List of all user locations with uploaded sitemaps requiring reports
                    </Typography>
                </Box>
                <IconButton onClick={refresh} disabled={loading}>
                    <Refresh />
                </IconButton>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Box sx={{ backgroundColor: 'white', borderRadius: 2, overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
                    <TextField
                        placeholder="Search by User, Location or Sitemap name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#f8f9fa',
                            }
                        }}
                        InputProps={{
                            startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
                        }}
                    />
                </Box>

                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Location Name</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Sitemap Name</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Sitemap Upload Time</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Report Upload Time</TableCell>
                                <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sitemaps.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            {searchTerm ? 'No sitemaps match your search' : 'No sitemaps found'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sitemaps.map((row) => (
                                    <TableRow
                                        key={row.userLocationId}
                                        onClick={() => navigate(`/user-location/${row.userLocationId}`)}
                                        sx={{
                                            cursor: 'pointer',
                                            '&:hover': { backgroundColor: '#f8f9fa' },
                                            '&:last-child td': { borderBottom: 0 }
                                        }}
                                    >
                                        <TableCell>
                                            <Typography fontWeight={500}>{row.user.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">ID: {row.user.id}</Typography>
                                        </TableCell>
                                        <TableCell>{row.locationName}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {row.sitemap.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{formatDate(row.sitemap.createdAt)}</TableCell>
                                        <TableCell>{formatDate(row.report.createdAt)}</TableCell>
                                        <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                <Tooltip title="View/Download Sitemap">
                                                    <Button
                                                        size="small"
                                                        startIcon={<Download />}
                                                        onClick={() => window.open(row.sitemap.url, '_blank')}
                                                        sx={{ textTransform: 'none' }}
                                                    >
                                                        Sitemap
                                                    </Button>
                                                </Tooltip>
                                                {row.report.url ? (
                                                    <Tooltip title="View/Download Report">
                                                        <Button
                                                            size="small"
                                                            color="success"
                                                            startIcon={<Visibility />}
                                                            onClick={() => window.open(row.report.url, '_blank')}
                                                            sx={{ textTransform: 'none' }}
                                                        >
                                                            Report
                                                        </Button>
                                                    </Tooltip>
                                                ) : (
                                                    <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                                                        No Report
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default UserSitemapsPage;
