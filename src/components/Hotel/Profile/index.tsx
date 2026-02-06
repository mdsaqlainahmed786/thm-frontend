"use client";
import React, { useEffect, useState, useMemo } from "react";
import { PageContent, PageTitle } from "../Layouts/AdminLayout";
export const DefaultProfilePic = "/images/user-placeholder.jpg";
export const DefaultCoverPic = "/images/cover/cover-01.png";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  fetchBusinessQuestions,
  fetchLanguages,
  fetchProfile,
  updateAmenity,
  updateProfile,
} from "@/api-services/hotel";
import SVG from "@/components/SVG/index";
import Image from "next/image";
import moment from "moment";
import { ListIcon, DownArrowIcon } from "@/components/Icons";
import {
  fetchBusinessTypes,
  fetchBusinessSubtypes,
} from "@/api-services/business";
import Select, {
  CSSObjectWithLabel,
  ControlProps,
  ActionMeta,
  MultiValue,
  SingleValue,
} from "react-select";
import Button from "@/components/Button";
import Input from "../Common/UI/Input";
import Label from "../Common/UI/Label";
import apiRequest from "@/api-services/app-client";
import toast from "react-hot-toast";

async function getBusinessQr(businessID: string): Promise<string | Blob> {
  try {
    // Try admin endpoint (backend returns SVG as text)
    let response;
    try {
      response = await apiRequest.get(
        `/admin/business/${businessID}/generate-qr`,
        {
          responseType: "text", // Backend returns SVG as text, not blob
          skipAuthError: true, // Prevent logout on 401/403 errors
        } as any
      );
    } catch (error: any) {
      // If endpoint fails with 401/403, throw user-friendly error
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        throw new Error(
          "You don't have permission to access QR code. Please contact support."
        );
      }
      throw error;
    }

    if (response && response.status && response.data) {
      return response.data;
    }
    throw new Error("Invalid response data");
  } catch (error: any) {
    // If it's already a user-friendly error message, just throw it
    if (error.message && !error.response) {
      throw error;
    }
    // Don't re-throw 401/403 errors to prevent logout
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      console.error("QR code access denied:", error);
      throw new Error(
        "You don't have permission to access QR code. Please contact support."
      );
    }
    console.error(error);
    throw error;
  }
}

function encodeURIComponentToImage(data: string | Blob): string {
  if (data instanceof Blob) {
    return URL.createObjectURL(data);
  }
  // If it's a string (SVG), encode it as a data URL
  if (typeof data === "string") {
    // Check if it's already a data URL
    if (data.startsWith("data:")) {
      return data;
    }
    // Check if it's an SVG string
    if (data.trim().startsWith("<svg") || data.trim().startsWith("<?xml")) {
      return `data:image/svg+xml;utf8,${encodeURIComponent(data)}`;
    }
    // Otherwise, assume it's a URL or path
    return data;
  }
  return data;
}

