import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Contact | Help & Support",
    description: "The Hotel Media",
};
import AdminLayout from "@/components/Layouts/AdminLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { getServerSession } from "next-auth";

import authOptions from "@/utils/authOptions";
import { redirect } from "next/navigation";
import { LOGIN_ROUTE } from "@/types/auth";
import ContactTable from "./ContactTable";
export default async function Contacts() {

    return (
        <>
            <AdminLayout isSearchable={false}>
                <Breadcrumb pageName="Contacts" />
                <div className="flex flex-col gap-10">
                    <ContactTable />
                </div>
            </AdminLayout>
        </>
    )
}