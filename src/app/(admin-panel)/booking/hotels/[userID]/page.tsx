import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Hotel Bookings",
    description: "The Hotel Media",
};

import AdminLayout from "@/components/Layouts/AdminLayout";
import HotelBookings from "./HotelBookings";
export default function Users({ params, searchParams }: { params: { userID: string }, searchParams?: { [key: string]: string | string[] | undefined }; }) {
    return (
        <>
            <AdminLayout isSearchable={true} searchPlaceholder="Search Booking ID" >
                <HotelBookings userID={params.userID} edit={false} />
            </AdminLayout>
        </>
    )
}