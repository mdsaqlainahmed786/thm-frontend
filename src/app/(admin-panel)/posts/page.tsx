import { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
export const metadata: Metadata = {
  title: "Posts",
  description: "The Hotel Media",
};
import AdminLayout from "@/components/Layouts/AdminLayout";
import PostTable from "./PostTable";
import PostEngagementChart from "@/components/Dashboard/PostEngagementChart";
import PostTypeDistributionChart from "@/components/Dashboard/PostTypeDistributionChart";

export default function Posts() {
  return (
    <>
      <AdminLayout
        isSearchable={true}
        searchPlaceholder="Search content, location"
      >
        <Breadcrumb pageName="Posts" />
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5 items-stretch">
            <div className="col-span-12 xl:col-span-8">
              <PostEngagementChart />
            </div>
            <div className="col-span-12 xl:col-span-4">
              <PostTypeDistributionChart />
            </div>
          </div>
          <PostTable />
        </div>
      </AdminLayout>
    </>
  );
}
