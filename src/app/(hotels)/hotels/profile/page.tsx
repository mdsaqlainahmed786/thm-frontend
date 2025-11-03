import { Metadata } from "next";
import HotelAdminLayout, { PageContent, PageTitle } from "@/components/Hotel/Layouts/AdminLayout";
import ProfileComponent from "@/components/Hotel/Profile";
export const metadata: Metadata = {
    title: "Profile",
};
export default function Profile() {
    return (
        <HotelAdminLayout isSearchable={false}>
            <ProfileComponent />
        </HotelAdminLayout>
    )
}