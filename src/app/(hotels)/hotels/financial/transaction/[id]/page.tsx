import { Metadata } from "next";
import HotelAdminLayout from "@/components/Hotel/Layouts/AdminLayout";

export const metadata: Metadata = {
    title: "Transaction",
};

export default function TransactionDetails() {
    return (
        <HotelAdminLayout isSearchable={false}>
            <>kd</>
        </HotelAdminLayout>
    )
}