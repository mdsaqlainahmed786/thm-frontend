import { Metadata } from "next";
import HotelAdminLayout from "@/components/Hotel/Layouts/AdminLayout";
import SupportTemplate from ".";
export const metadata: Metadata = {
    title: "Support",
};

export default function Support() {

    return (
        <HotelAdminLayout isSearchable={false}>
            <SupportTemplate />
        </HotelAdminLayout>
    )
}