import { Metadata } from "next";
import HotelAdminLayout from "@/components/Hotel/Layouts/AdminLayout";
import RoomManagementTemplate from ".";
export const metadata: Metadata = {
    title: "Room Management",
};

export default function RoomManagement() {
    return (
        <HotelAdminLayout isSearchable={false}>
            <RoomManagementTemplate />
        </HotelAdminLayout>
    )
}