export interface StaffMember {
    id: string;
    name: string;
    email: string;
    designation?: string;
    phone?: string;
    contact_number?: string;
    photo?: string;
    assigned_services?: string[];
    status?: string;
    type?: string;
    total_bookings?: number;
    avg_rating?: number;
    total_commission?: number;
    additional_information?: string;
}

export interface StaffResponse {
    data: {
        response: {
            returnvalue: {
                data: StaffMember[];
            };
        };
    };
}
