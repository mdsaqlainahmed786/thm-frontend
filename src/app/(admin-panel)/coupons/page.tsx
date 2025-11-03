import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
export const metadata: Metadata = {
    title: "Coupons",
    description: "The Hotel Media",
};
import AdminLayout from "@/components/Layouts/AdminLayout";
import CouponTable from "./CouponTable";
export default function Coupons() {
    return (
        <>
            <AdminLayout isSearchable={false}>
                <Breadcrumb pageName="Coupons" />
                <div className="flex flex-col gap-10">
                    <CouponTable />
                </div>
            </AdminLayout>
        </>
    )
}