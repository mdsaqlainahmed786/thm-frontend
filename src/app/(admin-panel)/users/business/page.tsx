import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Business Users",
    description: "The Hotel Media",
};
import AdminLayout from "@/components/Layouts/AdminLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UsersTable from "../UsersTable";

export default async function Users() {
    return (
        <>
            <AdminLayout isSearchable={true} searchPlaceholder="Search Business">
                <Breadcrumb pageName="Users" />
                <div className="flex flex-col gap-10">
                    <UsersTable accountType={'business'} />
                </div>
            </AdminLayout>
        </>
    )
}