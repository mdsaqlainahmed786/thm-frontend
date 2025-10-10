import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
export const metadata: Metadata = {
    title: "Reviews",
    description: "The Hotel Media",
};
import AdminLayout from "@/components/Layouts/AdminLayout";
import ReviewTable from "./ReviewTable";
export default function Reviews() {
    return (
        <>
            <AdminLayout isSearchable={true} searchPlaceholder="Search question">
                <Breadcrumb pageName="Reviews" />
                <div className="flex flex-col gap-10">
                    <ReviewTable />
                </div>
            </AdminLayout>
        </>
    )
}