const Profile: React.FC<{}> = () => {
  const [modal, setModal] = useState(false);
  const [popup, setPopup] = useState(false);
  const [popupSetting, setPopupSetting] = useState<"language" | "amenity">(
    "language"
  );
  const defaultQR =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53 53" shape-rendering="crispEdges"><path fill="#ffffff" d="M0 0h53v53H0z"/><path stroke="#000000" d="M4 4.5h7m2 0h5m1 0h1m1 0h1m7 0h1m1 0h1m1 0h2m5 0h1m1 0h7M4 5.5h1m5 0h1m3 0h3m1 0h1m6 0h1m1 0h2m1 0h2m3 0h1m1 0h1m1 0h1m2 0h1m5 0h1M4 6.5h1m1 0h3m1 0h1m1 0h1m1 0h4m1 0h2m1 0h3m2 0h1m1 0h1m2 0h2m2 0h2m1 0h1m2 0h1m1 0h3m1 0h1M4 7.5h1m1 0h3m1 0h1m1 0h1m1 0h1m6 0h5m1 0h1m1 0h1m5 0h1m3 0h2m1 0h1m1 0h3m1 0h1M4 8.5h1m1 0h3m1 0h1m1 0h4m6 0h8m3 0h2m1 0h5m1 0h1m1 0h3m1 0h1M4 9.5h1m5 0h1m1 0h3m3 0h3m1 0h1m1 0h1m3 0h1m1 0h4m8 0h1m5 0h1M4 10.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M12 11.5h1m1 0h1m1 0h1m1 0h1m2 0h4m3 0h1m1 0h6m4 0h1M4 12.5h1m1 0h5m3 0h1m1 0h1m5 0h1m1 0h6m3 0h3m1 0h1m1 0h1m2 0h5M7 13.5h3m2 0h1m2 0h1m5 0h3m1 0h2m1 0h2m1 0h1m1 0h3m4 0h1m3 0h5M4 14.5h1m5 0h1m1 0h1m1 0h1m2 0h2m2 0h2m4 0h1m2 0h1m2 0h1m1 0h4m2 0h3m1 0h1m1 0h1M4 15.5h1m2 0h1m4 0h2m1 0h1m1 0h1m1 0h2m2 0h2m5 0h1m1 0h3m1 0h2m3 0h2m3 0h1M6 16.5h1m2 0h4m1 0h1m1 0h4m1 0h2m1 0h2m1 0h1m3 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m3 0h1m2 0h1M6 17.5h1m4 0h3m1 0h2m1 0h3m2 0h3m2 0h2m2 0h5m2 0h3m3 0h4M4 18.5h1m1 0h7m3 0h2m1 0h1m2 0h1m1 0h1m2 0h2m5 0h1m2 0h1m2 0h1m1 0h1m3 0h1M4 19.5h1m7 0h1m2 0h4m1 0h2m1 0h1m1 0h1m1 0h4m1 0h5m2 0h3m2 0h1m1 0h3M4 20.5h3m1 0h1m1 0h3m1 0h1m1 0h1m2 0h6m2 0h2m4 0h3m3 0h1m2 0h2m1 0h1m2 0h1M4 21.5h4m5 0h6m3 0h1m3 0h4m1 0h6m2 0h3m1 0h5M5 22.5h1m4 0h1m2 0h1m2 0h5m6 0h2m1 0h1m4 0h3m1 0h1m3 0h3m1 0h1M4 23.5h1m3 0h2m1 0h4m1 0h2m1 0h5m1 0h1m3 0h7m3 0h1m4 0h4M4 24.5h1m1 0h8m1 0h1m1 0h3m1 0h2m1 0h5m1 0h1m4 0h1m1 0h1m2 0h7M4 25.5h1m3 0h1m3 0h2m2 0h1m1 0h1m3 0h1m1 0h1m3 0h1m2 0h1m1 0h4m2 0h2m3 0h5M7 26.5h2m1 0h1m1 0h1m6 0h3m1 0h2m1 0h1m1 0h3m2 0h1m1 0h1m1 0h4m1 0h1m1 0h1m1 0h2M4 27.5h5m3 0h3m1 0h3m5 0h1m3 0h1m2 0h2m1 0h1m2 0h2m1 0h1m3 0h4M5 28.5h1m1 0h7m5 0h1m1 0h1m2 0h6m4 0h2m1 0h1m2 0h6m1 0h1M8 29.5h2m1 0h1m3 0h2m5 0h7m4 0h3m4 0h2m1 0h1m1 0h1m2 0h1M4 30.5h1m2 0h2m1 0h1m2 0h4m1 0h4m3 0h2m3 0h1m2 0h3m1 0h2m4 0h1m1 0h1m1 0h1M6 31.5h1m2 0h1m3 0h1m1 0h4m3 0h2m2 0h3m4 0h1m1 0h1m1 0h3m1 0h2m2 0h4M6 32.5h3m1 0h1m2 0h1m1 0h2m3 0h3m1 0h1m2 0h1m1 0h1m3 0h1m1 0h1m1 0h2m1 0h1m1 0h1m1 0h1M7 33.5h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m2 0h1m7 0h2m1 0h5m3 0h1m2 0h1m2 0h2M4 34.5h1m3 0h1m1 0h3m1 0h6m2 0h1m1 0h1m3 0h1m1 0h2m2 0h2m1 0h1m5 0h1m1 0h1m1 0h1M6 35.5h2m3 0h1m5 0h1m2 0h2m3 0h1m2 0h1m2 0h3m2 0h1m2 0h1m2 0h2m1 0h2m1 0h1M5 36.5h1m1 0h1m2 0h1m5 0h1m1 0h1m1 0h1m1 0h1m2 0h1m1 0h3m1 0h1m2 0h2m1 0h2m1 0h3m2 0h1m2 0h1M4 37.5h1m1 0h2m3 0h2m2 0h1m3 0h1m4 0h1m1 0h2m1 0h1m3 0h2m5 0h1m1 0h1m5 0h1M8 38.5h1m1 0h1m1 0h1m2 0h1m1 0h4m3 0h1m1 0h1m3 0h3m3 0h1m2 0h3m4 0h2M5 39.5h4m3 0h3m3 0h5m1 0h6m4 0h7m2 0h1m1 0h2M4 40.5h1m2 0h2m1 0h2m1 0h1m1 0h2m1 0h2m1 0h8m4 0h3m2 0h1m1 0h8M12 41.5h1m1 0h6m1 0h2m1 0h1m3 0h2m1 0h4m1 0h1m2 0h2m3 0h3m1 0h1M4 42.5h7m2 0h2m2 0h3m2 0h1m1 0h1m1 0h1m1 0h1m10 0h2m1 0h1m1 0h1m1 0h2M4 43.5h1m5 0h1m1 0h5m1 0h2m3 0h2m3 0h9m2 0h2m3 0h4M4 44.5h1m1 0h3m1 0h1m1 0h1m1 0h2m4 0h1m3 0h5m1 0h1m2 0h1m5 0h7m2 0h1M4 45.5h1m1 0h3m1 0h1m1 0h1m1 0h2m3 0h1m1 0h1m4 0h2m1 0h1m3 0h3m3 0h1m3 0h2m2 0h2M4 46.5h1m1 0h3m1 0h1m1 0h1m3 0h1m3 0h1m1 0h1m2 0h1m2 0h1m1 0h1m1 0h1m1 0h1m1 0h3m1 0h3m2 0h3M4 47.5h1m5 0h1m2 0h2m1 0h3m3 0h3m1 0h3m1 0h3m2 0h3m3 0h1m2 0h3M4 48.5h7m1 0h1m1 0h1m2 0h2m1 0h2m1 0h1m2 0h3m4 0h2m3 0h1m1 0h3m4 0h1"/></svg>';
  const [qr, setQR] = useState<string>(encodeURIComponentToImage(defaultQR));
  const emptyData: {
    value: string;
    label: string;
  }[] = [];
  const emptyAnswer = useMemo(() => {
    return [] as {
      questionID: string;
      answer: string;
    }[];
  }, []);
  const initialFormInputs = {
    name: "",
    bio: "",
    gstn: "",
    website: "",
    email: "",
    phoneNumber: "",
    dialCode: "",
    address: "",
    businessTypeID: "",
    businessSubTypeID: "",
    checkIn: "",
    checkOut: "",
    languages: emptyData,
    answer: emptyAnswer,
  };
  const [formInputs, setFormInputs] = useState(initialFormInputs);
  const {
    isPending,
    isError,
    error,
    data,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: ["business-profile"],
    queryFn: () => fetchProfile(),
    placeholderData: keepPreviousData,
  });
  const { data: businessTypes, refetch: refetchBusinessTypes } = useQuery({
    queryKey: ["business-types"],
    queryFn: () => fetchBusinessTypes(),
    placeholderData: keepPreviousData,
  });
  const { data: businessSubTypes, refetch: refetchBusinessSubTypes } = useQuery(
    {
      queryKey: ["business-types", formInputs.businessTypeID],
      queryFn: () => fetchBusinessSubtypes(formInputs.businessTypeID),
      placeholderData: keepPreviousData,
    }
  );
  const { data: languages, refetch: refetchLanguage } = useQuery({
    queryKey: ["languages"],
    queryFn: () => fetchLanguages(),
    placeholderData: keepPreviousData,
  });
  const { data: businessQuestions, refetch: refetchBusinessQuestions } =
    useQuery({
      queryKey: ["business-questions"],
      queryFn: () =>
        fetchBusinessQuestions(
          formInputs.businessTypeID,
          formInputs.businessSubTypeID
        ),
      placeholderData: keepPreviousData,
    });
  useEffect(() => {
    if (formInputs.businessTypeID && formInputs.businessSubTypeID) {
      refetchBusinessQuestions();
    }
  }, [
    formInputs.businessTypeID,
    formInputs.businessSubTypeID,
    refetchBusinessQuestions,
  ]);
  const loading = isPending || isFetching;
  useEffect(() => {
    if (data && data?.businessProfileRef) {
      const answer =
        data?.businessProfileRef?.amenities &&
        data?.businessProfileRef?.amenities.length !== 0
          ? data.businessProfileRef?.amenities.map((amenityID) => {
              return {
                questionID: amenityID,
                answer: "Yes",
              };
            })
          : emptyAnswer;
      setFormInputs((prev) => ({
        ...prev,
        bio: data?.businessProfileRef?.bio || "",
        name: data?.businessProfileRef?.name || "",
        gstn: data?.businessProfileRef?.gstn || "",
        website: data?.businessProfileRef?.website || "",
        email: data?.businessProfileRef?.email || "",
        phoneNumber: data?.businessProfileRef?.phoneNumber || "",
        dialCode: data?.businessProfileRef?.dialCode || "",
        address:
          data && data.businessProfileRef?.address
            ? `${data.businessProfileRef.address.street || ""}, ${
                data.businessProfileRef.address.city || ""
              }, ${data.businessProfileRef.address.state || ""}, ${
                data.businessProfileRef.address.zipCode || ""
              }, ${data.businessProfileRef.address.country || ""}`
            : "",
        businessTypeID: data?.businessProfileRef?.businessTypeID || "",
        businessSubTypeID: data?.businessProfileRef?.businessSubTypeID || "",
        checkIn: data?.businessProfileRef?.checkIn || "",
        checkOut: data?.businessProfileRef?.checkOut || "",
        answer: answer,
      }));
    }
    // Fetch QR code when profile data is available
    if (data && data?.businessProfileRef?._id) {
      getBusinessQr(data.businessProfileRef._id)
        .then((qrData) => {
          setQR(encodeURIComponentToImage(qrData));
        })
        .catch((error) => {
          console.log("QR code fetch error:", error);
          // Don't show error toast here to avoid annoying users
          // The QR code will just show the default placeholder
        });
    }
  }, [data, emptyAnswer]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await updateProfile(formInputs);
      setModal(false);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };
  const handleAmenityAndLanguageUpdate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    try {
      e.preventDefault();
      const data = {};
      if (popupSetting === "amenity") {
        await updateAmenity(formInputs.answer);
      }
      if (popupSetting === "language") {
        Object.assign(data, {
          languageSpoken: formInputs.languages.map((data) => data.value),
        });
        await updateProfile(data);
      }
      setPopup(false);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const changeLanguage = async (
    newValue:
      | MultiValue<{ value: string; label: string }>
      | SingleValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    setFormInputs({
      ...formInputs,
      languages: newValue as {
        value: string;
        label: string;
      }[],
    });
  };

  const downloadQR = () => {
    if (data && data?.businessProfileRef?._id) {
      getBusinessQr(data.businessProfileRef._id)
        .then((qrData) => {
          // Handle both Blob and string (SVG) responses
          let url: string;
          let fileName: string;

          if (qrData instanceof Blob) {
            url = window.URL.createObjectURL(qrData);
            fileName = "Business-QR.png";
          } else if (typeof qrData === "string") {
            // Convert SVG string to Blob for download
            const svgBlob = new Blob([qrData], { type: "image/svg+xml" });
            url = window.URL.createObjectURL(svgBlob);
            fileName = "Business-QR.svg";
          } else {
            throw new Error("Invalid QR code data format");
          }

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          toast.success("QR code downloaded successfully");
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.message || "Failed to download QR code");
        });
    } else {
      toast.error("Business ID not found.");
    }
  };
  return (
    <>
      <div
        className={`overflow-hidden rounded-xl bg-theme-card shadow-theme-card ${
          loading ? "animate-pulse" : null
        } `}
      >
        <div
          className={`${
            popup ? "" : "hidden"
          } fixed left-0 top-0 z-999999 flex h-screen w-full justify-center overflow-y-scroll bg-black/80 dark:bg-black/80 px-4 py-5`}
        >
          <div className="m-auto w-full max-w-lg rounded-xl border border-theme-primary bg-theme-card p-4 shadow-theme-lg sm:p-6 xl:p-8">
            <div className="flex justify-between">
              <h4 className="text-theme-primary font-semibold">
                {popupSetting === "amenity"
                  ? "Update Amenities"
                  : "Update Spoken Language"}
              </h4>
              <button
                className="bg-primary/50 border-radius h-6 w-6 rounded-full flex justify-center items-center"
                type="button"
                onClick={() => setPopup(false)}
              >
                <svg
                  className="fill-current"
                  width="8"
                  height="8"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.8913 9.99599L19.5043 2.38635C20.032 1.85888 20.032 1.02306 19.5043 0.495589C18.9768 -0.0317329 18.141 -0.0317329 17.6135 0.495589L10.0001 8.10559L2.38673 0.495589C1.85917 -0.0317329 1.02343 -0.0317329 0.495873 0.495589C-0.0318274 1.02306 -0.0318274 1.85888 0.495873 2.38635L8.10887 9.99599L0.495873 17.6056C-0.0318274 18.1331 -0.0318274 18.9689 0.495873 19.4964C0.717307 19.7177 1.05898 19.9001 1.4413 19.9001C1.75372 19.9001 2.13282 19.7971 2.40606 19.4771L10.0001 11.8864L17.6135 19.4964C17.8349 19.7177 18.1766 19.9001 18.5589 19.9001C18.8724 19.9001 19.2531 19.7964 19.5265 19.4737C20.0319 18.9452 20.0245 18.1256 19.5043 17.6056L11.8913 9.99599Z"
                    fill=""
                  ></path>
                </svg>
              </button>
            </div>
            <form onSubmit={handleAmenityAndLanguageUpdate}>
              <div className="my-8">
                {popupSetting === "amenity" ? (
                  <div className="mb-3">
                    {businessQuestions &&
                      businessQuestions.map((data, index) => {
                        return (
                          <div
                            className="rounded-xl border border-theme-primary bg-theme-secondary px-3 py-2.5 shadow-theme-sm mb-2"
                            key={index}
                          >
                            <label
                              htmlFor="question"
                              className="text-sm font-medium tracking-wide mb-1.5 font-quicksand text-theme-primary"
                            >
                              {data.question}
                            </label>
                            <div className="flex items-center space-x-6">
                              {data.answer.map((answer, index) => {
                                const isChecked =
                                  formInputs.answer.filter(
                                    (_data) =>
                                      _data.questionID === data.id &&
                                      _data.answer === answer
                                  ).length > 0;
                                console.log(isChecked);
                                return (
                                  <div
                                    key={index}
                                    className="flex items-center gap-1.5"
                                  >
                                    <input
                                      id={`questions-${index}`}
                                      type="radio"
                                      name={data.id}
                                      checked={isChecked}
                                      value={answer}
                                      className="w-4 h-4 border-primary focus:ring-2 focus:ring-primary/30  dark:focus:ring-primary/60 dark:focus:bg-primary dark:bg-primary dark:border-primary rounded-full"
                                      onChange={(e) => {
                                        const target = e.target;
                                        const questionID = target.name;
                                        const selectedAnswer = target.value;
                                        const haveValue =
                                          formInputs.answer.find(
                                            (data) =>
                                              data.questionID === questionID
                                          );
                                        if (!haveValue) {
                                          const answer = [
                                            ...formInputs.answer,
                                            {
                                              questionID: questionID,
                                              answer: selectedAnswer,
                                            },
                                          ];
                                          console.log("Data ", answer);
                                          setFormInputs({
                                            ...formInputs,
                                            answer: answer,
                                          });
                                        } else {
                                          const updatedAnswers =
                                            formInputs.answer.map((data) =>
                                              data.questionID === questionID
                                                ? {
                                                    ...data,
                                                    answer: selectedAnswer,
                                                  }
                                                : data
                                            );
                                          setFormInputs({
                                            ...formInputs,
                                            answer: updatedAnswers,
                                          });
                                        }
                                      }}
                                    />
                                    <label
                                      htmlFor={`questions-${index}`}
                                      className="block text-sm font-normal text-theme-secondary"
                                    >
                                      {answer}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="mb-3">
                    <Label id="spokenLanguage">Language</Label>
                    <div className="relative z-20 w-full appearance-none rounded-theme-xl border border-theme-primary bg-theme-secondary px-3.5 py-1 outline-none transition focus:border-primary active:border-primary text-theme-primary text-sm">
                      <Select
                        isMulti={true}
                        closeMenuOnSelect={false}
                        className="text-theme-primary"
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            background: "transparent",
                            border: state.isFocused ? "0" : "0",
                            boxShadow: state.isFocused ? "0" : "0",
                            "&:hover": {
                              border: state.isFocused ? "0" : "0",
                            },
                          }),
                        }}
                        options={
                          languages && languages.length !== 0
                            ? languages.map((data, index) => ({
                                value: data.languageCode,
                                label: data.languageName,
                              }))
                            : []
                        }
                        value={formInputs.languages}
                        onChange={(newValue, actionMeta) =>
                          changeLanguage(newValue, actionMeta)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap justify-end items-center gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-2 text-theme-secondary hover:bg-opacity-90 rounded-[25px] bg-theme-tertiary"
                  onClick={() => setPopup(false)}
                >
                  <span className="text-sm font-normal font-quicksand">
                    Cancel
                  </span>
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-4 py-2 text-white hover:bg-opacity-90 rounded-[25px] bg-brand-primary"
                >
                  <span className="text-sm font-normal font-quicksand">
                    Update
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Edit User Model */}
      </div>
      <div
        className={`overflow-hidden rounded-xl bg-theme-card shadow-theme-card ${
          loading ? "animate-pulse" : null
        } `}
      >
        {/* Edit User Model */}
        <div
          className={`${
            modal ? "" : "hidden"
          } fixed left-0 top-6 z-999999 flex h-screen w-full justify-center overflow-y-scroll bg-black/80 dark:bg-black/80 px-4 py-5`}
        >
          <div className="m-auto w-full max-w-5xl rounded-xl border border-theme-primary bg-theme-card p-4 shadow-theme-lg sm:p-6 xl:p-8">
            <div className="flex justify-between">
              <h4 className="text-theme-primary font-semibold">Profile</h4>
              <button
                className="bg-primary/50 border-radius h-6 w-6 rounded-full flex justify-center items-center"
                type="button"
                onClick={() => setModal(false)}
              >
                <svg
                  className="fill-current"
                  width="8"
                  height="8"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.8913 9.99599L19.5043 2.38635C20.032 1.85888 20.032 1.02306 19.5043 0.495589C18.9768 -0.0317329 18.141 -0.0317329 17.6135 0.495589L10.0001 8.10559L2.38673 0.495589C1.85917 -0.0317329 1.02343 -0.0317329 0.495873 0.495589C-0.0318274 1.02306 -0.0318274 1.85888 0.495873 2.38635L8.10887 9.99599L0.495873 17.6056C-0.0318274 18.1331 -0.0318274 18.9689 0.495873 19.4964C0.717307 19.7177 1.05898 19.9001 1.4413 19.9001C1.75372 19.9001 2.13282 19.7971 2.40606 19.4771L10.0001 11.8864L17.6135 19.4964C17.8349 19.7177 18.1766 19.9001 18.5589 19.9001C18.8724 19.9001 19.2531 19.7964 19.5265 19.4737C20.0319 18.9452 20.0245 18.1256 19.5043 17.6056L11.8913 9.99599Z"
                    fill=""
                  ></path>
                </svg>
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="my-8">
                <div className="mb-17.5">
                  <div
                    className="min-h-40 rounded-[14px] relative flex justify-center"
                    style={{
                      background: `url('${
                        data?.businessProfileRef?.coverImage || DefaultCoverPic
                      }')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    <Image
                      src={
                        data?.businessProfileRef?.profilePic?.small ??
                        DefaultProfilePic
                      }
                      width={330}
                      height={160}
                      alt="Default cover image"
                      className="w-33 h-33 rounded-full absolute -bottom-6 object-cover border-2 border-[#1C1C1C99]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="mb-3">
                    <Label id="name">Business Type</Label>
                    <div className="relative z-20 ">
                      <span className="absolute left-5 top-1/2 z-30 -translate-y-1/2">
                        <ListIcon width={16} height={16} />
                      </span>
                      <select
                        className="relative z-20 w-full appearance-none rounded-theme-xl border border-theme-primary bg-theme-secondary px-12 py-3 outline-none transition focus:border-primary active:border-primary text-theme-primary text-sm"
                        required={true}
                        onChange={(e) =>
                          setFormInputs({
                            ...formInputs,
                            businessTypeID: e.target.value,
                          })
                        }
                        value={formInputs.businessTypeID}
                      >
                        <option
                          value=""
                          disabled={false}
                          className="text-theme-primary bg-theme-card"
                        >
                          Select Business Type
                        </option>
                        {businessTypes &&
                          businessTypes.map((data, index) => (
                            <option
                              key={index}
                              value={data.id}
                              className="text-theme-primary bg-theme-card"
                            >
                              {data.name}
                            </option>
                          ))}
                      </select>
                      <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                        <DownArrowIcon />
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <Label id="phoneNumber">Business Subtype</Label>
                    <div className="relative z-20 ">
                      <span className="absolute left-5 top-1/2 z-30 -translate-y-1/2">
                        <ListIcon width={16} height={16} />
                      </span>
                      <select
                        className="relative z-20 w-full appearance-none rounded-theme-xl border border-theme-primary bg-theme-secondary px-12 py-3 outline-none transition focus:border-primary active:border-primary text-theme-primary text-sm"
                        required={true}
                        onChange={(e) =>
                          setFormInputs({
                            ...formInputs,
                            businessSubTypeID: e.target.value,
                          })
                        }
                        value={formInputs.businessSubTypeID}
                      >
                        <option
                          value=""
                          disabled={false}
                          className="text-theme-primary bg-theme-card"
                        >
                          Select Business Subtype
                        </option>
                        {businessSubTypes &&
                          businessSubTypes.map((data, index) => (
                            <option
                              key={index}
                              value={data.id}
                              className="text-theme-primary bg-theme-card"
                            >
                              {data.name}
                            </option>
                          ))}
                      </select>
                      <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                        <DownArrowIcon />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="mb-3">
                    <Label id="name">Business Name</Label>
                    <Input
                      id="name"
                      name="name"
                      required={true}
                      value={formInputs.name}
                      onChange={(e) =>
                        setFormInputs({ ...formInputs, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <Label id="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formInputs.phoneNumber}
                      onChange={(e) =>
                        setFormInputs({
                          ...formInputs,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="mb-3">
                    <Label id="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      required={true}
                      value={formInputs.email}
                      onChange={(e) =>
                        setFormInputs({ ...formInputs, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <Label id="website">Website Link</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formInputs.website}
                      onChange={(e) =>
                        setFormInputs({
                          ...formInputs,
                          website: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="mb-3">
                    <Label id="gstn">GSTIN</Label>
                    <Input
                      id="gstn"
                      name="gstn"
                      value={formInputs.gstn}
                      onChange={(e) =>
                        setFormInputs({ ...formInputs, gstn: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <Label id="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formInputs.address}
                      disabled={true}
                      onChange={(e) =>
                        setFormInputs({
                          ...formInputs,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="mb-3">
                    <Label id="checkIn">Check In</Label>
                    <Input
                      type="time"
                      id="checkIn"
                      name="checkIn"
                      value={formInputs.checkIn}
                      onChange={(e) =>
                        setFormInputs({
                          ...formInputs,
                          checkIn: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <Label id="checkOut">Check Out</Label>
                    <Input
                      type="time"
                      id="checkOut"
                      name="checkOut"
                      value={formInputs.checkOut}
                      onChange={(e) =>
                        setFormInputs({
                          ...formInputs,
                          checkOut: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                  <div className="">
                  <div className="mb-3">
                    <Label id="bio">Description/Bio</Label>
                    <textarea
                      id="bio"
                      placeholder=""
                      required={false}
                      className="w-full rounded-theme-xl border border-theme-primary bg-theme-secondary px-4.5 py-3 text-theme-primary focus:border-primary focus-visible:outline-none text-sm font-normal"
                      name="bio"
                      value={formInputs.bio}
                      onChange={(e) =>
                        setFormInputs({ ...formInputs, bio: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-end items-center gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-2 text-theme-secondary hover:bg-opacity-90 rounded-[25px] bg-theme-tertiary"
                  onClick={() => setModal(false)}
                >
                  <span className="text-sm font-normal font-quicksand">
                    Cancel
                  </span>
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-4 py-2 text-white hover:bg-opacity-90 rounded-[25px] bg-brand-primary"
                >
                  <span className="text-sm font-normal font-quicksand">
                    Update
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Edit User Model */}
      </div>
      <div className="mb-4 flex flex-row  gap-3 justify-between items-center">
        <PageTitle>Profile</PageTitle>
        <Button.Hotel.Button
          name="Edit Profile"
          onClick={() => setModal(!modal)}
          svg={<SVG.Edit />}
        />
      </div>
      <PageContent>
        <div className="flex flex-col gap-3">
          <div className="grid  grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            <div
              className={`rounded-xl border border-theme-primary bg-theme-card px-0 py-0 shadow-theme-card overflow-hidden ${
                loading ? "animate-pulse" : ""
              }`}
            >
              <div className="flex flex-col">
                <div
                  className="h-32 sm:h-40 relative w-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${data?.businessProfileRef?.coverImage || DefaultCoverPic}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <Image
                      src={
                        data?.businessProfileRef?.profilePic?.small ??
                        DefaultProfilePic
                      }
                      width={80}
                      height={80}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-[3px] border-theme-primary shadow-lg bg-theme-card"
                    />
                  </div>
                </div>

                <div className="mt-12 px-5 pb-6 flex flex-col items-center text-center">
                  <h5 className="text-xl font-bold text-theme-primary mb-2">
                    {(data &&
                      data.businessProfileRef &&
                      data.businessProfileRef?.name) ||
                      ""}
                  </h5>

                  <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
                    {data &&
                    data?.businessProfileRef &&
                    data?.businessProfileRef?.businessTypeRef &&
                    data?.businessProfileRef?.businessTypeRef.name ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-light border border-theme-primary text-xs font-medium text-theme-secondary">
                         {data.businessProfileRef?.businessTypeRef.icon && (
                          <Image
                            src={data.businessProfileRef.businessTypeRef.icon}
                            width={14}
                            height={14}
                            alt="icon"
                            className="w-3.5 h-3.5 opacity-70"
                          />
                        )}
                        {data.businessProfileRef.businessTypeRef.name}
                      </span>
                    ) : null}

                    {data &&
                    data?.businessProfileRef &&
                    data?.businessProfileRef?.businessSubtypeRef &&
                    data?.businessProfileRef?.businessSubtypeRef.name ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-light border border-theme-primary text-xs font-medium text-theme-secondary">
                        {data.businessProfileRef.businessSubtypeRef.name}
                      </span>
                    ) : null}
                  </div>

                  <div className="w-full grid grid-cols-4 divide-x divide-theme-primary border-t border-theme-primary pt-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg font-bold text-theme-primary">{(data && data?.posts) || 0}</span>
                      <span className="text-xs text-theme-tertiary font-medium uppercase tracking-wide">Posts</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg font-bold text-theme-primary">{(data && data?.follower) || 0}</span>
                      <span className="text-xs text-theme-tertiary font-medium uppercase tracking-wide">Followers</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg font-bold text-theme-primary">{(data && data?.following) || 0}</span>
                      <span className="text-xs text-theme-tertiary font-medium uppercase tracking-wide">Following</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-theme-primary">
                          {(data && data?.businessProfileRef && data.businessProfileRef.rating) || 0}
                        </span>
                        <svg className="w-3.5 h-3.5 text-[#F2C94C]" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.50175 1.15123C7.71632 0.794694 8.23322 0.794693 8.44779 1.15123L10.7617 4.99614C10.8388 5.12423 10.9645 5.21558 11.1102 5.24931L15.4819 6.26182C15.8873 6.35571 16.047 6.84732 15.7743 7.16156L12.8326 10.5504C12.7346 10.6632 12.6865 10.8111 12.6995 10.96L13.0875 15.4307C13.1234 15.8452 12.7053 16.1491 12.3221 15.9867L8.19013 14.2362C8.05248 14.1779 7.89706 14.1779 7.75941 14.2362L3.62745 15.9867C3.24429 16.1491 2.8261 15.8452 2.86208 15.4307L3.25008 10.96C3.263 10.8111 3.21498 10.6632 3.11698 10.5504L0.175285 7.16156C-0.0974985 6.84732 0.062233 6.35571 0.467628 6.26182L4.83939 5.24931C4.98503 5.21558 5.11076 5.12423 5.18785 4.99614L7.50175 1.15123Z" />
                        </svg>
                      </div>
                      <span className="text-xs text-theme-tertiary font-medium uppercase tracking-wide">Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`rounded-xl border border-theme-primary bg-theme-card px-5 py-6 shadow-theme-card sm:px-7.5 ${
                loading ? "animate-pulse" : ""
              }`}
            >
              <h5 className="mb-3.5 text-base font-bold text-theme-primary">
                Business Details
              </h5>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-[140px,1fr] gap-1 sm:gap-4">
                  <p className="text-xs sm:text-sm font-medium text-theme-tertiary">Phone number</p>
                  <p className="text-sm sm:text-base font-normal text-theme-primary break-words">
                    {(data?.businessProfileRef?.dialCode ?? "") +
                      (data?.businessProfileRef?.phoneNumber ?? "")}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[140px,1fr] gap-1 sm:gap-4">
                  <p className="text-xs sm:text-sm font-medium text-theme-tertiary">Email</p>
                  <p className="text-sm sm:text-base font-normal text-theme-primary break-all">
                    {data?.businessProfileRef?.email ?? ""}
                  </p>
                </div>

                {!!data?.businessProfileRef?.website && (
                  <div className="grid grid-cols-1 sm:grid-cols-[140px,1fr] gap-1 sm:gap-4">
                    <p className="text-xs sm:text-sm font-medium text-theme-tertiary">Website</p>
                    <a
                      href={data.businessProfileRef.website}
                      className="text-sm sm:text-base font-medium text-brand-primary break-all hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {data.businessProfileRef.website}
                    </a>
                  </div>
                )}

                {!!data?.businessProfileRef?.gstn && (
                  <div className="grid grid-cols-1 sm:grid-cols-[140px,1fr] gap-1 sm:gap-4">
                    <p className="text-xs sm:text-sm font-medium text-theme-tertiary">GSTIN</p>
                    <p className="text-sm sm:text-base font-normal text-theme-primary break-words">
                      {data.businessProfileRef.gstn}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-[140px,1fr] gap-1 sm:gap-4">
                  <p className="text-xs sm:text-sm font-medium text-theme-tertiary">Address</p>
                  <p className="text-sm sm:text-base font-normal text-theme-primary break-words">
                    {data?.businessProfileRef?.address
                      ? `${data.businessProfileRef.address.street || ""}${
                          data.businessProfileRef.address.city
                            ? `, ${data.businessProfileRef.address.city}`
                            : ""
                        }${
                          data.businessProfileRef.address.state
                            ? `, ${data.businessProfileRef.address.state}`
                            : ""
                        }${
                          data.businessProfileRef.address.zipCode
                            ? `, ${data.businessProfileRef.address.zipCode}`
                            : ""
                        }${
                          data.businessProfileRef.address.country
                            ? `, ${data.businessProfileRef.address.country}`
                            : ""
                        }`
                      : ""}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`rounded-xl border border-theme-primary bg-theme-card px-5 py-6 shadow-theme-card sm:px-7.5 ${
                loading ? "animate-pulse" : ""
              } md:col-span-2 xl:col-span-1`}
            >
              <h5 className="mb-3.5 text-base font-bold text-theme-primary">
                Manager Details
              </h5>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <p className="text-sm font-normal text-theme-tertiary">
                    Name :
                  </p>
                  <p className="text-base font-normal text-theme-primary">
                    {(data && data.name) || ""}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-normal text-theme-tertiary">
                    Phone Number :
                  </p>
                  <p className="text-base font-normal text-theme-primary">
                    {(data && data.dialCode) || ""}{" "}
                    {(data && data.phoneNumber) || ""}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-normal text-theme-tertiary">
                    Email :
                  </p>
                  <p className="text-base font-normal text-theme-primary">
                    {(data && data.email) || ""}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-normal text-theme-tertiary">
                    Permission :
                  </p>
                  <p className="text-base font-normal capitalize text-theme-primary">
                    All Permission {/*This feature is not implement yet   */}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm font-normal text-theme-tertiary">
                    Date of Joining :
                  </p>
                  <p className="text-base font-normal capitalize text-theme-primary text-right">
                    {data && data.createdAt
                      ? moment(data.createdAt ?? "").format("DD-MM-YYYY")
                      : null}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`rounded-xl border border-theme-primary bg-theme-card px-5 py-6 shadow-theme-card sm:px-7.5 ${
              loading ? "animate-pulse" : ""
            }`}
          >
            <div className="flex flex-col justify-between gap-3.5">
              <h5 className="text-base font-bold text-theme-primary">
                General Information
              </h5>
              <p className="text-xs font-medium tracking-wide text-theme-secondary">
                {(data &&
                  data.businessProfileRef &&
                  data.businessProfileRef?.bio) ||
                  ""}
              </p>
              <h5 className="text-base font-bold text-theme-primary">
                Languages spoken
              </h5>

              <div className="flex gap-2">
                {data &&
                data?.businessProfileRef &&
                data?.businessProfileRef?.languageSpoken &&
                data?.businessProfileRef?.languageSpoken?.length !== 0 ? (
                  <>
                    {data?.businessProfileRef?.languageSpoken.map(
                      (languageSpoken, index) => {
                        return (
                          <div
                            key={index}
                            className="flex items-center flex-wrap bg-primary/60 gap-1 p-2 rounded-[30px]"
                          >
                            <Image
                              src={languageSpoken.flag}
                              width={24}
                              height={24}
                              alt="Spoken language"
                              className="rounded-full w-6 h-6 object-cover"
                            />
                            <span className="text-sm font-normal pr-1">
                              {languageSpoken.name}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </>
                ) : null}
                <button
                  type="button"
                  className="flex items-center flex-wrap bg-primary/60 gap-1 p-2 rounded-[30px]"
                  onClick={() => {
                    setPopup(true);
                    setPopupSetting("language");
                  }}
                >
                  <div className="flex justify-center items-center h-6 w-6 bg-primary dark:bg-primary rounded-full">
                    <svg
                      className="fill-current w-3.5 h-3.5"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 7H9V1C9 0.4 8.6 0 8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7Z"
                        fill=""
                      ></path>
                    </svg>
                  </div>
                  <span className="text-sm font-normal pr-1">Add</span>
                </button>
              </div>
              <h5 className="text-base font-bold text-theme-primary">
                Check-in/Check-out
              </h5>
              <ol className="list-disc pl-5">
                <li className="text-sm font-normal text-brand-primary">
                  <span className="text-theme-tertiary">
                    Check-in from:
                  </span>{" "}
                  {(data &&
                    data?.businessProfileRef &&
                    data?.businessProfileRef?.checkIn) ||
                    ""}
                </li>
                <li className="text-sm font-normal text-brand-primary">
                  <span className="text-theme-tertiary">
                    Check-out from:
                  </span>{" "}
                  {(data &&
                    data?.businessProfileRef &&
                    data?.businessProfileRef?.checkOut) ||
                    ""}
                </li>
              </ol>
            </div>
          </div>
          <div className="col-span-12 xl:col-span-7">
            <div
              className={`rounded-xl border border-theme-primary bg-theme-card px-5 py-6 shadow-theme-card sm:px-7.5 ${
                loading ? "animate-pulse" : ""
              }`}
            >
              <div className="flex flex-col justify-between gap-3.5">
                <div className="flex justify-between items-center">
                  <h5 className="text-base font-bold text-theme-primary tracking-wide">
                    Amenities
                  </h5>
                  <Button.Hotel.Button
                    name="Manage Amenities"
                    onClick={() => {
                      setPopup(true);
                      setPopupSetting("amenity");
                    }}
                    svg={<SVG.Edit />}
                  />
                </div>
                <div className="flex gap-3 mb-3.5">
                  {data &&
                  data?.businessProfileRef &&
                  data?.businessProfileRef?.amenitiesRef &&
                  data?.businessProfileRef?.amenitiesRef?.length !== 0
                    ? data?.businessProfileRef?.amenitiesRef.map(
                        (amenity, index) => {
                          return (
                            <div
                              key={index}
                              className="flex gap-1 items-center justify-start"
                            >
                              <span>
                                <svg
                                  width="16"
                                  height="17"
                                  viewBox="0 0 16 17"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <rect
                                    x="0.333333"
                                    y="0.907552"
                                    width="15.3333"
                                    height="15.3333"
                                    rx="7.66667"
                                    stroke="#4169E1"
                                    strokeOpacity="0.5"
                                    strokeWidth="0.666667"
                                  />
                                  <path
                                    d="M11.5984 5.57422L6.55844 11.5742L4.39844 9.17422"
                                    stroke="#4169E1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                              <span className="text-xs leading-[12px] text-theme-secondary">
                                {amenity.name}
                              </span>
                            </div>
                          );
                        }
                      )
                    : null}
                </div>
              </div>
            </div>
          </div>
          <div
            className={`rounded-xl border border-theme-primary bg-theme-card px-5 py-6 shadow-theme-card sm:px-7.5 ${
              loading ? "animate-pulse" : ""
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Business Details Section */}
              <div className="flex flex-col gap-4">
                <h5 className="text-xl font-bold text-theme-primary">
                  Business Details
                </h5>
                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-2xl font-bold text-theme-primary mb-1">
                      {(data && data.businessProfileRef?.name) || ""}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      {data && data?.businessProfileRef?.rating ? (
                        <>
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              width="16"
                              height="16"
                              viewBox="0 0 16 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7.50175 1.15123C7.71632 0.794694 8.23322 0.794693 8.44779 1.15123L10.7617 4.99614C10.8388 5.12423 10.9645 5.21558 11.1102 5.24931L15.4819 6.26182C15.8873 6.35571 16.047 6.84732 15.7743 7.16156L12.8326 10.5504C12.7346 10.6632 12.6865 10.8111 12.6995 10.96L13.0875 15.4307C13.1234 15.8452 12.7053 16.1491 12.3221 15.9867L8.19013 14.2362C8.05248 14.1779 7.89706 14.1779 7.75941 14.2362L3.62745 15.9867C3.24429 16.1491 2.8261 15.8452 2.86208 15.4307L3.25008 10.96C3.263 10.8111 3.21498 10.6632 3.11698 10.5504L0.175285 7.16156C-0.0974985 6.84732 0.062233 6.35571 0.467628 6.26182L4.83939 5.24931C4.98503 5.21558 5.11076 5.12423 5.18785 4.99614L7.50175 1.15123Z"
                                fill="#F2C94C"
                              />
                            </svg>
                          ))}
                          <span className="text-theme-primary text-sm ml-1">
                            {parseFloat(
                              `${data.businessProfileRef.rating}`
                            ).toFixed(1)}
                          </span>
                        </>
                      ) : (
                        <span className="text-theme-tertiary text-sm">
                          No rating yet
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-theme-secondary">
                      {data && data?.businessProfileRef?.businessTypeRef?.name
                        ? `${data.businessProfileRef.businessTypeRef.name}`
                        : ""}
                      {data &&
                      data?.businessProfileRef?.businessSubtypeRef?.name
                        ? ` - ${data.businessProfileRef.businessSubtypeRef.name}`
                        : ""}
                    </p>
                  </div>
                  {/* Amenities */}
                  {data &&
                    data?.businessProfileRef?.amenitiesRef &&
                    data?.businessProfileRef?.amenitiesRef?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {data.businessProfileRef.amenitiesRef.map(
                          (amenity: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-1.5 rounded-sm border border-theme-primary bg-theme-secondary px-3 py-2 shadow-theme-sm"
                            >
                              {amenity?.icon && (
                                <Image
                                  src={amenity.icon}
                                  alt={amenity.name || "Amenity"}
                                  width={20}
                                  height={20}
                                  className="w-5 h-5"
                                />
                              )}
                              <p className="text-xs font-semibold tracking-wider text-theme-primary">
                                {amenity?.name || ""}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  {/* Contact Information */}
                  <div className="flex flex-col gap-2 mt-2">
                    {data && data.businessProfileRef?.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122L9.65 10.5a.678.678 0 0 1-.58-.39l-.84-1.68a.678.678 0 0 1-.122-.58l.122-1.307a.678.678 0 0 0-.122-.58L6.5 4.5a.678.678 0 0 0-.58-.39l-1.307-.122a.678.678 0 0 0-.58.122L2.328 3.654z"
                            fill="#60A5FA"
                          />
                        </svg>
                        <span className="text-sm text-theme-tertiary">
                          Phone Number:
                        </span>
                        <span className="text-sm text-theme-primary">
                          {data.businessProfileRef.dialCode || ""}{" "}
                          {data.businessProfileRef.phoneNumber}
                        </span>
                      </div>
                    )}
                    {data && data.businessProfileRef?.email && (
                      <div className="flex items-center gap-2">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.123L2 9.268v4.991a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.268l-4.966 2.991Z"
                            fill="#60A5FA"
                          />
                        </svg>
                        <span className="text-sm text-theme-tertiary">
                          Email:
                        </span>
                        <span className="text-sm text-theme-primary">
                          {data.businessProfileRef.email}
                        </span>
                      </div>
                    )}
                    {data && data.businessProfileRef?.gstn && (
                      <div className="flex items-center gap-2">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"
                            fill="#60A5FA"
                          />
                        </svg>
                        <span className="text-sm text-theme-tertiary">
                          GSTIN:
                        </span>
                        <span className="text-sm text-theme-primary">
                          {data.businessProfileRef.gstn || "-"}
                        </span>
                      </div>
                    )}
                    {data && data.businessProfileRef?.address && (
                      <div className="flex items-start gap-2">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mt-0.5"
                        >
                          <path
                            d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
                            fill="#60A5FA"
                          />
                        </svg>
                        <div className="flex flex-col">
                          <span className="text-sm text-theme-tertiary">
                            Address:
                          </span>
                          <span className="text-sm text-theme-primary">
                            {data.businessProfileRef.address.street || ""},{" "}
                            {data.businessProfileRef.address.city || ""},{" "}
                            {data.businessProfileRef.address.state || ""},{" "}
                            {data.businessProfileRef.address.country || ""} -{" "}
                            {data.businessProfileRef.address.zipCode || ""}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Description */}
                  {data && data.businessProfileRef?.bio && (
                    <p className="text-sm text-theme-secondary mt-2">
                      {data.businessProfileRef.bio}
                    </p>
                  )}
                </div>
              </div>
              {/* QR Code Section */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h5 className="text-xl font-bold text-theme-primary">
                    Download QR
                  </h5>
                  <button
                    onClick={downloadQR}
                    className="flex items-center justify-center gap-2 w-10 h-10 rounded-full bg-primary hover:bg-primary/80 transition-colors"
                    title="Download QR Code"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 2.5V12.5M10 12.5L6 8.5M10 12.5L14 8.5M2.5 15V16.25C2.5 17.2165 3.2835 18 4.25 18H15.75C16.7165 18 17.5 17.2165 17.5 16.25V15"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <div className="w-full max-w-[300px] mx-auto aspect-square bg-white rounded-lg border border-theme-primary flex justify-center items-center p-4">
                  <Image
                    src={qr}
                    alt="Business QR Code"
                    width={200}
                    height={200}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    </>
  );
};

export default Profile;
