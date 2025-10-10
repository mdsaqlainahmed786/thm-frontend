import { Metadata } from "next";
export const metadata: Metadata = {
    title: "FAQs | Help & Support",
    description: "The Hotel Media",
};
import AdminLayout from "@/components/Layouts/AdminLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import FAQsTable from "./FAQsTable";
export default async function FAQs() {
    return (
        <AdminLayout isSearchable={false}>
            <Breadcrumb pageName="FAQs" />
            <div className="flex flex-col gap-10">
                <FAQsTable />
            </div>
        </AdminLayout>
    )
}