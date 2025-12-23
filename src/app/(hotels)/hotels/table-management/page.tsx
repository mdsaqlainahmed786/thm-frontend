import { Metadata } from "next";
import HotelAdminLayout, {
  PageContent,
} from "@/components/Hotel/Layouts/AdminLayout";
import TableManagementTemplate from "./TableManagement";
export const metadata: Metadata = {
  title: "Table Management",
};

export default function TableManagement() {
  return (
    <HotelAdminLayout isSearchable={false}>
      <TableManagementTemplate />
    </HotelAdminLayout>
  );
}
