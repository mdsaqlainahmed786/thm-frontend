import { Metadata } from "next";
import HotelAdminLayout from "@/components/Hotel/Layouts/AdminLayout";
import TransactionTemplate from "./Transaction";
export const metadata: Metadata = {
    title: "Transaction",
};

export default function Transaction() {
    return (
        <HotelAdminLayout isSearchable={false}>
            <TransactionTemplate />
        </HotelAdminLayout>
    )
}