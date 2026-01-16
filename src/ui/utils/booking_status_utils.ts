import { BookingStatus } from "../../backend_api_client/models/booking";

function normalizeBookingStatus(value: BookingStatus): string {
    let r = value[0].toUpperCase() + value.substring(1);
    r = r.replaceAll('_', ' ');
    return r;
}