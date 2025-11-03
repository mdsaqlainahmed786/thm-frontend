import { Metadata } from "next";
import HotelAdminLayout from "@/components/Hotel/Layouts/AdminLayout";
import { PageTitle } from "@/components/Hotel/Layouts/AdminLayout";
import BankDetailTemplate from ".";
export const metadata: Metadata = {
    title: "Bank Detail",
};

export default function BankDetail() {
    return (
        <HotelAdminLayout isSearchable={false}>
            <BankDetailTemplate />
        </HotelAdminLayout>
    )
}