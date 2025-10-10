import { Metadata } from "next";
import AdminLayout from "@/components/Layouts/AdminLayout";
import BookingTemplate from "./Booking";


export const metadata: Metadata = {
    title: "Booking",
    description: "The Hotel Media",
};


export default function Booking({ params, searchParams }: { params: { id: string }, searchParams?: { [key: string]: string | string[] | undefined }; }) {
    return (
        <>
            <AdminLayout isSearchable={false} >
                <BookingTemplate bookingID={params.id} edit={false} />
            </AdminLayout>
        </>
    )
}