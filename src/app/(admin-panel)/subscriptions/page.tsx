import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
export const metadata: Metadata = {
    title: "Subscriptions",
    description: "The Hotel Media",
};
import AdminLayout from "@/components/Layouts/AdminLayout";
import SubscriptionTable from "./SubscriptionTable";
export default function Subscriptions() {
    return (
        <>
            <AdminLayout isSearchable={true} searchPlaceholder="Enter transaction ID, Order ID">
                <Breadcrumb pageName="Subscriptions" />
                <div className="flex flex-col gap-10">
                    <SubscriptionTable />
                </div>
            </AdminLayout>
        </>
    )
}