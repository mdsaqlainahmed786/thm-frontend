import { Metadata } from "next";
export const metadata: Metadata = {
    title: "User",
    description: "The Hotel Media",
};
import AdminLayout from "@/components/Layouts/AdminLayout";
import UserProfile from "./UserProfile";
export default function Users({ params, searchParams }: { params: { id: string }, searchParams?: { [key: string]: string | string[] | undefined }; }) {
    return (
        <>
            <AdminLayout isSearchable={false} >
                <UserProfile userID={params.id} edit={searchParams?.edit ? (searchParams?.edit === 'true' ? true : false) : false} />
            </AdminLayout>
        </>
    )
}