import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Dashboard",
    description: "The Hotel Media",
};
import AdminLayout from "@/components/Layouts/AdminLayout";
import CardDataStatsWrapper from ".";
import TopReportedContent from "@/components/Dashboard/TopReportedContent";
export default function Dashboard() {
    return (
        <>
            <AdminLayout isSearchable={false}>
                <div className="h-full">
                    <CardDataStatsWrapper />
                    <TopReportedContent />
                </div>
            </AdminLayout>
        </>
    )
}