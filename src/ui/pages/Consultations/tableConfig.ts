import { GridColDef, GridValueFormatter } from '@mui/x-data-grid';

export interface ConsultationData {
  id: string;
  bookingId: string;
  accountName: string;
  subject: string;
  consultant: string;
  type: 'Vastu' | 'Astro';
  status: 'Completed' | 'Scheduled' | 'In Progress' | 'Cancelled' | 'No Show';
  creationDate: string;
  bookingDateTime: string;
  orderValue: number;
  userId: number;
  userProfileId: number | null,
  userLocationId: number | null;
}

export const consultationColumns: GridColDef[] = [
  {
    field: 'bookingId',
    headerName: 'Booking ID',
    width: 120,
    sortable: true,
    filterable: true,
  },
  {
    field: 'accountName',
    headerName: 'Account Name',
    width: 150,
    sortable: true,
    filterable: true,
  },
  {
    field: 'customerName',
    headerName: 'Customer Name',
    width: 150,
    sortable: true,
    filterable: true,
  },
  {
    field: 'consultant',
    headerName: 'Consultant',
    width: 180,
    sortable: true,
    filterable: true,
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 100,
    sortable: true,
    filterable: true,
    type: 'singleSelect',
    valueOptions: ['Vastu', 'Astro'],
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    sortable: true,
    filterable: true,
    type: 'singleSelect',
    valueOptions: ['Completed', 'Scheduled', 'In Progress', 'Cancelled'],
  },
  {
    field: 'creationDate',
    headerName: 'Creation Date',
    width: 130,
    sortable: true,
    filterable: true,
    type: 'date',
    valueGetter: (value) => value && new Date(value),
  },
  {
    field: 'bookingDateTime',
    headerName: 'Booking Date & Time',
    width: 180,
    sortable: true,
    filterable: true,
    type: 'dateTime',
    valueGetter: (value) => value && new Date(value),
  },
  {
    field: 'orderValue',
    headerName: 'Order Value',
    width: 120,
    sortable: true,
    filterable: true,
    type: 'number',
    valueFormatter: (value: number | null) => {
      if (value == null) {
        return '';
      }
      return `₹${value.toLocaleString()}`;
    },
  },
];