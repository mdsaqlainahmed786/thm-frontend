"use client";
import { useMutation, useQuery, keepPreviousData } from "@tanstack/react-query";
import { User } from "@/types/user";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import Paginator from "@/components/Paginator";
import Button from "@/components/Button";
import { useSearchInput } from "@/context/SearchProvider";
import { ListIcon, DownArrowIcon } from "@/components/Icons";
import { fetchNthSignupUser, fetchUsers } from "@/api-services/user";
import {
  fetchBusinessSubtypes,
  fetchBusinessTypes,
} from "@/api-services/business";
import { DefaultCoverPic } from "@/components/Profile";
import TableSkeleton from "@/components/Loading/TableSkeleton";
import UserGrowthChart from "@/components/Dashboard/UserGrowthChart";
const UsersTable: React.FC<{ accountType?: string | undefined }> = ({
  accountType,
}) => {
  const { value } = useSearchInput();
  const route = useRouter();
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResources, setTotalResources] = useState(0);
  const initialApiParams = {
    businessTypeID: "",
    businessSubTypeID: "",
  };
  const [apiParams, setApiParams] = useState(initialApiParams);
  const [sortBy, setSortBy] = useState<
    | "none"
    | "created_last_1_hour"
    | "created_last_1_day"
    | "created_last_1_week"
    | "created_last_1_month"
    | "created_last_1_year"
    | "followers"
  >("none");
  const [sortOrder, setSortOrder] = useState<"asc" | "dsc" | null>(null);
  const [showSortOrderModal, setShowSortOrderModal] = useState(false);

  const [nthPreset, setNthPreset] = useState<"100" | "1000" | "custom">("100");
  const [customNth, setCustomNth] = useState<string>("");
  const [includeAdmins, setIncludeAdmins] = useState(false);
  const [nthResult, setNthResult] = useState<
    | null
    | {
        n: number;
        user: {
          _id: string;
          name: string;
          email: string;
          createdAt: string;
        };
      }
  >(null);
  const [nthError, setNthError] = useState<string | null>(null);

  const nthSignupMutation = useMutation({
    mutationFn: async (payload: { n: number; includeAdmins: boolean }) => {
      return fetchNthSignupUser(payload.n, payload.includeAdmins);
    },
    onSuccess: (result) => {
      setNthError(null);
      setNthResult(result);
    },
    onError: (error: any) => {
      setNthResult(null);
      setNthError(error?.message ?? "Failed to fetch nth signup user");
    },
  });

  const getNthValue = () => {
    if (nthPreset === "custom") {
      const parsed = Number(customNth);
      return Number.isFinite(parsed) ? parsed : NaN;
    }
    return Number(nthPreset);
  };

  const handleFetchNthSignup = () => {
    setNthError(null);
    const n = getNthValue();
    if (!Number.isInteger(n) || n <= 0) {
      setNthResult(null);
      setNthError("Please enter a positive integer (1, 2, 3, …).");
      return;
    }
    nthSignupMutation.mutate({ n, includeAdmins });
  };
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(value);
      setPageNo(1);
    }, 600);
    return () => {
      clearTimeout(timerId);
    };
  }, [value]);
  useEffect(() => {
    setPageNo(1);
    if (sortBy !== "followers") {
      setSortOrder(null);
    }
  }, [sortBy]);
  const {
    isPending,
    isError,
    error,
    data,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: [
      "users",
      debouncedTerm,
      pageNo,
      accountType,
      apiParams.businessTypeID,
      apiParams.businessSubTypeID,
      sortBy,
      sortOrder,
    ],
    queryFn: () => {
      const params: { [key: string]: any } = {
        query: debouncedTerm,
        documentLimit: 20,
        pageNumber: pageNo,
        accountType: accountType,
        businessTypeID: apiParams.businessTypeID,
        businessSubTypeID: apiParams.businessSubTypeID,
      };

      if (sortBy !== "none") {
        params.sortBy = sortBy;
      }

      if (sortBy === "followers" && sortOrder) {
        params.sortOrder = sortOrder;
      }

      return fetchUsers(params);
    },
    placeholderData: keepPreviousData,
  });
  const { data: businessTypes, refetch: refetchBusinessTypes } = useQuery({
    queryKey: ["business-types"],
    queryFn: () => fetchBusinessTypes(),
    placeholderData: keepPreviousData,
  });
  const { data: businessSubTypes, refetch: fetchBusinessSubTypes } = useQuery({
    queryKey: ["business-subtypes", apiParams.businessTypeID],
    queryFn: () => fetchBusinessSubtypes(apiParams.businessTypeID),
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    if (data) {
      setTotalResources(data?.totalResources ?? 0);
      setTotalPages(data?.totalPages ?? 0);
    }
  }, [data]);
  return (
    <>
          <UserGrowthChart accountType={accountType} />
      <div className="col-span-12 xl:col-span-7 -mt-10">
        <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h4 className="text-title-sm2 font-bold text-black dark:text-white">
                {accountType && accountType === "business"
                  ? "Business User"
                  : "Users"}
              </h4>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              {accountType !== "business" && (
                <div
                  className={`flex items-center gap-2 ${
                    sortBy === "followers" ? "mr-25" : ""
                  }`}
                >
                  <label className="mb-0 block font-medium tracking-wide text-black text-sm dark:text-white whitespace-nowrap">
                    Sort by:
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative z-20 bg-white dark:bg-boxdark">
                      <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                        <ListIcon width={16} height={16} />
                      </span>
                      <select
                        className="relative z-20 w-full cursor-pointer appearance-none rounded border border-stroke bg-transparent px-10 py-1.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-boxdark text-black dark:text-white text-sm min-w-[180px]"
                        onChange={(e) =>
                          setSortBy(
                            e.target.value as
                              | "none"
                              | "created_last_1_hour"
                              | "created_last_1_day"
                              | "created_last_1_week"
                              | "created_last_1_month"
                              | "created_last_1_year"
                              | "followers"
                          )
                        }
                        value={sortBy}
                      >
                        <option
                          value="none"
                          className="text-body cursor-pointer dark:text-white dark:bg-boxdark"
                        >
                          None
                        </option>
                        <option
                          value="created_last_1_hour"
                          className="text-body cursor-pointer dark:text-white dark:bg-boxdark"
                        >
                          Last 1 Hour
                        </option>
                        <option
                          value="created_last_1_day"
                          className="text-body cursor-pointer dark:text-white dark:bg-boxdark"
                        >
                          Last 1 Day
                        </option>
                        <option
                          value="created_last_1_week"
                          className="text-body cursor-pointer dark:text-white dark:bg-boxdark"
                        >
                          Last 1 Week
                        </option>
                        <option
                          value="created_last_1_month"
                          className="text-body cursor-pointer dark:text-white dark:bg-boxdark"
                        >
                          Last 1 Month
                        </option>
                        <option
                          value="created_last_1_year"
                          className="text-body cursor-pointer dark:text-white dark:bg-boxdark"
                        >
                          Last 1 Year
                        </option>
                        <option
                          value="followers"
                          className="text-body cursor-pointer dark:text-white dark:bg-boxdark"
                        >
                          Sort by Followers
                        </option>
                        <option
                          value="disapproved"
                          className="text-body cursor-pointer dark:text-white dark:bg-boxdark"
                        >
                          Disapproved
                        </option>
                        <option
                          value="unVerified"
                          className="text-body cursor-pointer dark:text-white dark:bg-boxdark"
                        >
                          Unverified
                        </option>
                        <option
                          value="inActive"
                          className="text-body cursor-pointer dark:text-white dark:bg-boxdark"
                        >
                          Inactive
                        </option>
                      </select>
                      <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2 pointer-events-none">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-body dark:text-white"
                        >
                          <g opacity="0.8">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                              fill="currentColor"
                            />
                          </g>
                        </svg>
                      </span>
                    </div>
                    {sortBy === "followers" && (
                      <div
                        className="relative"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowSortOrderModal(!showSortOrderModal);
                        }}
                        role="button"
                      >
                        <button
                          type="button"
                          className="flex items-center justify-center w-8 h-8 rounded border border-stroke bg-transparent hover:bg-gray-2 dark:border-form-strokedark dark:bg-boxdark dark:hover:bg-meta-4 transition-colors"
                          aria-label="Sort order options"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-body dark:text-white"
                          >
                            <path
                              d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        {showSortOrderModal && (
                          <div className="absolute left-0 top-full mt-1 z-50 min-w-[180px] rounded border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
                            <div className="py-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setSortOrder("dsc");
                                  setShowSortOrderModal(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-2 dark:hover:bg-meta-4 transition-colors ${
                                  sortOrder === "dsc"
                                    ? "bg-primary/10 text-primary dark:bg-primary/20"
                                    : ""
                                }`}
                              >
                                Sort from more to less
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSortOrder("asc");
                                  setShowSortOrderModal(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-2 dark:hover:bg-meta-4 transition-colors ${
                                  sortOrder === "asc"
                                    ? "bg-primary/10 text-primary dark:bg-primary/20"
                                    : ""
                                }`}
                              >
                                Sort from less to more
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {accountType === "business" ? (
                <div className="flex gap-3">
                  <div>
                    <label className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">
                      Business Type
                    </label>
                    <div className="relative z-20 bg-white dark:bg-form-input">
                      <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                        <ListIcon width={16} height={16} />
                      </span>
                      <select
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-10 py-1.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white text-sm"
                        onChange={(e) =>
                          setApiParams({
                            ...apiParams,
                            businessTypeID: e.target.value,
                          })
                        }
                        value={apiParams.businessTypeID}
                      >
                        <option
                          value=""
                          disabled={false}
                          className="text-body dark:text-bodydark"
                        >
                          --Please select--
                        </option>
                        {businessTypes &&
                          businessTypes.map((data, index) => (
                            <option
                              key={index}
                              value={data.id}
                              className="text-body dark:text-bodydark"
                            >
                              {data.name}
                            </option>
                          ))}
                      </select>
                      <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                        <DownArrowIcon width={16} height={16} />
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">
                      Business Subtype
                    </label>
                    <div className="relative z-20 bg-white dark:bg-form-input">
                      <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                        <ListIcon width={16} height={16} />
                      </span>
                      <select
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-10 py-1.5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white text-sm"
                        onChange={(e) =>
                          setApiParams({
                            ...apiParams,
                            businessSubTypeID: e.target.value,
                          })
                        }
                        value={apiParams.businessSubTypeID}
                      >
                        <option
                          value=""
                          disabled={false}
                          className="text-body dark:text-bodydark"
                        >
                          --Please select--
                        </option>
                        {businessSubTypes &&
                          businessSubTypes.map((data, index) => (
                            <option
                              key={index}
                              value={data.id}
                              className="text-body dark:text-bodydark"
                            >
                              {data.name}
                            </option>
                          ))}
                      </select>
                      <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                        <DownArrowIcon width={16} height={16} />
                      </span>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      className={`rounded px-2 py-1.5  text-white transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input  text-sm ${
                        apiParams.businessTypeID !== ""
                          ? "bg-primary"
                          : "bg-primary/20"
                      }`}
                      disabled={apiParams.businessTypeID !== "" ? false : true}
                      onClick={(e) => {
                        setApiParams(initialApiParams);
                      }}
                    >
                      <svg
                        className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                        role="button"
                        width="22"
                        height="22"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.35355 3.35355C9.54882 3.15829 9.54882 2.84171 9.35355 2.64645C9.15829 2.45118 8.84171 2.45118 8.64645 2.64645L6 5.29289L3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L5.29289 6L2.64645 8.64645C2.45118 8.84171 2.45118 9.15829 2.64645 9.35355C2.84171 9.54882 3.15829 9.54882 3.35355 9.35355L6 6.70711L8.64645 9.35355C8.84171 9.54882 9.15829 9.54882 9.35355 9.35355C9.54882 9.15829 9.54882 8.84171 9.35355 8.64645L6.70711 6L9.35355 3.35355Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Nth signup lookup */}
          <div className="mb-6 rounded border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark-2">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h5 className="text-base font-semibold text-black dark:text-white">
                  Nth signup lookup
                </h5>
                <p className="text-xs text-bodydark2 dark:text-bodydark">
                  Fetch the Nth created account (createdAt asc, _id asc). Deleted users excluded.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
                <div>
                  <label className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">
                    N
                  </label>
                  <select
                    className="w-full cursor-pointer appearance-none rounded border border-stroke bg-transparent px-4 py-2 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-boxdark text-black dark:text-white text-sm min-w-[140px]"
                    value={nthPreset}
                    onChange={(e) => {
                      setNthPreset(e.target.value as any);
                      setNthError(null);
                      setNthResult(null);
                    }}
                  >
                    <option value="100" className="dark:bg-boxdark">
                      100
                    </option>
                    <option value="1000" className="dark:bg-boxdark">
                      1000
                    </option>
                    <option value="custom" className="dark:bg-boxdark">
                      Custom
                    </option>
                  </select>
                </div>

                {nthPreset === "custom" && (
                  <div>
                    <label className="mb-0.5 block font-medium tracking-wide text-black text-sm dark:text-white">
                      Custom N
                    </label>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={customNth}
                      onChange={(e) => {
                        setCustomNth(e.target.value);
                        setNthError(null);
                      }}
                      placeholder="e.g. 250"
                      className="w-full rounded border border-stroke bg-transparent px-4 py-2 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-boxdark text-black dark:text-white text-sm min-w-[160px]"
                    />
                  </div>
                )}

                <label className="flex items-center gap-2 text-sm text-black dark:text-white select-none">
                  <input
                    type="checkbox"
                    checked={includeAdmins}
                    onChange={(e) => {
                      setIncludeAdmins(e.target.checked);
                      setNthError(null);
                      setNthResult(null);
                    }}
                    className="h-4 w-4 rounded border border-stroke accent-primary dark:border-form-strokedark"
                  />
                  Include admins
                </label>

                <button
                  type="button"
                  onClick={handleFetchNthSignup}
                  disabled={nthSignupMutation.isPending}
                  className="inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {nthSignupMutation.isPending ? "Fetching..." : "Fetch"}
                </button>
              </div>
            </div>

            <div className="mt-4">
              {nthError ? (
                <div className="rounded border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {nthError}
                </div>
              ) : nthSignupMutation.isPending ? (
                <div className="rounded border border-stroke bg-gray-2 px-4 py-3 dark:border-strokedark dark:bg-meta-4">
                  <div className="h-4 w-56 rounded bg-gray-200 dark:bg-boxdark-hover animate-pulse mb-2"></div>
                  <div className="h-3 w-72 rounded bg-gray-200 dark:bg-boxdark-hover animate-pulse"></div>
                </div>
              ) : nthResult?.user ? (
                <div className="flex flex-col gap-3 rounded border border-stroke bg-white px-4 py-3 dark:border-strokedark dark:bg-boxdark">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-black dark:text-white">
                        #{nthResult.n} signup
                      </p>
                      <p className="text-sm text-black dark:text-white">
                        {nthResult.user.name}{" "}
                        <span className="text-bodydark2 dark:text-bodydark">
                          ({nthResult.user.email})
                        </span>
                      </p>
                      <p className="text-xs text-bodydark2 dark:text-bodydark">
                        Created:{" "}
                        {moment(nthResult.user.createdAt).format(
                          "ddd DD, MMM YYYY hh:mm:ss A"
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-3.5">
                      <Button.View
                        onClick={() => {
                          route.push(`/users/${nthResult.user._id}`);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-bodydark2 dark:text-bodydark">
                  Choose N (100/1000 or Custom) and click Fetch.
                </div>
              )}
            </div>
          </div>
          <div className="max-w-full overflow-x-auto no-scrollbar">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                    Name
                  </th>
                  {accountType && accountType === "business" ? (
                    <>
                      <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                        Business Details
                      </th>
                    </>
                  ) : null}
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
                {isFetching ? (
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
                        {accountType && accountType === "business" && (
                          <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                            <div className="space-y-2">
                              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-boxdark-hover animate-pulse"></div>
                              <div className="h-3 w-32 rounded bg-gray-200 dark:bg-boxdark-hover animate-pulse"></div>
                              <div className="h-3 w-20 rounded bg-gray-200 dark:bg-boxdark-hover animate-pulse"></div>
                            </div>
                          </td>
                        )}
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
                ) : (
                  <>
                    {data &&
                      data.data.map((user, key) => {
                        return (
                          <tr key={key}>
                            <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="h-12.5 w-15 rounded-md">
                                  {user.accountType === "business" ? (
                                    <Image
                                      src={
                                        user.businessProfileRef?.profilePic
                                          ?.small
                                          ? user.businessProfileRef?.profilePic
                                              ?.small
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
                                  <p className="text-xs font-medium capitalize">
                                    {user.accountType}
                                  </p>
                                </div>
                              </div>
                            </td>
                            {accountType && accountType === "business" ? (
                              <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                  <div>
                                    <h5 className=" text-black dark:text-white">
                                      <span className="font-semibold">
                                        {" "}
                                        {user.businessProfileRef &&
                                          user.businessProfileRef &&
                                          user.businessProfileRef.name}
                                      </span>
                                      <span className="ml-2 text-xs font-semibold">
                                        {" "}
                                        Rating:
                                        {user.businessProfileRef &&
                                          user.businessProfileRef &&
                                          user.businessProfileRef.rating}
                                      </span>
                                    </h5>
                                    <p className="text-sm text-black-2 dark:text-white mb-1   font-medium">
                                      {user.businessProfileRef &&
                                        user.businessProfileRef &&
                                        user.businessProfileRef
                                          .businessTypeRef &&
                                        user.businessProfileRef.businessTypeRef
                                          .name}
                                      <span className="text-xs font-normal tracking-wide capitalize ml-2 text-black/80 dark:text-meta-9">
                                        {user.businessProfileRef &&
                                          user.businessProfileRef &&
                                          user.businessProfileRef
                                            .businessSubtypeRef &&
                                          user.businessProfileRef
                                            .businessSubtypeRef.name}
                                      </span>
                                    </p>
                                    <p className="text-xs font-medium">
                                      {user.businessProfileRef &&
                                        user.businessProfileRef.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                            ) : null}
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
                                <br />
                                {accountType &&
                                accountType === "business" &&
                                user.businessProfileRef &&
                                user.businessProfileRef.phoneNumber !== "" ? (
                                  <>
                                    {user?.businessProfileRef?.dialCode}-
                                    {user.businessProfileRef.phoneNumber}
                                  </>
                                ) : null}
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
                                {/* <Button.Download onClick={() => { }} /> */}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </>
                )}
              </tbody>
            </table>
            <Paginator
              pageNo={pageNo}
              totalPages={totalPages}
              totalResources={totalResources}
              onPageChange={(e, pageNo) => setPageNo(pageNo)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersTable;
