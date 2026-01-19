"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { handleClientApiErrors } from "@/api-services/api-errors";
import toast from "react-hot-toast";
import { User } from "@/types/user";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import Button from "@/components/Button";
import { useSearchInput } from "@/context/SearchProvider";
import { fetchAllUsers, demoteAdmin } from "@/api-services/user";
import { DefaultCoverPic } from "@/components/Profile";

const AdminUsersTable: React.FC = () => {
  const { value } = useSearchInput();
  const route = useRouter();
  const queryClient = useQueryClient();
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [demotingId, setDemotingId] = useState<string | null>(null);

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
    queryKey: ["administrators"],
    queryFn: () => {
      return fetchAllUsers();
    },
  });

  // Client-side filtering by search term only (backend always returns administrators)
  const filteredUsers = (data || []).filter((user: User) => {
    if (!debouncedTerm) return true;
    const searchTerm = debouncedTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchTerm) ||
      user.username?.toLowerCase().includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm)
    );
  });

  const handleDemoteAdmin = async (userID: string) => {
    if (!confirm("Are you sure you want to demote this administrator to a regular user?")) {
      return;
    }

    setDemotingId(userID);
    try {
      const result = await demoteAdmin(userID);
      if (result) {
        // Refetch administrators list
        await queryClient.invalidateQueries({ queryKey: ["administrators"] });
      }
    } catch (error) {
      // Error handling is done in the API service
    } finally {
      setDemotingId(null);
    }
  };

  return (
    <>
      <div className="col-span-12 xl:col-span-7">
        <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h4 className="text-title-sm2 font-bold text-black dark:text-white">
                Administrators
              </h4>
              <p className="text-sm text-bodydark2 mt-1">
                Total: {filteredUsers.length} administrator{filteredUsers.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="max-w-full overflow-x-auto no-scrollbar">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                    Name
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
                  <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
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
                            </div>
                          </div>
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
                    <td colSpan={7} className="border-b border-[#eee] px-4 py-5 dark:border-strokedark text-center">
                      <p className="text-red-500">Error loading administrators. Please try again.</p>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="border-b border-[#eee] px-4 py-5 dark:border-strokedark text-center">
                      <p className="text-black dark:text-white">
                        {debouncedTerm ? "No administrators found matching your search." : "No administrators found."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  <>
                    {filteredUsers.map((user: User, key: number) => {
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
                              {user.email !== "admin@thehotelmedia.com" && (
                                <button
                                  onClick={() => handleDemoteAdmin(user._id)}
                                  disabled={demotingId === user._id}
                                  className="flex h-8 w-8 items-center justify-center rounded border border-danger bg-danger text-white hover:bg-danger/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Demote Administrator"
                                >
                                  {demotingId === user._id ? (
                                    <svg
                                      className="animate-spin h-4 w-4"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                  ) : (
                                    <svg
                                      className="h-4 w-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  )}
                                </button>
                              )}
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