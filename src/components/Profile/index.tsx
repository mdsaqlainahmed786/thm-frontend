"use client";
import Image from "next/image";
import { User, UserProfile } from "@/types/user";
import React, { useEffect, useState } from "react";
import SwitcherThree from "../Switchers/SwitcherThree";
import apiRequest from "@/api-services/app-client";
import { handleClientApiErrors } from "@/api-services/api-errors";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Button from "../Button";

export const DefaultProfilePic = "/images/user-placeholder.jpg";
export const DefaultCoverPic = "/images/cover/cover-01.png";

function encodeURIComponentToImage(data: string | Blob): string {
  if (data instanceof Blob) {
    return URL.createObjectURL(data);
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(data)}`;
}
async function getBusinessQr(businessID: string): Promise<any> {
  try {
    const response = await apiRequest.get(
      `/admin/business/${businessID}/generate-qr`,
      {
        responseType: "blob",
      }
    );
    if (response.status && response.data) {
      return response.data;
    }
    throw new Error("Invalid response data");
  } catch (error) {
    console.error(error);
    throw error; // Re-throwing the error to propagate it
  }
}

const Profile: React.FC<{
  user: UserProfile | undefined;
  loading: boolean;
  edit: boolean;
}> = ({ loading, user, edit }) => {
  const { data: session, update } = useSession();
  /**
   *State to determine login admin profile or user profile
   */
  const [profile, setProfile] = useState(false);
  let profilePic: string = DefaultProfilePic;
  let bio: string = "-";
  let businessName = "-";
  let businessEmail = "-";
  let website = "";
  let gstn = "-";
  let businessPhoneNumber = "";
  let businessAddress = "";
  let amenities: any[] = [];
  let businessType = "";
  let businessSubtype = "";
  let businessDocuments: any[] = [];
  let coverPicture = DefaultCoverPic;
  if (user?.accountType === "business") {
    if (user.businessProfileRef?.profilePic?.small) {
      profilePic = user.businessProfileRef?.profilePic?.small;
    }
    if (user && user.businessProfileRef && user.businessProfileRef.bio) {
      bio = user.businessProfileRef.bio;
    }
    if (user && user.businessProfileRef && user.businessProfileRef.email) {
      businessEmail = user.businessProfileRef.email;
    }
    if (user && user.businessProfileRef && user.businessProfileRef.name) {
      businessName = user.businessProfileRef.name;
    }
    if (
      user &&
      user.businessProfileRef &&
      user.businessProfileRef.phoneNumber &&
      user.businessProfileRef.dialCode
    ) {
      businessPhoneNumber = `${user.businessProfileRef.dialCode} ${user.businessProfileRef.phoneNumber}`;
    }
    if (user && user.businessProfileRef && user.businessProfileRef.address) {
      businessAddress = `${user.businessProfileRef.address.street}, ${user.businessProfileRef.address.city}, ${user.businessProfileRef.address.city}, ${user.businessProfileRef.address.country} - ${user.businessProfileRef.address.zipCode}`;
    }
    if (
      user &&
      user.businessProfileRef.amenitiesRef &&
      user.businessProfileRef
    ) {
      amenities = user.businessProfileRef.amenitiesRef;
    }
    if (
      user &&
      user.businessProfileRef &&
      user.businessProfileRef.businessTypeRef
    ) {
      businessType = user.businessProfileRef.businessTypeRef.name;
    }
    if (
      user &&
      user.businessProfileRef &&
      user.businessProfileRef.businessSubtypeRef
    ) {
      businessSubtype = user.businessProfileRef.businessSubtypeRef.name;
    }
    if (user && user.businessDocumentsRef) {
      businessDocuments = user.businessDocumentsRef;
    }
    if (user && user.businessProfileRef && user.businessProfileRef.coverImage) {
      coverPicture = user.businessProfileRef.coverImage;
    }
    if (user && user.businessProfileRef && user.businessProfileRef.website) {
      website = user.businessProfileRef.website;
    }
    if (user && user.businessProfileRef && user.businessProfileRef.gstn) {
      gstn = user.businessProfileRef.gstn;
    }
  } else {
    if (user?.profilePic?.small) {
      profilePic = user?.profilePic?.small;
    }
    if (user && user.bio) {
      bio = user.bio;
    }
  }

  //App states
  const defaultQR =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53 53" shape-rendering="crispEdges"><path fill="#ffffff" d="M0 0h53v53H0z"/><path stroke="#000000" d="M4 4.5h7m2 0h5m1 0h1m1 0h1m7 0h1m1 0h1m1 0h2m5 0h1m1 0h7M4 5.5h1m5 0h1m3 0h3m1 0h1m6 0h1m1 0h2m1 0h2m3 0h1m1 0h1m1 0h1m2 0h1m5 0h1M4 6.5h1m1 0h3m1 0h1m1 0h1m1 0h4m1 0h2m1 0h3m2 0h1m1 0h1m2 0h2m2 0h2m1 0h1m2 0h1m1 0h3m1 0h1M4 7.5h1m1 0h3m1 0h1m1 0h1m1 0h1m6 0h5m1 0h1m1 0h1m5 0h1m3 0h2m1 0h1m1 0h3m1 0h1M4 8.5h1m1 0h3m1 0h1m1 0h4m6 0h8m3 0h2m1 0h5m1 0h1m1 0h3m1 0h1M4 9.5h1m5 0h1m1 0h3m3 0h3m1 0h1m1 0h1m3 0h1m1 0h4m8 0h1m5 0h1M4 10.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M12 11.5h1m1 0h1m1 0h1m1 0h1m2 0h4m3 0h1m1 0h6m4 0h1M4 12.5h1m1 0h5m3 0h1m1 0h1m5 0h1m1 0h6m3 0h3m1 0h1m1 0h1m2 0h5M7 13.5h3m2 0h1m2 0h1m5 0h3m1 0h2m1 0h2m1 0h1m1 0h3m4 0h1m3 0h5M4 14.5h1m5 0h1m1 0h1m1 0h1m2 0h2m2 0h2m4 0h1m2 0h1m2 0h1m1 0h4m2 0h3m1 0h1m1 0h1M4 15.5h1m2 0h1m4 0h2m1 0h1m1 0h1m1 0h2m2 0h2m5 0h1m1 0h3m1 0h2m3 0h2m3 0h1M6 16.5h1m2 0h4m1 0h1m1 0h4m1 0h2m1 0h2m1 0h1m3 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m3 0h1m2 0h1M6 17.5h1m4 0h3m1 0h2m1 0h3m2 0h3m2 0h2m2 0h5m2 0h3m3 0h4M4 18.5h1m1 0h7m3 0h2m1 0h1m2 0h1m1 0h1m2 0h2m5 0h1m2 0h1m2 0h1m1 0h1m3 0h1M4 19.5h1m7 0h1m2 0h4m1 0h2m1 0h1m1 0h1m1 0h4m1 0h5m2 0h3m2 0h1m1 0h3M4 20.5h3m1 0h1m1 0h3m1 0h1m1 0h1m2 0h6m2 0h2m4 0h3m3 0h1m2 0h2m1 0h1m2 0h1M4 21.5h4m5 0h6m3 0h1m3 0h4m1 0h6m2 0h3m1 0h5M5 22.5h1m4 0h1m2 0h1m2 0h5m6 0h2m1 0h1m4 0h3m1 0h1m3 0h3m1 0h1M4 23.5h1m3 0h2m1 0h4m1 0h2m1 0h5m1 0h1m3 0h7m3 0h1m4 0h4M4 24.5h1m1 0h8m1 0h1m1 0h3m1 0h2m1 0h5m1 0h1m4 0h1m1 0h1m2 0h7M4 25.5h1m3 0h1m3 0h2m2 0h1m1 0h1m3 0h1m1 0h1m3 0h1m2 0h1m1 0h4m2 0h2m3 0h5M7 26.5h2m1 0h1m1 0h1m6 0h3m1 0h2m1 0h1m1 0h3m2 0h1m1 0h1m1 0h4m1 0h1m1 0h1m1 0h2M4 27.5h5m3 0h3m1 0h3m5 0h1m3 0h1m2 0h2m1 0h1m2 0h2m1 0h1m3 0h4M5 28.5h1m1 0h7m5 0h1m1 0h1m2 0h6m4 0h2m1 0h1m2 0h6m1 0h1M8 29.5h2m1 0h1m3 0h2m5 0h7m4 0h3m4 0h2m1 0h1m1 0h1m2 0h1M4 30.5h1m2 0h2m1 0h1m2 0h4m1 0h4m3 0h2m3 0h1m2 0h3m1 0h2m4 0h1m1 0h1m1 0h1M6 31.5h1m2 0h1m3 0h1m1 0h4m3 0h2m2 0h3m4 0h1m1 0h1m1 0h3m1 0h2m2 0h4M6 32.5h3m1 0h1m2 0h1m1 0h2m3 0h3m1 0h1m2 0h1m1 0h1m3 0h1m1 0h1m1 0h2m1 0h1m1 0h1m1 0h1M7 33.5h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m2 0h1m7 0h2m1 0h5m3 0h1m2 0h1m2 0h2M4 34.5h1m3 0h1m1 0h3m1 0h6m2 0h1m1 0h1m3 0h1m1 0h2m2 0h2m1 0h1m5 0h1m1 0h1m1 0h1M6 35.5h2m3 0h1m5 0h1m2 0h2m3 0h1m2 0h1m2 0h3m2 0h1m2 0h1m2 0h2m1 0h2m1 0h1M5 36.5h1m1 0h1m2 0h1m5 0h1m1 0h1m1 0h1m1 0h1m2 0h1m1 0h3m1 0h1m2 0h2m1 0h2m1 0h3m2 0h1m2 0h1M4 37.5h1m1 0h2m3 0h2m2 0h1m3 0h1m4 0h1m1 0h2m1 0h1m3 0h2m5 0h1m1 0h1m5 0h1M8 38.5h1m1 0h1m1 0h1m2 0h1m1 0h4m3 0h1m1 0h1m3 0h3m3 0h1m2 0h3m4 0h2M5 39.5h4m3 0h3m3 0h5m1 0h6m4 0h7m2 0h1m1 0h2M4 40.5h1m2 0h2m1 0h2m1 0h1m1 0h2m1 0h2m1 0h8m4 0h3m2 0h1m1 0h8M12 41.5h1m1 0h6m1 0h2m1 0h1m3 0h2m1 0h4m1 0h1m2 0h2m3 0h3m1 0h1M4 42.5h7m2 0h2m2 0h3m2 0h1m1 0h1m1 0h1m1 0h1m10 0h2m1 0h1m1 0h1m1 0h2M4 43.5h1m5 0h1m1 0h5m1 0h2m3 0h2m3 0h9m2 0h2m3 0h4M4 44.5h1m1 0h3m1 0h1m1 0h1m1 0h2m4 0h1m3 0h5m1 0h1m2 0h1m5 0h7m2 0h1M4 45.5h1m1 0h3m1 0h1m1 0h1m1 0h2m3 0h1m1 0h1m4 0h2m1 0h1m3 0h3m3 0h1m3 0h2m2 0h2M4 46.5h1m1 0h3m1 0h1m1 0h1m3 0h1m3 0h1m1 0h1m2 0h1m2 0h1m1 0h1m1 0h1m1 0h1m1 0h3m1 0h3m2 0h3M4 47.5h1m5 0h1m2 0h2m1 0h3m3 0h3m1 0h3m1 0h3m2 0h3m3 0h1m2 0h3M4 48.5h7m1 0h1m1 0h1m2 0h2m1 0h2m1 0h1m2 0h3m4 0h2m3 0h1m1 0h3m4 0h1"/></svg>';
  const [qr, setQR] = useState(encodeURIComponentToImage(defaultQR));
  const [modal, setModal] = useState(edit);

  const initialFormInputs = {
    bio: "",
    // accountType: string
    // otp: number
    isVerified: false,
    isApproved: false,
    isActivated: false,
    isDeleted: false,
    hasProfilePicture: false,
    acceptedTerms: false,
    privateAccount: false,
    notificationEnabled: false,
    email: "",
    username: "",
    name: "",
    dialCode: "",
    phoneNumber: "",
    businessEmail: "",
    businessPhoneNumber: "",
    businessDialCode: "",
    profilePic: profilePic,
    role: "",
    // businessProfileID: string
  };
  const [formInputs, setFormInputs] = useState(initialFormInputs);
  useEffect(() => {
    setFormInputs((prev) => ({
      ...prev,
      name: user?.name ?? "",
      bio: bio ?? "",
      email: user?.email ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      dialCode: user?.dialCode ?? "",
      businessEmail: user?.businessProfileRef?.email ?? "",
      businessPhoneNumber: user?.businessProfileRef?.phoneNumber ?? "",
      businessDialCode: user?.businessProfileRef?.dialCode ?? "",
      isVerified: user?.isVerified ?? false,
      isApproved: user?.isApproved ?? false,
      isActivated: user?.isActivated ?? false,
      role: user?.role ?? "",
      isDeleted: user?.isDeleted ?? false,
    }));
    if (
      session &&
      session.user &&
      session.user._id &&
      user &&
      user._id &&
      session.user._id === user._id
    ) {
      setProfile(true);
    }
    if (user && user.businessProfileID && user.accountType === "business") {
      getBusinessQr(user.businessProfileID)
        .then((data) => {
          setQR(encodeURIComponentToImage(data));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user, session]);
  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    try {
      e.preventDefault();
      const response = await apiRequest.put(
        `/admin/users/${user?._id}`,
        formInputs
      );
      if (response.status === 200 && response.data.status) {
        const responseData = response.data.data;
        const responseMessage = responseData.message;
        toast.success(responseMessage ?? "User updated");
        //Update session data
        if (
          profile &&
          responseData &&
          responseData.name &&
          responseData.profilePic
        ) {
          update({
            name: responseData.name,
            profilePic: responseData.profilePic,
          });
        }
        setModal(false);
      } else {
        toast.error(response?.data?.message ?? "Something went wrong");
      }
    } catch (error) {
      handleClientApiErrors(error);
    }
  };
  const handleProfileChange: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    try {
      const newFromData = new FormData();
      if (e.target.files && e.target.files.length !== 0) {
        newFromData.append("profilePic", e.target.files[0]);
      }
      const response = await apiRequest.post(
        `/user/edit-profile-pic`,
        newFromData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200 && response.data.status) {
        const responseData = response.data.data;
        const responseMessage = responseData.message;
        toast.success(responseMessage ?? "User updated");
        //Update session data
        if (
          profile &&
          responseData &&
          responseData.name &&
          responseData.profilePic
        ) {
          // setFormInputs({
          //     ...formInputs,
          //     profilePic: responseData.profilePic.small
          // });
          update({
            name: responseData.name,
            profilePic: responseData.profilePic,
          });
        }
        setModal(false);
      } else {
        toast.error(response?.data?.message ?? "Something went wrong");
      }
    } catch (error) {
      handleClientApiErrors(error);
    }
  };
  const downloadQR = () => {
    if (user && user.businessProfileID) {
      getBusinessQr(user.businessProfileID)
        .then((qrData) => {
          const url = window.URL.createObjectURL(qrData);
          const link = document.createElement("a");
          link.href = url;
          const fileName = "Business-QR.png";
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          toast.success("QR code downloaded successfully");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Failed to download QR code");
        });
    } else {
      toast.error("Business ID not found.");
    }
  };
  const onDownloadClick = (link: string) => {
    if (link) {
      fetch(link).then((response) => {
        response.blob().then((blob) => {
          const filename = link.substring(link.lastIndexOf("/") + 1);
          const fileURL = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.href = fileURL;
          aLink.download = filename;
          aLink.click();
        });
      });
    }
  };
  return (
    <>
      <div
        className={`overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          loading ? "animate-pulse" : null
        } `}
      >
        {/* Edit User Model */}
        <div
          className={`${
            modal ? "" : "hidden"
          } fixed left-0 top-0 z-999999 flex h-screen w-full justify-center overflow-y-scroll bg-black/80 px-4 py-5`}
        >
          <div className="relative m-auto w-full max-w-180 rounded-sm border border-stroke bg-gray p-4 shadow-default dark:border-strokedark dark:bg-meta-4 sm:p-8 xl:p-10">
            <button
              className="absolute right-1 top-1 sm:right-5 sm:top-5"
              type="button"
              onClick={() => setModal(false)}
            >
              <svg
                className="fill-current"
                width="20"
                height="20"
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
            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label
                  htmlFor="name"
                  className="mb-1 block font-medium text-black dark:text-white"
                >
                  Name
                </label>
                <input
                  id="name"
                  placeholder="Enter name"
                  required={true}
                  className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
                  type="text"
                  name="name"
                  value={formInputs.name}
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, name: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="bio"
                  className="mb-1 block font-medium text-black dark:text-white"
                >
                  Bio
                </label>
                <textarea
                  name="bio"
                  id="bio"
                  cols={30}
                  rows={4}
                  placeholder="Enter task description"
                  className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary"
                  value={formInputs.bio}
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, bio: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="taskList"
                  className="mb-1 block font-medium text-black dark:text-white"
                >
                  Login Credential
                </label>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-12.5 w-12.5 items-center justify-center rounded-sm border border-stroke bg-white p-4 hover:text-primary dark:border-strokedark dark:bg-boxdark">
                      <svg
                        className="fill-current"
                        width="18"
                        height="19"
                        viewBox="0 0 18 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.7499 2.75208H2.2499C1.29365 2.75208 0.478027 3.53957 0.478027 4.52395V13.6364C0.478027 14.5927 1.26553 15.4083 2.2499 15.4083H15.7499C16.7062 15.4083 17.5218 14.6208 17.5218 13.6364V4.49583C17.5218 3.53958 16.7062 2.75208 15.7499 2.75208ZM15.7499 4.0177C15.778 4.0177 15.8062 4.0177 15.8343 4.0177L8.9999 8.4052L2.16553 4.0177C2.19365 4.0177 2.22178 4.0177 2.2499 4.0177H15.7499ZM15.7499 14.0865H2.2499C1.96865 14.0865 1.74365 13.8615 1.74365 13.5802V5.2552L8.3249 9.47395C8.52178 9.61457 8.74678 9.67083 8.97178 9.67083C9.19678 9.67083 9.42178 9.61457 9.61865 9.47395L16.1999 5.2552V13.6083C16.2562 13.8896 16.0312 14.0865 15.7499 14.0865Z"
                          fill=""
                        ></path>
                      </svg>
                    </div>
                    <input
                      id="email"
                      placeholder="Enter list text"
                      className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary disabled:opacity-60"
                      type="text"
                      name="email"
                      disabled={true}
                      value={formInputs.email}
                    />
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-12.5 w-12.5 items-center justify-center rounded-sm border border-stroke bg-white p-4 hover:text-primary dark:border-strokedark dark:bg-boxdark">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.9655 12.6929C15.672 12.5811 15.5252 12.5251 15.3708 12.5118C15.2164 12.4984 15.0622 12.5283 14.7538 12.5881L12.3984 13.0445C12.0235 13.1172 11.836 13.1535 11.6427 13.1227C11.4493 13.0918 11.2957 13.0064 10.9886 12.8356C9.07557 11.7718 7.78657 10.5439 6.95042 8.81181C6.827 8.55614 6.76529 8.4283 6.74183 8.25256C6.71837 8.07683 6.74863 7.91452 6.80915 7.5899L7.27298 5.1021C7.32932 4.79993 7.35749 4.64884 7.3442 4.49766C7.33092 4.34649 7.27683 4.20263 7.16866 3.91491L6.61323 2.43758C6.35178 1.74217 6.22105 1.39447 5.93618 1.19723C5.65132 1 5.27985 1 4.53692 1H2.68622C1.66783 1 0.866113 1.84144 1.01869 2.8481C1.39788 5.36068 2.51739 9.91727 5.78835 13.1882C9.22363 16.6235 14.172 18.1141 16.895 18.7072C17.9468 18.9357 18.8794 18.1159 18.8794 17.0388V15.3317C18.8794 14.592 18.8794 14.2222 18.6836 13.938C18.4877 13.6538 18.1421 13.5222 17.4509 13.2588L15.9655 12.6929Z"
                          className="fill-current"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </div>
                    <input
                      id="dialCode"
                      placeholder="+91"
                      className="w-12.5 rounded-sm border border-stroke bg-white px-2 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary disabled:opacity-60"
                      type="text"
                      name="dialCode"
                      value={formInputs.dialCode}
                      disabled={true}
                    />
                    <input
                      id="phoneNumbers"
                      placeholder="Enter phone number"
                      className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary disabled:opacity-60"
                      type="text"
                      name="phoneNumbers"
                      value={formInputs.phoneNumber}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
              {/* Business Profile  */}
              {user && user.accountType === "business" ? (
                <div className="mb-3">
                  <label
                    htmlFor="taskList"
                    className="mb-1 block font-medium text-black dark:text-white"
                  >
                    Business Contact
                  </label>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-12.5 w-12.5 items-center justify-center rounded-sm border border-stroke bg-white p-4 hover:text-primary dark:border-strokedark dark:bg-boxdark">
                        <svg
                          className="fill-current"
                          width="18"
                          height="19"
                          viewBox="0 0 18 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.7499 2.75208H2.2499C1.29365 2.75208 0.478027 3.53957 0.478027 4.52395V13.6364C0.478027 14.5927 1.26553 15.4083 2.2499 15.4083H15.7499C16.7062 15.4083 17.5218 14.6208 17.5218 13.6364V4.49583C17.5218 3.53958 16.7062 2.75208 15.7499 2.75208ZM15.7499 4.0177C15.778 4.0177 15.8062 4.0177 15.8343 4.0177L8.9999 8.4052L2.16553 4.0177C2.19365 4.0177 2.22178 4.0177 2.2499 4.0177H15.7499ZM15.7499 14.0865H2.2499C1.96865 14.0865 1.74365 13.8615 1.74365 13.5802V5.2552L8.3249 9.47395C8.52178 9.61457 8.74678 9.67083 8.97178 9.67083C9.19678 9.67083 9.42178 9.61457 9.61865 9.47395L16.1999 5.2552V13.6083C16.2562 13.8896 16.0312 14.0865 15.7499 14.0865Z"
                            fill=""
                          ></path>
                        </svg>
                      </div>
                      <input
                        id="email"
                        placeholder="Enter list text"
                        className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary disabled:opacity-60"
                        type="text"
                        name="email"
                        disabled={true}
                        value={formInputs.businessEmail}
                      />
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-12.5 w-12.5 items-center justify-center rounded-sm border border-stroke bg-white p-4 hover:text-primary dark:border-strokedark dark:bg-boxdark">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.9655 12.6929C15.672 12.5811 15.5252 12.5251 15.3708 12.5118C15.2164 12.4984 15.0622 12.5283 14.7538 12.5881L12.3984 13.0445C12.0235 13.1172 11.836 13.1535 11.6427 13.1227C11.4493 13.0918 11.2957 13.0064 10.9886 12.8356C9.07557 11.7718 7.78657 10.5439 6.95042 8.81181C6.827 8.55614 6.76529 8.4283 6.74183 8.25256C6.71837 8.07683 6.74863 7.91452 6.80915 7.5899L7.27298 5.1021C7.32932 4.79993 7.35749 4.64884 7.3442 4.49766C7.33092 4.34649 7.27683 4.20263 7.16866 3.91491L6.61323 2.43758C6.35178 1.74217 6.22105 1.39447 5.93618 1.19723C5.65132 1 5.27985 1 4.53692 1H2.68622C1.66783 1 0.866113 1.84144 1.01869 2.8481C1.39788 5.36068 2.51739 9.91727 5.78835 13.1882C9.22363 16.6235 14.172 18.1141 16.895 18.7072C17.9468 18.9357 18.8794 18.1159 18.8794 17.0388V15.3317C18.8794 14.592 18.8794 14.2222 18.6836 13.938C18.4877 13.6538 18.1421 13.5222 17.4509 13.2588L15.9655 12.6929Z"
                            className="fill-current"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                      </div>
                      <input
                        id="dialCode"
                        placeholder="+91"
                        className="w-12.5 rounded-sm border border-stroke bg-white px-2 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary disabled:opacity-60"
                        type="text"
                        name="dialCode"
                        value={formInputs.businessDialCode}
                        disabled={true}
                      />
                      <input
                        id="phoneNumbers"
                        placeholder="Enter phone number"
                        className="w-full rounded-sm border border-stroke bg-white px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-boxdark dark:text-white dark:focus:border-primary disabled:opacity-60"
                        type="text"
                        name="phoneNumbers"
                        value={formInputs.businessPhoneNumber}
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
              {!profile && (
                <div className="mb-5">
                  <div className="grid grid-cols-4">
                    <div>
                      <label
                        htmlFor="isVerified"
                        className="mb-1 block font-medium text-black dark:text-white"
                      >
                        Verified
                      </label>
                      <div>
                        <SwitcherThree
                          id="isVerified"
                          enabled={formInputs.isVerified}
                          setEnabled={(e) =>
                            setFormInputs({
                              ...formInputs,
                              isVerified: !formInputs.isVerified,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="isApproved"
                        className="mb-1 block font-medium text-black dark:text-white"
                      >
                        Approved
                      </label>
                      <div>
                        <SwitcherThree
                          id="isApproved"
                          enabled={formInputs.isApproved}
                          setEnabled={(e) =>
                            setFormInputs({
                              ...formInputs,
                              isApproved: !formInputs.isApproved,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="isActivated"
                        className="mb-1 block font-medium text-black dark:text-white"
                      >
                        Activated
                      </label>
                      <div>
                        <SwitcherThree
                          id="isActivated"
                          enabled={formInputs.isActivated}
                          setEnabled={(e) =>
                            setFormInputs({
                              ...formInputs,
                              isActivated: !formInputs.isActivated,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="isDeleted"
                        className="mb-1 block font-medium text-black dark:text-white"
                      >
                        Delete
                      </label>
                      <div>
                        <SwitcherThree
                          id="isDeleted"
                          enabled={formInputs.isDeleted}
                          setEnabled={(e) =>
                            setFormInputs({
                              ...formInputs,
                              isDeleted: !formInputs.isDeleted,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="mb-3">
                <label
                  htmlFor="bio"
                  className="mb-1 block font-medium text-black dark:text-white"
                >
                  Role
                </label>
                <div className="relative z-20 bg-white dark:bg-form-input">
                  <select
                    disabled={["administrator", "official"].includes(
                      formInputs.role
                    )}
                    className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-4 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black dark:text-white"
                    required={true}
                    value={formInputs.role}
                    onChange={(e) =>
                      setFormInputs({ ...formInputs, role: e.target.value })
                    }
                  >
                    <option
                      value=""
                      disabled={false}
                      className="text-body dark:text-bodydark"
                    >
                      Select Business Type
                    </option>
                    {["administrator", "official"].includes(formInputs.role) ? (
                      <>
                        <option
                          value="administrator"
                          className="text-body dark:text-bodydark"
                        >
                          Administrator
                        </option>
                        <option
                          value="official"
                          className="text-body dark:text-bodydark"
                        >
                          Official
                        </option>
                      </>
                    ) : null}
                    <option
                      value="user"
                      className="text-body dark:text-bodydark"
                    >
                      User
                    </option>
                    <option
                      value="moderator"
                      className="text-body dark:text-bodydark"
                    >
                      Moderator
                    </option>
                  </select>
                  <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                    <DownArrowIcon />
                  </span>
                </div>
              </div>

              {/* <div className="mb-5">
                            <label htmlFor="taskImg" className="mb-1 block font-medium text-black dark:text-white">Add image</label>
                            <div>
                                <div id="FileUpload" className="relative block w-full appearance-none rounded-sm border border-dashed border-stroke bg-white px-4 py-4 dark:border-strokedark dark:bg-boxdark sm:py-14">
                                    <input accept="image/*" className="absolute inset-0 z-50 m-0 h-full w-full p-0 opacity-0 outline-none" type="file" />
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <span className="flex h-11.5 w-11.5 items-center justify-center rounded-full border border-stroke bg-primary/5 dark:border-strokedark">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_75_12841)">
                                                    <path d="M2.5 15.8333H17.5V17.5H2.5V15.8333ZM10.8333 4.85663V14.1666H9.16667V4.85663L4.1075 9.91663L2.92917 8.73829L10 1.66663L17.0708 8.73746L15.8925 9.91579L10.8333 4.85829V4.85663Z" fill="#3C50E0"></path>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_75_12841">
                                                        <rect width="20" height="20" fill="white"></rect>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </span>
                                        <p className="text-xs"><span className="text-primary">Click to upload</span> or drag and drop</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="taskImg" className="mb-1 block font-medium text-black dark:text-white">Add image</label>
                            <div>
                                <div id="FileUpload" className="relative block w-full appearance-none rounded-sm border border-dashed border-stroke bg-white px-4 py-4 dark:border-strokedark dark:bg-boxdark sm:py-14">
                                    <input accept="image/*" className="absolute inset-0 z-50 m-0 h-full w-full p-0 opacity-0 outline-none" type="file" />
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <span className="flex h-11.5 w-11.5 items-center justify-center rounded-full border border-stroke bg-primary/5 dark:border-strokedark">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_75_12841)">
                                                    <path d="M2.5 15.8333H17.5V17.5H2.5V15.8333ZM10.8333 4.85663V14.1666H9.16667V4.85663L4.1075 9.91663L2.92917 8.73829L10 1.66663L17.0708 8.73746L15.8925 9.91579L10.8333 4.85829V4.85663Z" fill="#3C50E0"></path>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_75_12841">
                                                        <rect width="20" height="20" fill="white"></rect>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </span>
                                        <p className="text-xs"><span className="text-primary">Click to upload</span> or drag and drop</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-5">
                            <label htmlFor="taskImg" className="mb-1 block font-medium text-black dark:text-white">Add image</label>
                            <div>
                                <div id="FileUpload" className="relative block w-full appearance-none rounded-sm border border-dashed border-stroke bg-white px-4 py-4 dark:border-strokedark dark:bg-boxdark sm:py-14">
                                    <input accept="image/*" className="absolute inset-0 z-50 m-0 h-full w-full p-0 opacity-0 outline-none" type="file" />
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <span className="flex h-11.5 w-11.5 items-center justify-center rounded-full border border-stroke bg-primary/5 dark:border-strokedark">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_75_12841)">
                                                    <path d="M2.5 15.8333H17.5V17.5H2.5V15.8333ZM10.8333 4.85663V14.1666H9.16667V4.85663L4.1075 9.91663L2.92917 8.73829L10 1.66663L17.0708 8.73746L15.8925 9.91579L10.8333 4.85829V4.85663Z" fill="#3C50E0"></path>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_75_12841">
                                                        <rect width="20" height="20" fill="white"></rect>
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        </span>
                                        <p className="text-xs"><span className="text-primary">Click to upload</span> or drag and drop</p>
                                    </div>
                                </div>
                            </div>
                        </div> */}
              <button className="flex w-full items-center justify-center gap-2 rounded bg-primary px-4.5 py-2.5 font-medium text-white hover:bg-opacity-90">
                {profile ? "Update Profile" : "Update User"}
              </button>
            </form>
          </div>
        </div>
        {/* Edit User Model */}
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src={coverPicture || DefaultCoverPic}
            alt="profile cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
            width={970}
            height={260}
          />
          <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
            <div>
              <button
                className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary px-2 py-1 text-sm font-medium text-white hover:bg-opacity-80 xsm:px-4"
                onClick={() => setModal(true)}
              >
                <span>
                  <svg
                    className="fill-current"
                    width="14"
                    height="14"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.8656 8.86874C20.5219 8.49062 20.0406 8.28437 19.525 8.28437H19.4219C19.25 8.28437 19.1125 8.18124 19.0781 8.04374C19.0437 7.90624 18.975 7.80312 18.9406 7.66562C18.8719 7.52812 18.9406 7.39062 19.0437 7.28749L19.1125 7.21874C19.4906 6.87499 19.6969 6.39374 19.6969 5.87812C19.6969 5.36249 19.525 4.88124 19.1469 4.50312L17.8062 3.12812C17.0844 2.37187 15.8469 2.33749 15.0906 3.09374L14.9875 3.16249C14.8844 3.26562 14.7125 3.29999 14.5406 3.23124C14.4031 3.16249 14.2656 3.09374 14.0937 3.05937C13.9219 2.99062 13.8187 2.85312 13.8187 2.71562V2.54374C13.8187 1.47812 12.9594 0.618744 11.8937 0.618744H9.96875C9.45312 0.618744 8.97187 0.824994 8.62812 1.16874C8.25 1.54687 8.07812 2.02812 8.07812 2.50937V2.64687C8.07812 2.78437 7.975 2.92187 7.8375 2.99062C7.76875 3.02499 7.73437 3.02499 7.66562 3.05937C7.52812 3.12812 7.35625 3.09374 7.25312 2.99062L7.18437 2.88749C6.84062 2.50937 6.35937 2.30312 5.84375 2.30312C5.32812 2.30312 4.84687 2.47499 4.46875 2.85312L3.09375 4.19374C2.3375 4.91562 2.30312 6.15312 3.05937 6.90937L3.12812 7.01249C3.23125 7.11562 3.26562 7.28749 3.19687 7.39062C3.12812 7.52812 3.09375 7.63124 3.025 7.76874C2.95625 7.90624 2.85312 7.97499 2.68125 7.97499H2.57812C2.0625 7.97499 1.58125 8.14687 1.20312 8.52499C0.824996 8.86874 0.618746 9.34999 0.618746 9.86562L0.584371 11.7906C0.549996 12.8562 1.40937 13.7156 2.475 13.75H2.57812C2.75 13.75 2.8875 13.8531 2.92187 13.9906C2.99062 14.0937 3.05937 14.1969 3.09375 14.3344C3.12812 14.4719 3.09375 14.6094 2.99062 14.7125L2.92187 14.7812C2.54375 15.125 2.3375 15.6062 2.3375 16.1219C2.3375 16.6375 2.50937 17.1187 2.8875 17.4969L4.22812 18.8719C4.95 19.6281 6.1875 19.6625 6.94375 18.9062L7.04687 18.8375C7.15 18.7344 7.32187 18.7 7.49375 18.7687C7.63125 18.8375 7.76875 18.9062 7.94062 18.9406C8.1125 19.0094 8.21562 19.1469 8.21562 19.2844V19.4219C8.21562 20.4875 9.075 21.3469 10.1406 21.3469H12.0656C13.1312 21.3469 13.9906 20.4875 13.9906 19.4219V19.2844C13.9906 19.1469 14.0937 19.0094 14.2312 18.9406C14.3 18.9062 14.3344 18.9062 14.4031 18.8719C14.575 18.8031 14.7125 18.8375 14.8156 18.9406L14.8844 19.0437C15.2281 19.4219 15.7094 19.6281 16.225 19.6281C16.7406 19.6281 17.2219 19.4562 17.6 19.0781L18.975 17.7375C19.7312 17.0156 19.7656 15.7781 19.0094 15.0219L18.9406 14.9187C18.8375 14.8156 18.8031 14.6437 18.8719 14.5406C18.9406 14.4031 18.975 14.3 19.0437 14.1625C19.1125 14.025 19.25 13.9562 19.3875 13.9562H19.4906H19.525C20.5562 13.9562 21.4156 13.1312 21.45 12.0656L21.4844 10.1406C21.4156 9.72812 21.2094 9.21249 20.8656 8.86874ZM19.8344 12.1C19.8344 12.3062 19.6625 12.4781 19.4562 12.4781H19.3531H19.3187C18.5281 12.4781 17.8062 12.9594 17.5312 13.6469C17.4969 13.75 17.4281 13.8531 17.3937 13.9562C17.0844 14.6437 17.2219 15.5031 17.7719 16.0531L17.8406 16.1562C17.9781 16.2937 17.9781 16.5344 17.8406 16.6719L16.4656 18.0125C16.3625 18.1156 16.2594 18.1156 16.1906 18.1156C16.1219 18.1156 16.0187 18.1156 15.9156 18.0125L15.8469 17.9094C15.2969 17.325 14.4719 17.1531 13.7156 17.4969L13.5781 17.5656C12.8219 17.875 12.3406 18.5625 12.3406 19.3531V19.4906C12.3406 19.6969 12.1687 19.8687 11.9625 19.8687H10.0375C9.83125 19.8687 9.65937 19.6969 9.65937 19.4906V19.3531C9.65937 18.5625 9.17812 17.8406 8.42187 17.5656C8.31875 17.5312 8.18125 17.4625 8.07812 17.4281C7.80312 17.2906 7.52812 17.2562 7.25312 17.2562C6.77187 17.2562 6.29062 17.4281 5.9125 17.8062L5.84375 17.8406C5.70625 17.9781 5.46562 17.9781 5.32812 17.8406L3.9875 16.4656C3.88437 16.3625 3.88437 16.2594 3.88437 16.1906C3.88437 16.1219 3.88437 16.0187 3.9875 15.9156L4.05625 15.8469C4.64062 15.2969 4.8125 14.4375 4.50312 13.75C4.46875 13.6469 4.43437 13.5437 4.36562 13.4406C4.09062 12.7187 3.40312 12.2031 2.6125 12.2031H2.50937C2.30312 12.2031 2.13125 12.0312 2.13125 11.825L2.16562 9.89999C2.16562 9.76249 2.23437 9.69374 2.26875 9.62499C2.30312 9.59062 2.40625 9.52187 2.54375 9.52187H2.64687C3.4375 9.55624 4.15937 9.07499 4.46875 8.35312C4.50312 8.24999 4.57187 8.14687 4.60625 8.04374C4.91562 7.35624 4.77812 6.49687 4.22812 5.94687L4.15937 5.84374C4.02187 5.70624 4.02187 5.46562 4.15937 5.32812L5.53437 3.98749C5.6375 3.88437 5.74062 3.88437 5.80937 3.88437C5.87812 3.88437 5.98125 3.88437 6.08437 3.98749L6.15312 4.09062C6.70312 4.67499 7.52812 4.84687 8.28437 4.53749L8.42187 4.46874C9.17812 4.15937 9.65937 3.47187 9.65937 2.68124V2.54374C9.65937 2.40624 9.72812 2.33749 9.7625 2.26874C9.79687 2.19999 9.9 2.16562 10.0375 2.16562H11.9625C12.1687 2.16562 12.3406 2.33749 12.3406 2.54374V2.68124C12.3406 3.47187 12.8219 4.19374 13.5781 4.46874C13.6812 4.50312 13.8187 4.57187 13.9219 4.60624C14.6437 4.94999 15.5031 4.81249 16.0875 4.26249L16.1906 4.19374C16.3281 4.05624 16.5687 4.05624 16.7062 4.19374L18.0469 5.56874C18.15 5.67187 18.15 5.77499 18.15 5.84374C18.15 5.91249 18.1156 6.01562 18.0469 6.11874L17.9781 6.18749C17.3594 6.70312 17.1875 7.56249 17.4625 8.24999C17.4969 8.35312 17.5312 8.45624 17.6 8.55937C17.875 9.28124 18.5625 9.79687 19.3531 9.79687H19.4562C19.5937 9.79687 19.6625 9.86562 19.7312 9.89999C19.8 9.93437 19.8344 10.0375 19.8344 10.175V12.1Z"
                      fill=""
                    ></path>
                    <path
                      d="M11 6.32498C8.42189 6.32498 6.32501 8.42186 6.32501 11C6.32501 13.5781 8.42189 15.675 11 15.675C13.5781 15.675 15.675 13.5781 15.675 11C15.675 8.42186 13.5781 6.32498 11 6.32498ZM11 14.1281C9.28126 14.1281 7.87189 12.7187 7.87189 11C7.87189 9.28123 9.28126 7.87186 11 7.87186C12.7188 7.87186 14.1281 9.28123 14.1281 11C14.1281 12.7187 12.7188 14.1281 11 14.1281Z"
                      fill=""
                    ></path>
                  </svg>
                </span>
                <span>{profile ? "Edit" : "Edit User"}</span>
              </button>
            </div>
            {/* <label
                        htmlhtmlFor="cover"
                        className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary px-2 py-1 text-sm font-medium text-white hover:bg-opacity-80 xsm:px-4"
                    >
                        <input
                            type="file"
                            name="cover"
                            id="cover"
                            className="sr-only"
                        />
                        <span>
                            <svg
                                className="fill-current"
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                                    fill="white"
                                />
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.99992 5.83329C6.03342 5.83329 5.24992 6.61679 5.24992 7.58329C5.24992 8.54979 6.03342 9.33329 6.99992 9.33329C7.96642 9.33329 8.74992 8.54979 8.74992 7.58329C8.74992 6.61679 7.96642 5.83329 6.99992 5.83329ZM4.08325 7.58329C4.08325 5.97246 5.38909 4.66663 6.99992 4.66663C8.61075 4.66663 9.91659 5.97246 9.91659 7.58329C9.91659 9.19412 8.61075 10.5 6.99992 10.5C5.38909 10.5 4.08325 9.19412 4.08325 7.58329Z"
                                    fill="white"
                                />
                            </svg>
                        </span>
                        <span>Edit</span>
                    </label> */}
          </div>
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div className="relative drop-shadow-2">
              {loading ? (
                <Image
                  src={DefaultProfilePic}
                  width={160}
                  height={160}
                  style={{
                    width: "160px",
                    height: "160px",
                  }}
                  alt="profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <>
                  <Image
                    src={formInputs.profilePic}
                    width={160}
                    height={160}
                    style={{
                      width: "160px",
                      height: "160px",
                    }}
                    alt="profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                  {profile && (
                    <>
                      <label
                        htmlFor="profile"
                        className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                      >
                        <CameraSvgIcon />
                        <input
                          type="file"
                          name="profile"
                          id="profile"
                          className="sr-only"
                          onChange={handleProfileChange}
                        />
                      </label>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="mt-4 ">
            {loading ? (
              <div className="w-40 h-7 bg-gray-200 dark:bg-gray-700 mx-auto mb-3 rounded-md"></div>
            ) : (
              <h3 className=" mb-1.5 text-2xl font-semibold text-black dark:text-white">
                {user && user.name ? user.name : ""}
                <br />
                {user && user.username ? (
                  <small className="text-sm tracking-wide text-medium">
                    @{user.username}
                  </small>
                ) : (
                  ""
                )}
              </h3>
            )}
            {loading ? (
              <div className="w-65 h-5 bg-gray-200 dark:bg-gray-700 mx-auto rounded-md"></div>
            ) : (
              <p className="font-medium">{user && user.email}</p>
            )}
            <div className="mx-auto mb-5.5 mt-4.5 grid max-w-105 grid-cols-4 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                {loading ? (
                  <div className="w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                ) : (
                  <span className="font-semibold text-black dark:text-white leading-[19px]">
                    {(user && user.posts) ?? 0}
                  </span>
                )}
                <span className="text-sm">Posts</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                {loading ? (
                  <div className="w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                ) : (
                  <span className="font-semibold text-black dark:text-white leading-[19px]">
                    {(user && user.follower) ?? 0}
                  </span>
                )}
                <span className="text-sm">Followers</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                {loading ? (
                  <div className="w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                ) : (
                  <span className="font-semibold text-black dark:text-white leading-[19px]">
                    {(user && user.following) ?? 0}
                  </span>
                )}
                <span className="text-sm">Following</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                {loading ? (
                  <div className="w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                ) : (
                  <span className="font-semibold text-black dark:text-white leading-[19px]">
                    {(user && user.reportCount) ?? 0}
                  </span>
                )}
                <span className="text-sm">Reports</span>
              </div>
            </div>

            <div className="mx-auto max-w-180">
              <h4 className="font-semibold text-black dark:text-white">Bio</h4>
              {loading ? (
                <div className="mt-2.5 max-w-100 mx-auto flex flex-col gap-1 justify-center items-center">
                  <div className="w-94 h-4 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
                  <div className="w-65 h-4 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
                  <div className="w-80 h-4 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
                </div>
              ) : (
                <p className="mt-2.5">{bio}</p>
              )}
            </div>
            {/* <div className="mt-6.5">
                        <h4 className="mb-3.5 font-medium text-black dark:text-white">
                            Follow me on
                        </h4>
                        <div className="flex items-center justify-center gap-3.5">
                            <Link
                                href="#"
                                className="hover:text-primary"
                                aria-label="social-icon"
                            >
                                <svg
                                    className="fill-current"
                                    width="22"
                                    height="22"
                                    viewBox="0 0 22 22"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clipPath="url(#clip0_30_966)">
                                        <path
                                            d="M12.8333 12.375H15.125L16.0416 8.70838H12.8333V6.87504C12.8333 5.93088 12.8333 5.04171 14.6666 5.04171H16.0416V1.96171C15.7428 1.92229 14.6144 1.83337 13.4227 1.83337C10.934 1.83337 9.16663 3.35229 9.16663 6.14171V8.70838H6.41663V12.375H9.16663V20.1667H12.8333V12.375Z"
                                            fill=""
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_30_966">
                                            <rect width="22" height="22" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </Link>
                            <Link
                                href="#"
                                className="hover:text-primary"
                                aria-label="social-icon"
                            >
                                <svg
                                    className="fill-current"
                                    width="23"
                                    height="22"
                                    viewBox="0 0 23 22"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clipPath="url(#clip0_30_970)">
                                        <path
                                            d="M20.9813 5.18472C20.2815 5.49427 19.5393 5.69757 18.7795 5.78789C19.5804 5.30887 20.1798 4.55498 20.4661 3.66672C19.7145 4.11405 18.8904 4.42755 18.0315 4.59714C17.4545 3.97984 16.6898 3.57044 15.8562 3.43259C15.0225 3.29474 14.1667 3.43617 13.4218 3.83489C12.6768 4.2336 12.0845 4.86726 11.7368 5.63736C11.3891 6.40746 11.3056 7.27085 11.4993 8.0933C9.97497 8.0169 8.48376 7.62078 7.12247 6.93066C5.76118 6.24054 4.56024 5.27185 3.59762 4.08747C3.25689 4.67272 3.07783 5.33801 3.07879 6.01522C3.07879 7.34439 3.75529 8.51864 4.78379 9.20614C4.17513 9.18697 3.57987 9.0226 3.04762 8.72672V8.77439C3.04781 9.65961 3.35413 10.5175 3.91465 11.2027C4.47517 11.8878 5.2554 12.3581 6.12304 12.5336C5.55802 12.6868 4.96557 12.7093 4.39054 12.5996C4.63517 13.3616 5.11196 14.028 5.75417 14.5055C6.39637 14.983 7.17182 15.2477 7.97196 15.2626C7.17673 15.8871 6.2662 16.3488 5.29243 16.6212C4.31866 16.8936 3.30074 16.9714 2.29688 16.8502C4.04926 17.9772 6.08921 18.5755 8.17271 18.5735C15.2246 18.5735 19.081 12.7316 19.081 7.66522C19.081 7.50022 19.0765 7.33339 19.0691 7.17022C19.8197 6.62771 20.4676 5.95566 20.9822 5.18564L20.9813 5.18472Z"
                                            fill=""
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_30_970">
                                            <rect
                                                width="22"
                                                height="22"
                                                fill="white"
                                                transform="translate(0.666138)"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </Link>
                            <Link
                                href="#"
                                className="hover:text-primary"
                                aria-label="social-icon"
                            >
                                <svg
                                    className="fill-current"
                                    width="23"
                                    height="22"
                                    viewBox="0 0 23 22"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clipPath="url(#clip0_30_974)">
                                        <path
                                            d="M6.69548 4.58327C6.69523 5.0695 6.50185 5.53572 6.15786 5.87937C5.81387 6.22301 5.34746 6.41593 4.86123 6.41569C4.375 6.41545 3.90878 6.22206 3.56513 5.87807C3.22149 5.53408 3.02857 5.06767 3.02881 4.58144C3.02905 4.09521 3.22244 3.62899 3.56643 3.28535C3.91042 2.9417 4.37683 2.74878 4.86306 2.74902C5.34929 2.74927 5.81551 2.94265 6.15915 3.28664C6.5028 3.63063 6.69572 4.09704 6.69548 4.58327ZM6.75048 7.77327H3.08381V19.2499H6.75048V7.77327ZM12.5438 7.77327H8.89548V19.2499H12.5071V13.2274C12.5071 9.87244 16.8796 9.56077 16.8796 13.2274V19.2499H20.5005V11.9808C20.5005 6.32494 14.0288 6.53577 12.5071 9.31327L12.5438 7.77327Z"
                                            fill=""
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_30_974">
                                            <rect
                                                width="22"
                                                height="22"
                                                fill="white"
                                                transform="translate(0.333862)"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </Link>
                            <Link
                                href="#"
                                className="hover:text-primary"
                                aria-label="social-icon"
                            >
                                <svg
                                    className="fill-current"
                                    width="22"
                                    height="22"
                                    viewBox="0 0 22 22"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clipPath="url(#clip0_30_978)">
                                        <path
                                            d="M18.3233 10.6077C18.2481 9.1648 17.7463 7.77668 16.8814 6.61929C16.6178 6.90312 16.3361 7.16951 16.038 7.41679C15.1222 8.17748 14.0988 8.79838 13.0011 9.25929C13.1542 9.58013 13.2945 9.89088 13.4182 10.1842V10.187C13.4531 10.2689 13.4867 10.3514 13.519 10.4345C14.9069 10.2786 16.3699 10.3355 17.788 10.527C17.9768 10.5527 18.1546 10.5802 18.3233 10.6077ZM9.72038 3.77854C10.6137 5.03728 11.4375 6.34396 12.188 7.69271C13.3091 7.25088 14.2359 6.69354 14.982 6.07296C15.2411 5.8595 15.4849 5.62824 15.7117 5.38088C14.3926 4.27145 12.7237 3.66426 11 3.66671C10.5711 3.66641 10.1429 3.70353 9.72038 3.77762V3.77854ZM3.89862 9.16396C4.52308 9.1482 5.1468 9.11059 5.76863 9.05121C7.27163 8.91677 8.7618 8.66484 10.2255 8.29771C9.46051 6.96874 8.63463 5.67578 7.75046 4.42296C6.80603 4.89082 5.97328 5.55633 5.30868 6.37435C4.64409 7.19236 4.16319 8.14374 3.89862 9.16396ZM5.30113 15.6155C5.65679 15.0957 6.12429 14.5109 6.74488 13.8747C8.07771 12.5089 9.65071 11.4455 11.4712 10.8589L11.528 10.8424C11.3768 10.5087 11.2347 10.2108 11.0917 9.93029C9.40871 10.4207 7.63588 10.7269 5.86946 10.8855C5.00779 10.9634 4.23504 10.9973 3.66671 11.0028C3.66509 12.6827 4.24264 14.3117 5.30204 15.6155H5.30113ZM13.7546 17.7971C13.4011 16.0144 12.9008 14.2641 12.2586 12.5639C10.4235 13.2303 8.96138 14.2047 7.83113 15.367C7.375 15.8276 6.97021 16.3362 6.62388 16.8841C7.88778 17.8272 9.42308 18.3356 11 18.3334C11.9441 18.3347 12.8795 18.1533 13.7546 17.799V17.7971ZM15.4715 16.8117C16.9027 15.7115 17.8777 14.1219 18.2096 12.3475C17.898 12.2696 17.5029 12.1917 17.0684 12.1312C16.1023 11.9921 15.1221 11.9819 14.1534 12.101C14.6988 13.6399 15.1392 15.2141 15.4715 16.8126V16.8117ZM11 20.1667C5.93729 20.1667 1.83337 16.0628 1.83337 11C1.83337 5.93729 5.93729 1.83337 11 1.83337C16.0628 1.83337 20.1667 5.93729 20.1667 11C20.1667 16.0628 16.0628 20.1667 11 20.1667Z"
                                            fill=""
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_30_978">
                                            <rect width="22" height="22" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </Link>
                            <Link
                                href="#"
                                className="hover:text-primary"
                                aria-label="social-icon"
                            >
                                <svg
                                    className="fill-current"
                                    width="23"
                                    height="22"
                                    viewBox="0 0 23 22"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clipPath="url(#clip0_30_982)">
                                        <path
                                            d="M11.6662 1.83337C6.6016 1.83337 2.49951 5.93546 2.49951 11C2.49847 12.9244 3.10343 14.8002 4.22854 16.3613C5.35366 17.9225 6.94181 19.0897 8.76768 19.6974C9.22602 19.7771 9.39743 19.5021 9.39743 19.261C9.39743 19.0438 9.38552 18.3224 9.38552 17.5542C7.08285 17.9786 6.48701 16.9932 6.30368 16.4771C6.2001 16.2131 5.75368 15.4 5.3641 15.1819C5.04326 15.0105 4.58493 14.586 5.35218 14.575C6.07451 14.5631 6.58968 15.2396 6.76201 15.5146C7.58701 16.9006 8.90518 16.511 9.43135 16.2709C9.51202 15.675 9.75218 15.2745 10.0162 15.0453C7.9766 14.8161 5.84535 14.025 5.84535 10.5188C5.84535 9.52146 6.2001 8.69737 6.78493 8.05479C6.69326 7.82562 6.37243 6.88604 6.8766 5.62562C6.8766 5.62562 7.64385 5.38546 9.39743 6.56612C10.1437 6.35901 10.9147 6.25477 11.6891 6.25629C12.4683 6.25629 13.2474 6.35896 13.9808 6.56521C15.7334 5.37354 16.5016 5.62654 16.5016 5.62654C17.0058 6.88696 16.6849 7.82654 16.5933 8.05571C17.1772 8.69737 17.5329 9.51046 17.5329 10.5188C17.5329 14.037 15.3906 14.8161 13.351 15.0453C13.6829 15.3313 13.9698 15.8813 13.9698 16.7411C13.9698 17.9667 13.9579 18.9521 13.9579 19.262C13.9579 19.5021 14.1302 19.7881 14.5885 19.6965C16.4081 19.0821 17.9893 17.9126 19.1094 16.3526C20.2296 14.7926 20.8323 12.9206 20.8329 11C20.8329 5.93546 16.7308 1.83337 11.6662 1.83337Z"
                                            fill=""
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_30_982">
                                            <rect
                                                width="22"
                                                height="22"
                                                fill="white"
                                                transform="translate(0.666138)"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </Link>
                        </div>
                    </div> */}
          </div>
        </div>
      </div>

      {user && user.accountType === "business" ? (
        <>
          <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
            <div className="rounded-sm border border-stroke bg-white px-5 pb-6 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
              <div className="mb-4 justify-between sm:flex">
                <div className="mb-2">
                  <h3 className="text-xl font-semibold text-black dark:text-white">
                    Business Details
                  </h3>
                </div>
              </div>
              <div>
                <div className="flex flex-col xl:flex-row">
                  <div className="xl:basis-2/3 flex flex-col gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-black dark:text-white">
                        {businessName}
                        <br />
                      </h3>
                      <div className="flex gap-3 mb-2">
                        <div className="flex gap-1">
                          {Array(5)
                            .fill(0)
                            .map((_, index) => {
                              return (
                                <span key={index}>
                                  <svg
                                    className="shrink-0 size-4 fill-meta-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
                                  </svg>
                                </span>
                              );
                            })}
                        </div>
                        <span className="text-sm font-bold leading-[18px] text-primary">
                          {user.businessProfileRef &&
                          user.businessProfileRef?.rating
                            ? parseFloat(
                                `${user.businessProfileRef?.rating}`
                              ).toFixed(1)
                            : 0}
                        </span>
                      </div>
                      <span className="text-sm dark:text-gray-500 text-gray-500 font-semibold">
                        {businessType} - {businessSubtype}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {amenities && amenities.length !== 0
                        ? amenities.map((amenity: any, index: number) => {
                            return (
                              <div
                                className="flex flex-col justify-center items-center gap-1.5 rounded-sm border border-stroke bg-white px-3 py-2 shadow-default dark:border-strokedark dark:bg-boxdark"
                                key={index}
                              >
                                {amenity?.icon && (
                                  <Image
                                    src={amenity.icon}
                                    alt={amenity?.name || "Amenity"}
                                    width={28}
                                    height={28}
                                    className="w-7 h-7"
                                  />
                                )}
                                <p className="text-xs font-semibold tracking-wider">
                                  {amenity?.name ? amenity?.name : ""}
                                </p>
                              </div>
                            );
                          })
                        : null}
                    </div>
                    <ul className="flex flex-col gap-2 min-w-80">
                      <li className="flex items-start gap-3 justify-start ">
                        <span>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M15.9655 12.6929C15.672 12.5811 15.5252 12.5251 15.3708 12.5118C15.2164 12.4984 15.0622 12.5283 14.7538 12.5881L12.3984 13.0445C12.0235 13.1172 11.836 13.1535 11.6427 13.1227C11.4493 13.0918 11.2957 13.0064 10.9886 12.8356C9.07557 11.7718 7.78657 10.5439 6.95042 8.81181C6.827 8.55614 6.76529 8.4283 6.74183 8.25256C6.71837 8.07683 6.74863 7.91452 6.80915 7.5899L7.27298 5.1021C7.32932 4.79993 7.35749 4.64884 7.3442 4.49766C7.33092 4.34649 7.27683 4.20263 7.16866 3.91491L6.61323 2.43758C6.35178 1.74217 6.22105 1.39447 5.93618 1.19723C5.65132 1 5.27985 1 4.53692 1H2.68622C1.66783 1 0.866113 1.84144 1.01869 2.8481C1.39788 5.36068 2.51739 9.91727 5.78835 13.1882C9.22363 16.6235 14.172 18.1141 16.895 18.7072C17.9468 18.9357 18.8794 18.1159 18.8794 17.0388V15.3317C18.8794 14.592 18.8794 14.2222 18.6836 13.938C18.4877 13.6538 18.1421 13.5222 17.4509 13.2588L15.9655 12.6929Z"
                              className="stroke-primary"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <b>Phone Number:</b>
                        {businessPhoneNumber}
                      </li>
                      <li className="flex items-start gap-3 justify-start ">
                        <span>
                          <svg
                            width="20"
                            height="16"
                            viewBox="0 0 20 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.87798 3.83594L6.80031 7.08201C8.55849 8.13692 9.43758 8.66437 10.4034 8.64139C11.3693 8.6184 12.2223 8.04973 13.9283 6.91239L18.1246 3.83594M8.33464 14.6693H11.668C14.8107 14.6693 16.382 14.6693 17.3583 13.693C18.3346 12.7166 18.3346 11.1453 18.3346 8.0026C18.3346 4.85991 18.3346 3.28856 17.3583 2.31225C16.382 1.33594 14.8107 1.33594 11.668 1.33594H8.33464C5.19194 1.33594 3.62059 1.33594 2.64428 2.31225C1.66797 3.28856 1.66797 4.85991 1.66797 8.0026C1.66797 11.1453 1.66797 12.7166 2.64428 13.693C3.62059 14.6693 5.19194 14.6693 8.33464 14.6693Z"
                              className="stroke-primary"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                        <b>Email:</b>
                        {businessEmail}
                      </li>
                      <li className="flex items-start gap-3 justify-start ">
                        <span>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-primary"
                          >
                            <g clip-path="url(#clip0_608_18010)">
                              <path
                                d="M22.1991 0.0314941H11.2074C10.5205 0.0314941 9.94196 0.610005 9.94196 1.29699V5.8166H1.58971C0.902729 5.8166 0.324219 6.39511 0.324219 7.08209V16.6275C0.324219 17.0976 0.505003 17.6761 0.902729 17.9653L5.63928 22.5934C6.03701 22.9911 6.50705 23.1719 6.97709 23.1719H12.5814C13.2684 23.1719 13.8469 22.5934 13.8469 21.9064V15.362L15.3293 16.8445C15.7271 17.2422 16.1971 17.423 16.6671 17.423H22.2715C22.9584 17.423 23.537 16.8445 23.537 16.1575V1.29699C23.4646 0.610005 22.8861 0.0314941 22.1991 0.0314941ZM3.03599 17.3868H6.10932V20.3878L3.03599 17.3868ZM11.8944 21.2556H8.02564V16.6998C8.02564 16.0128 7.44713 15.4343 6.76015 15.4343H2.24053V7.73291H11.8944V21.2556ZM13.8107 12.7587V12.5779H14.787V13.6265L13.8107 12.7587ZM21.5483 15.4705H16.7033V11.891C16.7033 11.204 16.1248 10.6255 15.4378 10.6255H13.8107V7.04593C13.8107 6.35895 13.2322 5.78044 12.5453 5.78044H11.8944V1.94781H21.5483V15.4705Z"
                                fill=""
                              ></path>
                            </g>
                            <defs>
                              <clipPath id="clip0_608_18010">
                                <rect
                                  width="23.1404"
                                  height="23.1404"
                                  fill="white"
                                  transform="translate(0.324219 0.0314941)"
                                ></rect>
                              </clipPath>
                            </defs>
                          </svg>
                        </span>
                        <b>GSTIN:</b>
                        {gstn}
                      </li>
                      {website ? (
                        <li className="flex items-start gap-3 justify-start ">
                          <span>
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g>
                                <path
                                  fill-rule="evenodd"
                                  clipRule="evenodd"
                                  d="M10.0007 2.50065C5.85852 2.50065 2.50065 5.85852 2.50065 10.0007C2.50065 14.1428 5.85852 17.5007 10.0007 17.5007C14.1428 17.5007 17.5007 14.1428 17.5007 10.0007C17.5007 5.85852 14.1428 2.50065 10.0007 2.50065ZM0.833984 10.0007C0.833984 4.93804 4.93804 0.833984 10.0007 0.833984C15.0633 0.833984 19.1673 4.93804 19.1673 10.0007C19.1673 15.0633 15.0633 19.1673 10.0007 19.1673C4.93804 19.1673 0.833984 15.0633 0.833984 10.0007Z"
                                  className="fill-primary"
                                ></path>
                                <path
                                  fill-rule="evenodd"
                                  clipRule="evenodd"
                                  d="M0.833984 9.99935C0.833984 9.53911 1.20708 9.16602 1.66732 9.16602H18.334C18.7942 9.16602 19.1673 9.53911 19.1673 9.99935C19.1673 10.4596 18.7942 10.8327 18.334 10.8327H1.66732C1.20708 10.8327 0.833984 10.4596 0.833984 9.99935Z"
                                  className="fill-primary"
                                ></path>
                                <path
                                  fill-rule="evenodd"
                                  clipRule="evenodd"
                                  d="M7.50084 10.0008C7.55796 12.5632 8.4392 15.0301 10.0006 17.0418C11.5621 15.0301 12.4433 12.5632 12.5005 10.0008C12.4433 7.43845 11.5621 4.97153 10.0007 2.95982C8.4392 4.97153 7.55796 7.43845 7.50084 10.0008ZM10.0007 1.66749L9.38536 1.10547C7.16473 3.53658 5.90275 6.69153 5.83417 9.98346C5.83392 9.99503 5.83392 10.0066 5.83417 10.0182C5.90275 13.3101 7.16473 16.4651 9.38536 18.8962C9.54325 19.069 9.76655 19.1675 10.0007 19.1675C10.2348 19.1675 10.4581 19.069 10.6159 18.8962C12.8366 16.4651 14.0986 13.3101 14.1671 10.0182C14.1674 10.0066 14.1674 9.99503 14.1671 9.98346C14.0986 6.69153 12.8366 3.53658 10.6159 1.10547L10.0007 1.66749Z"
                                  className="fill-primary"
                                ></path>
                              </g>
                            </svg>
                          </span>
                          <b>Website:</b>
                          <Link
                            href={website}
                            target="_blank"
                            className="text-primary"
                          >
                            {website}
                          </Link>
                        </li>
                      ) : null}
                      <li className="flex items-start gap-3 justify-start ">
                        <span>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 16 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M14.6654 8.60868C14.6654 11.8081 12.1279 14.3862 10.184 16.6526C9.22437 17.7713 8.74457 18.3307 7.9987 18.3307C7.25282 18.3307 6.77302 17.7713 5.81342 16.6526C3.86945 14.3862 1.33203 11.8081 1.33203 8.60868C1.33203 6.76685 2.03441 5.00046 3.28465 3.69809C4.5349 2.39573 6.23059 1.66406 7.9987 1.66406C9.76681 1.66406 11.4625 2.39573 12.7127 3.69809C13.963 5.00046 14.6654 6.76685 14.6654 8.60868Z"
                              className="stroke-primary"
                              strokeWidth="1.6"
                            />
                            <path
                              d="M9.66536 7.7406C9.66536 8.69945 8.91917 9.47676 7.9987 9.47676C7.07822 9.47676 6.33203 8.69945 6.33203 7.7406C6.33203 6.78175 7.07822 6.00445 7.9987 6.00445C8.91917 6.00445 9.66536 6.78175 9.66536 7.7406Z"
                              className="stroke-primary"
                              strokeWidth="1.6"
                            />
                          </svg>
                        </span>
                        <b>Address:</b>
                        {businessAddress}
                      </li>
                    </ul>
                  </div>
                  <div className="xl:basis-1/2 flex xl:justify-end items-start">
                    <div className="flex flex-col justify-center items-center gap-4">
                      <div className="flex items-center justify-between w-full">
                        <h4 className="text-xl font-semibold text-black dark:text-white">
                          Download QR
                        </h4>
                        <button
                          className="flex items-center gap-2  bg-primary px-2 py-2 font-medium text-white hover:bg-opacity-80 rounded-full"
                          onClick={downloadQR}
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                              fill=""
                            >
                              {" "}
                            </path>
                            <path
                              d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                              fill=""
                            ></path>
                          </svg>
                        </button>
                      </div>
                      <div className="w-75 h-75 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <Image
                          src={qr}
                          alt="Business QR Code"
                          width={300}
                          height={300}
                          className="w-full h-full"
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="my-4">{bio}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
            <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Business Details Section */}
                <div className="flex flex-col gap-4">
                  <h5 className="text-xl font-bold text-black dark:text-white">
                    Business Details
                  </h5>
                  <div className="flex flex-col gap-3">
                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-1">
                        {businessName}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        {user &&
                        user.businessProfileRef &&
                        user.businessProfileRef?.rating ? (
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
                            <span className="text-black dark:text-white text-sm ml-1">
                              {parseFloat(
                                `${user.businessProfileRef.rating}`
                              ).toFixed(1)}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-500 text-sm">
                            No rating yet
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {businessType} - {businessSubtype}
                      </p>
                    </div>
                    {/* Amenities */}
                    {amenities && amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {amenities.map((amenity: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-1.5 rounded-sm border border-stroke bg-white px-3 py-2 shadow-default dark:border-strokedark dark:bg-boxdark"
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
                            <p className="text-xs font-semibold tracking-wider">
                              {amenity?.name || ""}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Contact Information */}
                    <div className="flex flex-col gap-2 mt-2">
                      {businessPhoneNumber && (
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
                          <span className="text-sm text-gray-500 dark:text-gray-500">
                            Phone Number:
                          </span>
                          <span className="text-sm text-black dark:text-white">
                            {businessPhoneNumber}
                          </span>
                        </div>
                      )}
                      {businessEmail && (
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
                          <span className="text-sm text-gray-500 dark:text-gray-500">
                            Email:
                          </span>
                          <span className="text-sm text-black dark:text-white">
                            {businessEmail}
                          </span>
                        </div>
                      )}
                      {gstn && gstn !== "-" && (
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
                          <span className="text-sm text-gray-500 dark:text-gray-500">
                            GSTIN:
                          </span>
                          <span className="text-sm text-black dark:text-white">
                            {gstn}
                          </span>
                        </div>
                      )}
                      {businessAddress && (
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
                            <span className="text-sm text-gray-500 dark:text-gray-500">
                              Address:
                            </span>
                            <span className="text-sm text-black dark:text-white">
                              {businessAddress}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Description */}
                    {bio && bio !== "-" && (
                      <p className="text-sm text-black dark:text-white mt-2">
                        {bio}
                      </p>
                    )}
                  </div>
                </div>
                {/* QR Code Section */}
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h5 className="text-xl font-bold text-black dark:text-white">
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
                  <div className="flex justify-center items-center bg-white p-4 rounded-lg">
                    <Image
                      src={qr}
                      alt="Business QR Code"
                      width={300}
                      height={300}
                      className="w-full max-w-[300px] h-auto"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
              <div className="mb-4 justify-between sm:flex">
                <div className="mb-2">
                  <h3 className="text-xl font-semibold text-black dark:text-white">
                    Business Documents
                  </h3>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2  xl:gap-10">
                {businessDocuments && businessDocuments.length !== 0
                  ? businessDocuments.map((document: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="bg-whiten object-cover h-96 w-108 "
                        >
                          <p className="text-sm font-semibold my-2 px-3">
                            Business Registration
                          </p>
                          <button
                            onClick={() =>
                              onDownloadClick(
                                document?.businessRegistration
                                  ? document?.businessRegistration
                                  : ""
                              )
                            }
                            type="button"
                            className="mx-3 my-4 flex w-13 justify-center items-center gap-2  bg-primary px-2 py-2 font-medium text-white hover:bg-opacity-80 rounded-full "
                          >
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                                fill=""
                              >
                                {" "}
                              </path>
                              <path
                                d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                                fill=""
                              ></path>
                            </svg>
                          </button>
                          <iframe
                            src={
                              document?.businessRegistration
                                ? document?.businessRegistration
                                : ""
                            }
                            height="100%"
                            width="100%"
                          ></iframe>
                        </div>
                      );
                    })
                  : null}
                {businessDocuments && businessDocuments.length !== 0
                  ? businessDocuments.map((document: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="bg-whiten object-cover h-96 w-108  "
                        >
                          <p className="text-sm font-semibold my-2 px-3">
                            Business Address Proof
                          </p>
                          <button
                            onClick={() =>
                              onDownloadClick(
                                document?.addressProof
                                  ? document?.addressProof
                                  : ""
                              )
                            }
                            className="mx-3 my-4 flex w-13 justify-center items-center gap-2  bg-primary px-2 py-2 font-medium text-white hover:bg-opacity-80 rounded-full "
                          >
                            <svg
                              className="fill-current"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                                fill=""
                              >
                                {" "}
                              </path>
                              <path
                                d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                                fill=""
                              ></path>
                            </svg>
                          </button>
                          <iframe
                            src={
                              document?.addressProof
                                ? document?.addressProof
                                : ""
                            }
                            height="100%"
                            width="100%"
                          ></iframe>
                        </div>
                      );
                    })
                  : null}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Profile;

const CameraSvgIcon = () => {
  return (
    <svg
      className="fill-current"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
        fill=""
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
        fill=""
      />
    </svg>
  );
};
const DownArrowIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.8">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
          fill="#637381"
        ></path>
      </g>
    </svg>
  );
};

const UserDetailedView: React.FC<{
  id: string;
  name: string;
  accountType: string;
  username: string;
  image?: string;
  register?: boolean;
}> = ({ id, name, accountType, username, image, register }) => {
  const imageSrc = image || DefaultProfilePic;
  return (
    <Link
      href={!register ? `/users/${id}` : "#"}
      className="flex flex-col gap-4 sm:flex-row sm:items-center"
    >
      <div>
        <div className="h-12 w-12 rounded-full bg-black/10 dark:bg-meta-4 flex justify-center items-center">
          <Image
            src={imageSrc}
            alt={name}
            width={80}
            height={80}
            className="w-12 h-12 object-cover rounded-full"
          />
        </div>
      </div>
      <div>
        <h5 className="font-semibold text-black dark:text-white">
          {name}
          <small className="text-xs capitalize"> ({accountType})</small>
        </h5>
        {!register ? (
          <p className="text-xs text-black dark:text-white mb-1">{username}</p>
        ) : (
          <p className="text-xs text-meta-1 dark:text-white mb-1">
            Not Registered with Us.
          </p>
        )}
      </div>
    </Link>
  );
};
export { UserDetailedView };
