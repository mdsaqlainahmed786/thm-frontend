import { Metadata } from "next";
import HotelAdminLayout, { PageContent } from "@/components/Hotel/Layouts/AdminLayout";
import BookingManagementTemplate from "./BookingManagement";
export const metadata: Metadata = {
    title: "Booking Management",
};

export default function BookingManagement() {
    return (
        <HotelAdminLayout isSearchable={false}>
            <BookingManagementTemplate />
        </HotelAdminLayout>
    )
}