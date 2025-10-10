import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Profile",
    description: "The Hotel Media",
};
import AdminLayout from "@/components/Layouts/AdminLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { getServerSession } from "next-auth";
import MyProfile from "./Profile";
import authOptions from "@/utils/authOptions";
import { redirect } from "next/navigation";
import { LOGIN_ROUTE } from "@/types/auth";
export default async function Profile() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return redirect(LOGIN_ROUTE);
    }
    return (
        <>
            <AdminLayout isSearchable={false}>
                <div className="mx-auto max-w-242.5">
                    <Breadcrumb pageName="Profile" />
                    <MyProfile userID={session?.user._id} />
                </div>
            </AdminLayout>
        </>
    )
}