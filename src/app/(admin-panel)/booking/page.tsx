import { Metadata } from "next";
export const metadata: Metadata = {
    title: "All Bookings",
    description: "The Hotel Media",
};
import AdminLayout from "@/components/Layouts/AdminLayout";
import AllBookings from ".";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
export default function Booking() {
    return (
        <>
            <AdminLayout isSearchable={false}>
                <Breadcrumb pageName="All Bookings" />
                <div className="h-full">
                    <div className="col-span-12 xl:col-span-7">
                        <div className="rounded-sm border border-stroke bg-white px-5  py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
                            <div className="mb-6 flex justify-between">
                                <div>
                                    <h4 className="text-title-sm2 font-bold text-black dark:text-white">
                                        All Bookings
                                    </h4>
                                </div>
                            </div>
                            <AllBookings />
                        </div >
                    </div >
                </div>
            </AdminLayout>
        </>
    )
}