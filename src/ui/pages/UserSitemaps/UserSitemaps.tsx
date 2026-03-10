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
    Map,
    PendingActions,
    AssignmentTurnedIn,
} from '@mui/icons-material';
import { useUserSitemapsViewModel } from './useUserSitemapsViewModel';

const UserSitemapsPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        sitemaps,
        statistics,
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

    const formatDateTime = (dateString: string | null | undefined) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        const datePart = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-');
        const timePart = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        return `${datePart} ${timePart}`;
    };

    const statsCards = [
        {
            title: 'Total Sitemaps',
            value: statistics.totalSitemaps.toString(),
            icon: (props: any) => <Map {...props} />,
            bgColor: '#dbeafe',
            iconColor: '#3b82f6',
        },
        {
            title: 'Pending Reports',
            value: statistics.pendingReports.toString(),
            icon: (props: any) => <PendingActions {...props} />,
            bgColor: '#fef3c7',
            iconColor: '#92400e',
        },
        {
            title: 'Completed Reports',
            value: statistics.completedReports.toString(),
            icon: (props: any) => <AssignmentTurnedIn {...props} />,
            bgColor: '#dcfce7',
            iconColor: '#22c55e',
        },
    ];

    const headerCellStyle = {
        fontWeight: 600,
        color: '#374151',
        fontSize: '1rem',
        py: 2.5,
        borderBottom: '1px solid #f0f0f0'
    };

    const bodyCellStyle = {
        fontSize: '1rem',
        color: '#111827',
        py: 2.5,
        borderBottom: '1px solid #f0f0f0',
        fontWeight: 500
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Statistics Cards */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)'
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
                            p: '24px',
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                            <Box sx={{
                                backgroundColor: card.bgColor,
                                borderRadius: '10px',
                                width: '48px',
                                height: '48px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                {card.icon({
                                    sx: { fontSize: '24px', color: card.iconColor }
                                })}
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '28px', color: '#111827', lineHeight: 1 }}>
                                    {card.value}
                                </Typography>
                                <Typography sx={{ color: '#6b7280', fontSize: '14px', fontWeight: 500, mt: 0.5 }}>
                                    {card.title}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>

            {/* Main Content Card */}
            <Box sx={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                {/* Search Header */}
                <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="600" sx={{ fontSize: '1.1rem', color: '#111827' }}>
                            All User Sitemaps
                        </Typography>
                        <Tooltip title="Refresh results">
                            <IconButton onClick={refresh} disabled={loading} size="small">
                                <Refresh sx={{ fontSize: '20px' }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <TextField
                        placeholder="Search by User Name, Location Name or Sitemap File..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#f9fafb',
                                '& fieldset': { borderColor: '#e5e7eb' },
                                '&:hover fieldset': { borderColor: '#d1d5db' },
                            }
                        }}
                        InputProps={{
                            startAdornment: <Search sx={{ color: '#9ca3af', mr: 1, fontSize: '20px' }} />,
                        }}
                    />
                </Box>

                {error && <Alert severity="error" sx={{ m: 3, mb: 0 }}>{error}</Alert>}

                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#ffffff' }}>
                                <TableCell sx={headerCellStyle}>User Profile</TableCell>
                                <TableCell sx={headerCellStyle}>Location Name</TableCell>
                                <TableCell sx={headerCellStyle}>Sitemap Uploaded</TableCell>
                                <TableCell sx={headerCellStyle}>Report Status</TableCell>
                                <TableCell sx={headerCellStyle} align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sitemaps.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 8 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            {searchTerm ? 'No sitemaps found matching your search' : 'No user sitemaps available'}
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
                                            '&:hover': { backgroundColor: '#f9fafb' },
                                            '&:last-child td': { borderBottom: 0 }
                                        }}
                                    >
                                        <TableCell sx={bodyCellStyle}>
                                            <Typography
                                                component="span"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/account/${row.user.id}`);
                                                }}
                                                sx={{
                                                    color: '#2563eb',
                                                    fontSize: '1rem',
                                                    fontWeight: 600,
                                                    textDecoration: 'none',
                                                    cursor: 'pointer',
                                                    '&:hover': { textDecoration: 'underline' }
                                                }}
                                            >
                                                {row.user.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={bodyCellStyle}>
                                            <Typography sx={{ fontWeight: 500 }}>{row.locationName}</Typography>
                                        </TableCell>
                                        <TableCell sx={bodyCellStyle}>
                                            <Typography sx={{ fontSize: '0.95rem' }}>{formatDateTime(row.sitemap.createdAt)}</Typography>
                                        </TableCell>
                                        <TableCell sx={bodyCellStyle}>
                                            {row.report.url ? (
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Typography sx={{ fontSize: '0.95rem', color: '#059669', fontWeight: 600 }}>Uploaded</Typography>
                                                    <Typography variant="caption" color="#6b7280">{formatDateTime(row.report.createdAt)}</Typography>
                                                </Box>
                                            ) : (
                                                <Typography sx={{ fontSize: '0.95rem', color: '#d97706', fontWeight: 600 }}>Pending</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell sx={bodyCellStyle} align="center" onClick={(e) => e.stopPropagation()}>
                                            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                                                <Tooltip title="View Sitemap PDF">
                                                    <Button
                                                        size="small"
                                                        variant="text"
                                                        startIcon={<Download />}
                                                        onClick={() => window.open(row.sitemap.url, '_blank')}
                                                        sx={{
                                                            textTransform: 'none',
                                                            color: '#4b5563',
                                                            '&:hover': { backgroundColor: '#f3f4f6' }
                                                        }}
                                                    >
                                                        Source
                                                    </Button>
                                                </Tooltip>
                                                {row.report.url && (
                                                    <Tooltip title="View Analysis Report">
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            startIcon={<Visibility />}
                                                            onClick={() => window.open(row.report.url, '_blank')}
                                                            sx={{
                                                                textTransform: 'none',
                                                                borderRadius: '8px',
                                                                backgroundColor: '#10b981',
                                                                '&:hover': { backgroundColor: '#059669' },
                                                                boxShadow: 'none',
                                                                fontWeight: 600
                                                            }}
                                                        >
                                                            Report
                                                        </Button>
                                                    </Tooltip>
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
