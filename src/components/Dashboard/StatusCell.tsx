import React from 'react';
import { Chip } from '@mui/material';

interface StatusCellProps {
  status: string;
}

const StatusCell: React.FC<StatusCellProps> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Scheduled': return 'primary';
      case 'In Progress': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Chip
      label={status}
      color={getStatusColor(status) as any}
      size="small"
      variant="filled"
      sx={{
        fontWeight: 'bold',
        fontSize: '11px',
      }}
    />
  );
};

export default StatusCell;
