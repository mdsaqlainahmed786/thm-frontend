import { Metadata } from "next";
import HotelAdminLayout from "@/components/Hotel/Layouts/AdminLayout";
import PriceControlTemplate from "./PriceControl";
export const metadata: Metadata = {
    title: "Price Control",
};

export default function PriceControl() {
    return (
        <HotelAdminLayout isSearchable={false}>
            <PriceControlTemplate />
        </HotelAdminLayout>
    )
}