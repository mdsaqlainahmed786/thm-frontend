import { Metadata } from "next";
import HotelAdminLayout from "@/components/Hotel/Layouts/AdminLayout";
export const metadata: Metadata = {
    title: "Hotel Dashboard",
};
import Overview from ".";
export default function Dashboard() {
    return (
        <HotelAdminLayout isSearchable={false}>
            <Overview />
        </HotelAdminLayout >
    )
}