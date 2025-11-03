import { Metadata } from "next";
import HotelAdminLayout from "@/components/Hotel/Layouts/AdminLayout";
import BookingDetailsTemplate from "./BookingDetails";
export const metadata: Metadata = {
    title: "Booking Details",
};

export default function BookingDetails({ params, searchParams }: { params: { id: string }, searchParams?: { [key: string]: string | string[] | undefined }; }) {
    return (
        <HotelAdminLayout isSearchable={false}>
            <BookingDetailsTemplate bookingID={params.id} edit={false} />
        </HotelAdminLayout>
    )
}