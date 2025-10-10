import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
export const metadata: Metadata = {
    title: "Subscriptions",
    description: "The Hotel Media",
};
import AdminLayout from "@/components/Layouts/AdminLayout";
import SubscriptionPlansTable from "./SubscriptionPlansTable";
export default function SubscriptionPlans() {
    return (
        <>
            <AdminLayout isSearchable={false}>
                <Breadcrumb pageName="Subscription Plans" />
                <div className="flex flex-col gap-10">
                    <SubscriptionPlansTable />
                </div>
            </AdminLayout>
        </>
    )
}