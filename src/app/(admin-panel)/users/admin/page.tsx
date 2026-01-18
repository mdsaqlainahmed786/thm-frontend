import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Administrators",
    description: "The Hotel Media",
};
import AdminLayout from "@/components/Layouts/AdminLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import AdminUsersTable from "./AdminUsersTable";

export default function AdminUsers() {
    return (
        <>
            <AdminLayout isSearchable={true} searchPlaceholder="Search Administrators">
                <Breadcrumb pageName="Administrators" />
                <div className="flex flex-col gap-10">
                    <AdminUsersTable />
                </div>
            </AdminLayout>
        </>
    )
}

