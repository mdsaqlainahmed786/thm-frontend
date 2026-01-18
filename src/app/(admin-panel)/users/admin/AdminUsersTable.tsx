"use client";
import { useQuery } from "@tanstack/react-query";
import { handleClientApiErrors } from "@/api-services/api-errors";
import toast from "react-hot-toast";
import { User } from "@/types/user";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import Button from "@/components/Button";
import { useSearchInput } from "@/context/SearchProvider";
import { fetchAllUsers } from "@/api-services/user";
import { DefaultCoverPic } from "@/components/Profile";
import TableSkeleton from "@/components/Loading/TableSkeleton";

const AdminUsersTable: React.FC = () => {
  const { value } = useSearchInput();
  const route = useRouter();
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(value);
    }, 600);
    return () => {
      clearTimeout(timerId);
    };
  }, [value]);

  const {
    isPending,
    isError,
    error,
    data,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [
      "all-users",
      debouncedTerm,
      accountTypeFilter,
      roleFilter,
      sortOrder,
    ],
    queryFn: () => {
      const params: { query?: string; accountType?: string; role?: string; sortOrder?: "asc" | "desc" } = {};
      
      if (debouncedTerm) params.query = debouncedTerm;
      if (accountTypeFilter) params.accountType = accountTypeFilter;
      if (roleFilter) params.role = roleFilter;
      if (sortOrder) params.sortOrder = sortOrder;

      return fetchAllUsers(params);
    },
  });

  // Filter users on client side if needed (backend already filters, but we keep this for local search)
  const filteredUsers = data || [];

  return (
    <>
      <div className="col-span-12 xl:col-span-7">
        <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h4 className="text-title-sm2 font-bold text-black dark:text-white">
                All Users
              </h4>
              <p className="text-sm text-bodydark2 mt-1">
                Total: {filteredUsers.length} users
              </p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="mb-0 block font-medium tracking-wide text-black text-sm dark:text-white whitespace-nowrap">
                  Account Type:
                </label>
                <select
                  className="relative z-20 w-full cursor-pointer appearance-none rounded border border-stroke bg-transparent px-4 py-1.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-boxdark text-black dark:text-white text-sm min-w-[150px]"
                  value={accountTypeFilter}
                  onChange={(e) => setAccountTypeFilter(e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="individual">Individual</option>
                  <option value="business">Business</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="mb-0 block font-medium tracking-wide text-black text-sm dark:text-white whitespace-nowrap">
                  Role:
                </label>
                <select
                  className="relative z-20 w-full cursor-pointer appearance-none rounded border border-stroke bg-transparent px-4 py-1.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-boxdark text-black dark:text-white text-sm min-w-[120px]"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="administrator">Administrator</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="mb-0 block font-medium tracking-wide text-black text-sm dark:text-white whitespace-nowrap">
                  Sort Order:
                </label>
                <select
                  className="relative z-20 w-full cursor-pointer appearance-none rounded border border-stroke bg-transparent px-4 py-1.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-boxdark text-black dark:text-white text-sm min-w-[100px]"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </div>
          <div className="max-w-full overflow-x-auto no-scrollbar">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                    Name
                  </th>
                  <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                    Role
                  </th>
                  <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                    Account Type
                  </th>
                  <th className="min-w-[180px] px-4 py-4 font-medium text-black dark:text-white">
                    Account Status
                  </th>
                  <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                    Followers
                  </th>
                  <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                    Phone Number
                  </th>
                  <th className="min-w-[140px] px-4 py-4 font-medium text-black dark:text-white">
                    Created
                  </th>
                  <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isFetching || isPending ? (
                  <>
                    {[...Array(5)].map((_, index) => (
                      <tr
                        key={index}
                        className="border-b border-stroke dark:border-strokedark"
                      >
                        <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="h-12.5 w-15 rounded-md bg-gray-200 dark:bg-boxdark-hover animate-pulse"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 w-32 rounded bg-gray-200 dark:bg-boxdark-hover animate-pulse"></div>
                              <div className="h-3 w-24 rounded bg-gray-200 dark:bg-boxdark-hover animate-pulse"></div>
                              <div className="h-3 w-16 rounded bg-gray-200 dark:bg-boxdark-hover animate-pulse"></div>
                            </div>
                          </div>
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          <div className="h-4 w-20 rounded bg-gray-200 dark:bg-boxdark-hover animate-pulse"></div>
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          <div className="h-4 w-20 rounded bg-gray-200 dark:bg-boxdark-hover animate-pulse"></div>
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          <div className="flex items-center gap-1.5">
                            <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-boxdark-hover animate-pulse"></div>
                            <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-boxdark-hover animate-pulse"></div>
                            <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-boxdark-hover animate-pulse"></div>
                          </div>
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          <div className="h-4 w-8 rounded bg-gray-200 dark:bg-boxdark-hover animate-pulse"></div>
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          <div className="h-4 w-20 rounded bg-gray-200 dark:bg-boxdark-hover animate-pulse"></div>
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          <div className="space-y-2">
                            <div className="h-3 w-32 rounded bg-gray-200 dark:bg-boxdark-hover animate-pulse"></div>
                            <div className="h-3 w-20 rounded bg-gray-200 dark:bg-boxdark-hover animate-pulse"></div>
                          </div>
                        </td>
                        <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                          <div className="flex items-center gap-3.5">
                            <div className="h-8 w-8 rounded bg-gray-200 dark:bg-boxdark-hover animate-pulse"></div>
                            <div className="h-8 w-8 rounded bg-gray-200 dark:bg-boxdark-hover animate-pulse"></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : isError ? (
                  <tr>
                    <td colSpan={8} className="border-b border-[#eee] px-4 py-5 dark:border-strokedark text-center">
                      <p className="text-red-500">Error loading users. Please try again.</p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="border-b border-[#eee] px-4 py-5 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">No users found.</p>
                    </td>
                  </tr>
                ) : (
                  <>
                    {filteredUsers.map((user, key) => {
                      return (
                        <tr key={key}>
                          <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                              <div className="h-12.5 w-15 rounded-md">
                                {user.accountType === "business" ? (
                                  <Image
                                    src={
                                      user.businessProfileRef?.profilePic?.small
                                        ? user.businessProfileRef?.profilePic?.small
                                        : DefaultCoverPic
                                    }
                                    alt={user.name}
                                    width={48}
                                    height={48}
                                    className="rounded-full"
                                  />
                                ) : (
                                  <Image
                                    src={
                                      user?.profilePic?.small
                                        ? user?.profilePic?.small
                                        : DefaultCoverPic
                                    }
                                    alt={user.name}
                                    width={48}
                                    height={48}
                                    className="rounded-full"
                                  />
                                )}
                              </div>
                              <div>
                                <h5 className="font-semibold text-black dark:text-white">
                                  {user.name}
                                  <small> ({user.username})</small>
                                </h5>
                                <p className="text-sm text-black dark:text-white mb-1">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white text-sm font-medium capitalize">
                              {user.role || "user"}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-xs font-medium capitalize text-black dark:text-white">
                              {user.accountType}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <div className="flex items-center justify-start gap-1.5 flex-wrap">
                              <p
                                className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium whitespace-nowrap ${
                                  user.isActivated
                                    ? "bg-success text-success"
                                    : "bg-danger text-danger"
                                }`}
                              >
                                {user.isActivated ? "Active" : "Inactive"}
                              </p>
                              <p
                                className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium whitespace-nowrap ${
                                  user.isVerified
                                    ? "bg-success text-success"
                                    : "bg-danger text-danger"
                                }`}
                              >
                                {user.isVerified ? "Verified" : "Unverified"}
                              </p>
                              <p
                                className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium whitespace-nowrap ${
                                  user.isApproved
                                    ? "bg-success text-success"
                                    : "bg-danger text-danger"
                                }`}
                              >
                                {user.isApproved ? "Approved" : "Pending"}
                              </p>
                            </div>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white text-sm font-semibold">
                              {user.followersCount ?? 0}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white text-sm font-medium">
                              {user.dialCode}-{user.phoneNumber}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <p className="text-black dark:text-white text-xs font-semibold">
                              {moment(user.createdAt).format(
                                "ddd DD, MMM YYYY hh:mm:ss A"
                              )}
                            </p>
                            <p className="text-xs font-medium">
                              {moment(user.createdAt).fromNow()}
                            </p>
                          </td>
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <div className="flex items-center space-x-3.5">
                              <Button.Edit
                                onClick={() => {
                                  route.push(`/users/${user._id}?edit=true`);
                                }}
                              />
                              <Button.View
                                onClick={() => {
                                  route.push(`/users/${user._id}`);
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUsersTable;
