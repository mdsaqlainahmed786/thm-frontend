import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Users",
  description: "The Hotel Media",
};
import AdminLayout from "@/components/Layouts/AdminLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UsersTable from "./UsersTable";
export default function Users() {
  return (
    <>
      <AdminLayout isSearchable={false} searchPlaceholder="Search Users">
        <Breadcrumb pageName="Users" />
        <div className="flex flex-col gap-10">
          <UsersTable />
        </div>
      </AdminLayout>
    </>
  );
}
