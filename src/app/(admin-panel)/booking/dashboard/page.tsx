import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Booking Dashboard",
    description: "The Hotel Media",
};
import AdminLayout from "@/components/Layouts/AdminLayout";
import BookingDashboard from ".";
export default function Booking() {
    return (
        <>
            <AdminLayout isSearchable={false}>
                <div className="h-full">
                    <BookingDashboard />
                </div>
            </AdminLayout>
        </>
    )
}