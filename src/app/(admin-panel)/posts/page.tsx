import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
export const metadata: Metadata = {
    title: "Posts",
    description: "The Hotel Media",
};
import AdminLayout from "@/components/Layouts/AdminLayout";
import PostTable from "./PostTable";
export default function Posts() {
    return (
        <>
            <AdminLayout isSearchable={true} searchPlaceholder="Search content, location">
                <Breadcrumb pageName="Posts" />
                <div className="flex flex-col gap-10">
                    <PostTable />
                </div>
            </AdminLayout>
        </>
    )
}