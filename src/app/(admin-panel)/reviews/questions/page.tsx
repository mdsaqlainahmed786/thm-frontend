import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
export const metadata: Metadata = {
    title: "Review Questions",
    description: "The Hotel Media",
};
import AdminLayout from "@/components/Layouts/AdminLayout";
import ReviewQuestionTable from "../ReviewQuestionTable";
export default function ReviewQuestions() {
    return (
        <>
            <AdminLayout isSearchable={true} searchPlaceholder="Search question">
                <Breadcrumb pageName="Review Questions" />
                <div className="flex flex-col gap-10">
                    <ReviewQuestionTable />
                </div>
            </AdminLayout>
        </>
    )
}