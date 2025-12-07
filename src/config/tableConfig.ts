import { GridColDef, GridValueFormatter } from '@mui/x-data-grid';

export interface ConsultationData {
  id: string;
  bookingId: string;
  accountName: string;
  customerName: string;
  consultant: string;
  type: 'Vastu' | 'Astro';
  status: 'Completed' | 'Scheduled' | 'In Progress' | 'Cancelled';
  creationDate: string;
  bookingDateTime: string;
  orderValue: number;
  userId?: number | null; // User ID from booking data for navigation
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

// Dummy data for the table
export const dummyConsultationData: ConsultationData[] = [
  {
    id: '1',
    bookingId: 'BK001',
    accountName: 'Rajesh Kumar',
    customerName: 'Priya Kumar',
    consultant: 'Dr. Arun Sharma',
    type: 'Vastu',
    status: 'Completed',
    creationDate: '2024-01-15',
    bookingDateTime: '2024-01-20T10:00:00',
    orderValue: 5000,
  },
  {
    id: '2',
    bookingId: 'BK002',
    accountName: 'Sunita Patel',
    customerName: 'Sunita Patel',
    consultant: 'Pandit Vishnu Prasad',
    type: 'Astro',
    status: 'Scheduled',
    creationDate: '2024-01-18',
    bookingDateTime: '2024-01-25T14:00:00',
    orderValue: 3500,
  },
  {
    id: '3',
    bookingId: 'BK003',
    accountName: 'Amit Gupta',
    customerName: 'Neha Gupta',
    consultant: 'Dr. Arun Sharma',
    type: 'Vastu',
    status: 'In Progress',
    creationDate: '2024-01-20',
    bookingDateTime: '2024-01-22T11:30:00',
    orderValue: 7500,
  },
  {
    id: '4',
    bookingId: 'BK004',
    accountName: 'Vikram Singh',
    customerName: 'Rekha Singh',
    consultant: 'Pandit Vishnu Prasad',
    type: 'Astro',
    status: 'Completed',
    creationDate: '2024-01-12',
    bookingDateTime: '2024-01-18T16:00:00',
    orderValue: 4200,
  },
  {
    id: '5',
    bookingId: 'BK005',
    accountName: 'Meera Sharma',
    customerName: 'Meera Sharma',
    consultant: 'Dr. Rashmi Jain',
    type: 'Vastu',
    status: 'Cancelled',
    creationDate: '2024-01-22',
    bookingDateTime: '2024-01-28T09:00:00',
    orderValue: 6000,
  },
  {
    id: '6',
    bookingId: 'BK006',
    accountName: 'Deepak Agarwal',
    customerName: 'Pooja Agarwal',
    consultant: 'Dr. Arun Sharma',
    type: 'Vastu',
    status: 'Scheduled',
    creationDate: '2024-01-25',
    bookingDateTime: '2024-02-01T15:30:00',
    orderValue: 8500,
  },
  {
    id: '7',
    bookingId: 'BK007',
    accountName: 'Ravi Verma',
    customerName: 'Kavita Verma',
    consultant: 'Pandit Vishnu Prasad',
    type: 'Astro',
    status: 'In Progress',
    creationDate: '2024-01-26',
    bookingDateTime: '2024-01-30T12:00:00',
    orderValue: 4800,
  },
  {
    id: '8',
    bookingId: 'BK008',
    accountName: 'Sanjay Mishra',
    customerName: 'Anita Mishra',
    consultant: 'Dr. Rashmi Jain',
    type: 'Vastu',
    status: 'Completed',
    creationDate: '2024-01-14',
    bookingDateTime: '2024-01-19T13:45:00',
    orderValue: 5500,
  },
  {
    id: '9',
    bookingId: 'BK009',
    accountName: 'Manoj Tiwari',
    customerName: 'Shanti Tiwari',
    consultant: 'Pandit Vishnu Prasad',
    type: 'Astro',
    status: 'Scheduled',
    creationDate: '2024-01-28',
    bookingDateTime: '2024-02-03T10:15:00',
    orderValue: 3800,
  },
  {
    id: '10',
    bookingId: 'BK010',
    accountName: 'Rahul Joshi',
    customerName: 'Priyanka Joshi',
    consultant: 'Dr. Arun Sharma',
    type: 'Vastu',
    status: 'Completed',
    creationDate: '2024-01-16',
    bookingDateTime: '2024-01-21T17:00:00',
    orderValue: 6500,
  },
];
