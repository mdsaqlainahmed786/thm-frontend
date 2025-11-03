import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
export const metadata: Metadata = {
    title: "Reported Content",
    description: "The Hotel Media",
};
import AdminLayout from "@/components/Layouts/AdminLayout";
import ReportsTable from "./ReportsTable";
export default function SubscriptionPlans() {
    return (
        <>
            <AdminLayout isSearchable={false}>
                <Breadcrumb pageName="Reported Content" />
                <div className="flex flex-col gap-10">
                    <ReportsTable />
                </div>
            </AdminLayout>
        </>
    )
}