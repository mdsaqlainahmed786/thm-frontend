"use client";
import { PageContent, PageTitle } from "@/components/Hotel/Layouts/AdminLayout";
import Button from "@/components/Button";
import SVG from "@/components/SVG";
import { fetchRooms } from "@/api-services/booking";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import { useState, useEffect } from "react";
import Paginator from "@/components/Paginator";
import Label from "@/components/Hotel/Common/UI/Label";
import Input from "@/components/Hotel/Common/UI/Input";
import { ListIcon, DownArrowIcon } from "@/components/Icons";
import {
  createRoom,
  fetchAmenities,
  deleteRoom,
  updateAmenity,
  updateRoom,
  fetchRoom,
  deleteRoomImage,
} from "@/api-services/hotel";
import Select, { ActionMeta, MultiValue, SingleValue } from "react-select";
import toast from "react-hot-toast";
import { RoomImageRef } from "@/types/room";
export default function RoomManagement() {
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResources, setTotalResources] = useState(0);
  const [modal, setModal] = useState(false);
  const files: File[] = [];
  const emptyArray: {
    value: string;
    label: string;
  }[] = [];
  const initialFormInputs = {
    _id: "",
    title: "",
    description: "",
    maxOccupancy: "",
    adults: 1,
    children: 0,
    availability: false,
    price: 1,
    mealPlan: "",
    amenities: emptyArray,
    roomType: "",
    bedType: "",
    images: files,
    currency: "INR",
    totalRooms: 0,
  };
  const [formInputs, setFormInputs] = useState(initialFormInputs);
  const [existingImages, setExistingImages] = useState<RoomImageRef[]>([]);
  const [removedExistingImageIds, setRemovedExistingImageIds] = useState<
    string[]
  >([]);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    isPending,
    isError,
    error,
    data,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: ["rooms", pageNo],
    queryFn: () => fetchRooms({ pageNumber: pageNo }),
    placeholderData: keepPreviousData,
  });
  const { data: amenities, refetch: refetchBusinessTypes } = useQuery({
    queryKey: ["amenities"],
    queryFn: () => fetchAmenities({ documentLimit: 122 }),
    placeholderData: keepPreviousData,
  });
  const loading = isPending || isFetching;
  useEffect(() => {
    if (data) {
      setTotalResources(data?.totalResources ?? 0);
      setTotalPages(data?.totalPages ?? 0);
    }
  }, [data]);

  // Reset submitting state when modal closes
  useEffect(() => {
    if (!modal) {
      setIsSubmitting(false);
      setExistingImages([]);
      setRemovedExistingImageIds([]);
    }
  }, [modal]);

  // Helper function to recursively flatten arrays and extract string IDs
  const flattenAmenityIds = (input: any): string[] => {
    if (typeof input === "string" && input.length > 0) {
      return [input];
    }
    if (Array.isArray(input)) {
      return input.flatMap((item) => flattenAmenityIds(item));
    }
    return [];
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (
        formInputs.price == null ||
        isNaN(formInputs.price) ||
        formInputs.price <= 0
      ) {
        toast.error("Price per night should be greater than 0");
        return false;
      }
      // Validate that there's at least one image (existing or new)
      const remainingExistingImages = existingImages.filter(
        (img) => !removedExistingImageIds.includes(img._id)
      );
      const totalImages = remainingExistingImages.length + formInputs.images.length;
      if (totalImages === 0) {
        toast.error("At least one image is required");
        return false;
      }
      setIsSubmitting(true);
      const fromData = new FormData();
      fromData.append("price", parseFloat(formInputs.price as any).toFixed(2));
      fromData.append("currency", formInputs.currency);
      fromData.append("title", formInputs.title);
      fromData.append("description", formInputs.description);
      fromData.append("bedType", formInputs.bedType);
      fromData.append("roomType", formInputs.roomType);
      fromData.append("mealPlan", formInputs.mealPlan);
      fromData.append("children", formInputs.children as any);
      fromData.append("adults", formInputs.adults as any);
      fromData.append(
        "totalRooms",
        parseInt(formInputs?.totalRooms?.toString()) as any
      );
      if (formInputs.images && formInputs.images.length !== 0) {
        formInputs.images.map((image) => {
          fromData.append("images", image);
        });
      }
      // Delete removed images individually before updating room
      if (editMode && removedExistingImageIds.length > 0) {
        try {
          // Delete each image individually using the delete endpoint
          const deletePromises = removedExistingImageIds.map((imageId) =>
            deleteRoomImage(formInputs._id, imageId)
          );
          const deleteResults = await Promise.all(deletePromises);
          
          // Check if all deletions were successful
          const allDeleted = deleteResults.every((result) => result?.status);
          if (!allDeleted) {
            toast.error("Some images could not be deleted. Please try again.");
            setIsSubmitting(false);
            return;
          }
        } catch (error) {
          console.error("Error deleting images:", error);
          toast.error("Failed to delete images. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }
      
      if (formInputs.amenities?.length) {
        // Extract amenity IDs and recursively flatten any nested arrays
        // NOTE: Backend currently expects a SINGLE amenity ObjectId, so we
        // send only the first valid ID to avoid CastError on the server.
        const amenityIds: string[] = [];

        formInputs.amenities.forEach((a) => {
          const flattened = flattenAmenityIds(a.value);
          amenityIds.push(...flattened);
        });

        const firstValidId =
          amenityIds.find(
            (id) => typeof id === "string" && id.trim().length > 0
          ) ?? "";

        if (firstValidId) {
          fromData.append("amenities", firstValidId);
        }
      }

      if (editMode) {
        const data = await updateRoom(fromData, formInputs._id);
        if (data.status) {
          setFormInputs(initialFormInputs);
          setExistingImages([]);
          setRemovedExistingImageIds([]);
          setModal(false);
          refetch();
        }
      } else {
        const data = await createRoom(fromData);
        if (data.status) {
          setFormInputs(initialFormInputs);
          setExistingImages([]);
          setRemovedExistingImageIds([]);
          setModal(false);
          refetch();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const filesData: File[] = [];
    if (files && files.length !== 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        filesData.push(file);
      }
    }
    if (filesData.length) {
      setFormInputs((prev) => ({
        ...prev,
        images: [...prev.images, ...filesData],
      }));
    }
  };
  const removeFileFromArray = (fileIndex: number) => {
    setFormInputs({
      ...formInputs,
      images: formInputs.images.filter((_, index) => index !== fileIndex),
    });
  };
  const removeExistingImage = (imageId: string) => {
    // Just mark for deletion - don't delete from backend yet
    // Only delete when "Update Room" is clicked
    setRemovedExistingImageIds((prev) =>
      prev.includes(imageId) ? prev : [...prev, imageId]
    );
  };
  const changeAminity = async (
    newValue:
      | MultiValue<{ value: string; label: string }>
      | SingleValue<{ value: string; label: string }>,
    actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    setFormInputs({
      ...formInputs,
      amenities: newValue as {
        value: string;
        label: string;
      }[],
    });
  };
  const handleDelete = async (ID: string) => {
    if (confirm("Are you sure you want to delete this room?")) {
      const data = await deleteRoom(ID);
      if (data.status) {
        refetch();
      }
    }
  };
  const changeInventory = async (roomID: string, totalRooms: number) => {
    try {
      const fromData = new FormData();
      fromData.append("totalRooms", parseInt(totalRooms.toString()) as any);
      const data = await updateRoom(fromData, roomID);
      if (data.status) {
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const roomTypes = [
    {
      name: "Single",
      value: "single",
    },
    {
      name: "Double",
      value: "double",
    },
    {
      name: "Suite",
      value: "suite",
    },
    {
      name: "Family",
      value: "family",
    },
    {
      name: "Super Deluxe",
      value: "super-deluxe",
    },
    {
      name: "Deluxe",
      value: "deluxe",
    },
  ];
  const mealTypes = [
    {
      name: "Breakfast",
      value: "breakfast",
    },
    {
      name: "Lunch",
      value: "lunch",
    },
    {
      name: "Dinner",
      value: "dinner",
    },
    {
      name: "Full Board",
      value: "full board",
    },
    {
      name: "Breakfast or Lunch",
      value: "breakfast or lunch",
    },
    {
      name: "Lunch or Dinner",
      value: "lunch or dinner",
    },
    {
      name: "Breakfast or Dinner",
      value: "breakfast or dinner",
    },
    {
      name: "Not Included",
      value: "not included",
    },
    {
      name: "All Inclusive",
      value: "all inclusive",
    },
  ];
  const bedTypes = [
    {
      name: "King",
      value: "king",
    },
    {
      name: "Queen",
      value: "queen",
    },
    {
      name: "Single",
      value: "single",
    },
    {
      name: "Double",
      value: "double",
    },
  ];

  return (
    <>
      <div
        className={`overflow-hidden rounded-xl  bg-boxdark shadow-default  dark:bg-boxdark ${
          loading ? "animate-pulse" : null
        } `}
      >
        {/* Edit User Model */}
        <div
          className={`${
            modal ? "" : "hidden"
          } fixed left-0 top-6 z-999999 flex h-screen w-full justify-center overflow-y-scroll bg-theme-black dark:bg-theme-black px-4 py-5`}
        >
          <div className=" m-auto w-full max-w-5xl rounded-xl border border-stroke bg-theme-black-full p-4 shadow-default dark:border-strokedark dark:bg-theme-black-full sm:p-6 xl:p-8">
            <div className="flex justify-between">
              <h4>{editMode ? "Edit Room" : "Add Room"}</h4>
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
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="mb-3">
                                        <Label id="name" >Business Type</Label>
                                        <div className="relative z-20 ">
                                            <span className="absolute left-5 top-1/2 z-30 -translate-y-1/2">
                                                <ListIcon width={16} height={16} />
                                            </span>
                                            <select className="relative z-20 w-full appearance-none rounded-theme-xl border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-theme-gray-1 dark:bg-form-input text-white dark:text-white text-sm" required={true} onChange={(e) => setFormInputs({ ...formInputs, businessTypeID: e.target.value })} value={formInputs.businessTypeID}>
                                                <option value="" disabled={false} className="text-body dark:text-bodydark">Select Business Type</option>
                                                {
                                                    businessTypes && businessTypes.map((data, index) => (
                                                        <option key={index} value={data.id} className="text-body dark:text-bodydark">{data.name}</option>
                                                    ))
                                                }
                                            </select>
                                            <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                                                <DownArrowIcon />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <Label id="phoneNumber" >Room type</Label>
                                        <div className="relative z-20 ">
                                            <span className="absolute left-5 top-1/2 z-30 -translate-y-1/2">
                                                 <ListIcon width={16} height={16} />
                                            </span>
                                            <select className="relative z-20 w-full appearance-none rounded-theme-xl border border-theme-gray-1 bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-theme-gray-1 dark:bg-form-input text-white dark:text-white text-sm" required={true} onChange={(e) => setFormInputs({ ...formInputs, roomType: e.target.value })} value={formInputs.roomType}>
                                                <option value="" disabled={false} className="text-body dark:text-bodydark">Select Business Subtype</option>
                                                {
                                                    roomTypes && roomTypes.map((data, index) => (
                                                        <option key={index} value={data.id} className="text-body dark:text-bodydark">{data.name}</option>
                                                    ))
                                                }
                                            </select><span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                                                <DownArrowIcon />
                                            </span>
                                        </div>
                                    </div>
                                </div> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="mb-3">
                    <Label id="title">Room Title</Label>
                    <Input
                      id="title"
                      name="title"
                      required={true}
                      value={formInputs.title}
                      onChange={(e) =>
                        setFormInputs({ ...formInputs, title: e.target.value })
                      }
                      placeholder="Room title"
                    />
                  </div>
                  <div className="mb-3">
                    <Label id="name">Room Type</Label>
                    <div className="relative z-20 ">
                      <span className="absolute left-5 top-1/2 z-30 -translate-y-1/2">
                        <ListIcon width={16} height={16} />
                      </span>
                      <select
                        className="relative z-20 w-full appearance-none rounded-theme-xl border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-theme-gray-1 dark:bg-form-input text-white dark:text-white text-sm"
                        required={true}
                        onChange={(e) =>
                          setFormInputs({
                            ...formInputs,
                            roomType: e.target.value,
                          })
                        }
                        value={formInputs.roomType}
                      >
                        <option
                          value=""
                          disabled={false}
                          className="text-black dark:text-black"
                        >
                          Select Room Type
                        </option>
                        {roomTypes &&
                          roomTypes.map((data, index) => (
                            <option
                              key={index}
                              value={data.value}
                              className="text-black dark:text-black"
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
                  {/* <div className="mb-3">
                                        <Label id="phoneNumber" >Phone Number</Label>
                                        <Input id="phoneNumber" name="phoneNumber" value={formInputs.phoneNumber} onChange={(e) => setFormInputs({ ...formInputs, phoneNumber: e.target.value })} />
                                    </div> */}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* <div className="mb-3">
                                        <Label id="email" >Available Room</Label>
                                        <Input type="email" id="email" name="email" required={true} value={formInputs.email} onChange={(e) => setFormInputs({ ...formInputs, email: e.target.value })} placeholder="No. of available rooms" />
                                    </div>
                                    <div className="mb-3">
                                        <Label id="website" >Website Link</Label>
                                        <Input id="website" name="website" value={formInputs.website} onChange={(e) => setFormInputs({ ...formInputs, website: e.target.value })} />
                                    </div> */}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="mb-3">
                    <Label id="children">Children Capacity</Label>
                    <div className="relative z-20 ">
                      <span className="absolute left-5 top-1/2 z-30 -translate-y-1/2">
                        <ListIcon width={16} height={16} />
                      </span>
                      <select
                        id="children"
                        className="relative z-20 w-full appearance-none rounded-theme-xl border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-theme-gray-1 dark:bg-form-input text-white dark:text-white text-sm"
                        required={true}
                        onChange={(e) =>
                          setFormInputs({
                            ...formInputs,
                            children: parseInt(e.target.value),
                          })
                        }
                        value={formInputs.children}
                      >
                        <option
                          value={0}
                          className="text-black dark:text-black"
                        >
                          Select capacity
                        </option>
                        {[1, 2, 3, 4].map((data) => (
                          <option
                            key={data}
                            value={data}
                            className="text-black dark:text-black"
                          >
                            {data}
                          </option>
                        ))}
                      </select>
                      <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                        <DownArrowIcon />
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <Label id="adults">Guest (Adults) Capacity</Label>
                    <div className="relative z-20 ">
                      <span className="absolute left-5 top-1/2 z-30 -translate-y-1/2">
                        <ListIcon width={16} height={16} />
                      </span>
                      <select
                        id="children"
                        className="relative z-20 w-full appearance-none rounded-theme-xl border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-theme-gray-1 dark:bg-form-input text-white dark:text-white text-sm"
                        required={true}
                        onChange={(e) =>
                          setFormInputs({
                            ...formInputs,
                            adults: parseInt(e.target.value),
                          })
                        }
                        value={formInputs.adults}
                      >
                        <option
                          value=""
                          disabled={false}
                          className="text-black dark:text-black"
                        >
                          Select capacity
                        </option>
                        {[1, 2, 3, 4].map((data) => (
                          <option
                            key={data}
                            value={data}
                            className="text-black dark:text-black"
                          >
                            {data}
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
                    <Label id="price">Room Prices</Label>
                    <Input
                      step={0.01}
                      type="number"
                      id="price"
                      name="price"
                      value={formInputs.price.toString()}
                      onChange={(e) =>
                        setFormInputs({
                          ...formInputs,
                          price: parseFloat(e.target.value),
                        })
                      }
                      placeholder="Base Price"
                    />
                  </div>
                  <div className="mb-3">
                    <Label id="bedType">Bed Type</Label>
                    <div className="relative z-20 ">
                      <span className="absolute left-5 top-1/2 z-30 -translate-y-1/2">
                        <ListIcon width={16} height={16} />
                      </span>
                      <select
                        className="relative z-20 w-full appearance-none rounded-theme-xl border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-theme-gray-1 dark:bg-form-input text-white dark:text-white text-sm placeholder-white/60"
                        required={true}
                        onChange={(e) =>
                          setFormInputs({
                            ...formInputs,
                            bedType: e.target.value,
                          })
                        }
                        value={formInputs.bedType}
                      >
                        <option
                          value=""
                          disabled={false}
                          className="text-black dark:text-black"
                        >
                          Select Bed Type
                        </option>
                        {bedTypes &&
                          bedTypes.map((data, index) => (
                            <option
                              key={index}
                              value={data.value}
                              className="text-black dark:text-black"
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
                    <Label id="meal">Meal</Label>
                    <div className="relative z-20 ">
                      <span className="absolute left-5 top-1/2 z-30 -translate-y-1/2">
                        <ListIcon width={16} height={16} />
                      </span>
                      <select
                        className="relative z-20 w-full appearance-none rounded-theme-xl border border-stroke bg-form-input px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-theme-gray-1 dark:bg-form-input text-white dark:text-white text-sm dark:placeholder-gray-400"
                        required={true}
                        onChange={(e) =>
                          setFormInputs({
                            ...formInputs,
                            mealPlan: e.target.value,
                          })
                        }
                        value={formInputs.mealPlan}
                      >
                        <option
                          value=""
                          disabled={false}
                          className="text-black dark:text-black"
                        >
                          Select Meal Plan
                        </option>
                        {mealTypes &&
                          mealTypes.map((data, index) => (
                            <option
                              key={index}
                              value={data.value}
                              className="text-black dark:text-black"
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
                    <Label id="totalRooms">Total Room</Label>
                    <Input
                      step={1}
                      type="number"
                      id="totalRooms"
                      name="totalRooms"
                      value={formInputs.totalRooms.toString()}
                      onChange={(e) =>
                        setFormInputs({
                          ...formInputs,
                          totalRooms: parseFloat(e.target.value),
                        })
                      }
                      placeholder="Enter total rooms"
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-3">
                    <Label id="amenities">Amenities</Label>
                    <div className="relative z-20 ">
                      <span className="absolute left-5 top-1/2 z-30 -translate-y-1/2">
                        <ListIcon width={16} height={16} />
                      </span>
                      <div className="relative z-20 w-full appearance-none rounded-theme-xl border border-stroke bg-transparent px-8 py-1 outline-none transition focus:border-primary active:border-primary dark:border-theme-gray-1 dark:bg-form-input text-white dark:text-white text-sm">
                        <Select
                          isMulti={true}
                          closeMenuOnSelect={false}
                          className="text-black dark:text-black"
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
                            input: (base) => ({
                              ...base,
                              color: "#FFFFFF",
                            }),
                          }}
                          options={
                            amenities && amenities.length !== 0
                              ? amenities &&
                                amenities.map((data) => ({
                                  value: data._id,
                                  label: data.name,
                                }))
                              : []
                          }
                          value={formInputs.amenities}
                          onChange={(newValue, actionMeta) =>
                            changeAminity(newValue, actionMeta)
                          }
                        />
                      </div>
                      {/* <select className="relative z-20 w-full appearance-none rounded-theme-xl border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-theme-gray-1 dark:bg-form-input text-white dark:text-white text-sm" required={true} onChange={(e) => setFormInputs({ ...formInputs, mealPlan: e.target.value })} value={formInputs.mealPlan}>
                                                <option value="" disabled={false} className="text-black dark:text-black">Select Amenities</option>
                                                {
                                                    amenities && amenities.map((data) => ({ value: data._id, label: data.name })).map((data, index) => (
                                                        <option key={index} value={data.value} className="text-black dark:text-black">{data.label}</option>
                                                    ))
                                                }
                                           
                                            </select> */}
                      {/* <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                                                <DownArrowIcon />
                                            </span> */}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <Label id="description">Description</Label>
                  <textarea
                    id="description"
                    placeholder=""
                    required={false}
                    className="w-full rounded-2xl border border-theme-gray-1 bg-white px-4.5 py-3 text-white focus:border-primary focus-visible:outline-none dark:border-theme-gray-1 dark:bg-boxdark dark:text-white dark:focus:border-primary text-sm font-normal"
                    name="description"
                    value={formInputs.description}
                    onChange={(e) =>
                      setFormInputs({
                        ...formInputs,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                  ></textarea>
                </div>
                <label
                  htmlFor="room-images"
                  className="w-full rounded-theme-xl border border-theme-gray-1 bg-white px-3 py-2 text-white focus:border-primary focus-visible:outline-none dark:border-theme-gray-1 dark:bg-boxdark dark:text-white dark:focus:border-primary text-sm font-normal flex justify-between items-center mb-3 cursor-pointer"
                >
                  <span>Room Images</span>
                  <input
                    hidden={true}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="room-images"
                    multiple={true}
                    onChange={handleImages}
                  />
                  <span className="px-3 py-2 text-xs font-medium text-center text-white bg-primary/50  rounded-2xl hover:bg-primary/80 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-primary/50  dark:hover:bg-primary/80 dark:focus:ring-blue-800">
                    Browse
                  </span>
                </label>
                <div className="flex flex-wrap justify-start gap-2 w-full">
                  {editMode &&
                    existingImages
                      .filter((img) => !removedExistingImageIds.includes(img._id))
                      .map((img) => (
                        <div
                          key={img._id}
                          className="flex justify-center items-center flex-col w-14 h-14 dark:bg-form-input dark:text-white relative rounded-xl overflow-hidden"
                        >
                          <button
                            type="button"
                            className="top-1 right-1 w-4 h-4 bg-primary absolute rounded-full text-white text-[10px] leading-[10px] flex justify-center items-center z-10"
                            onClick={() => removeExistingImage(img._id)}
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M15.5 5.5L5.5 15.5M15.5 15.5L10.5 10.5L5.5 5.5"
                                className="stroke-white"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <img
                            src={img.thumbnailUrl || img.sourceUrl}
                            alt="Room"
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>
                      ))}
                  {formInputs.images &&
                    formInputs.images.map((file, index) => {
                      return (
                        <div
                          key={index}
                          className="flex justify-center items-center flex-col w-14 h-14 dark:bg-form-input dark:text-white relative rounded-xl"
                        >
                          <button
                            type="button"
                            className="top-1 right-1 w-4 h-4 bg-primary absolute rounded-full text-white text-[10px] leading-[10px] flex justify-center items-center"
                            onClick={() => removeFileFromArray(index)}
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              viewBox="0 0 21 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M15.5 5.5L5.5 15.5M15.5 15.5L10.5 10.5L5.5 5.5"
                                className="stroke-white"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <img
                            src={URL.createObjectURL(file)}
                            alt="file"
                            className="w-full h-full object-fit rounded-xl"
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="flex flex-wrap justify-end items-center gap-4">
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-white hover:bg-opacity-90 rounded-[25px] bg-theme-gray-1 dark:bg-theme-gray-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    // Reset removed images when canceling - don't delete them
                    setRemovedExistingImageIds([]);
                    setModal(false);
                  }}
                >
                  <span className="text-sm font-normal font-quicksand">
                    Cancel
                  </span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-white hover:bg-opacity-90 rounded-[25px] bg-primary/50 dark:bg-primary/50 disabled:opacity-50 disabled:cursor-not-allowed relative"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="text-sm font-normal font-quicksand">
                        {editMode ? "Updating..." : "Adding..."}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-normal font-quicksand">
                      {editMode ? "Update Room" : "Add Room"}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Edit User Model */}
      </div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between items-center">
        <PageTitle>Room Management</PageTitle>
        <div>
          <Button.Hotel.Button
            name="Add Room"
            onClick={() => {
              setModal(!modal);
              setFormInputs(initialFormInputs);
              setExistingImages([]);
              setRemovedExistingImageIds([]);
              setEditMode(false);
            }}
            svg={<SVG.Plus />}
          ></Button.Hotel.Button>
        </div>
      </div>
      <PageContent>
        <div className="max-w-full overflow-x-auto">
          <div className="border dark:border-theme-gray border-theme-gray rounded-xl">
            <table className="w-full table-auto font-quicksand">
              <thead>
                <tr className="bg-primary/50 text-left dark:bg-primary/50 text-sm">
                  <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white text-left xl:pl-11  min-w-[120px]">
                    Room Title
                  </th>
                  <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white text-center min-w-[120px]">
                    Room Type
                  </th>
                  <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white text-center min-w-[120px]">
                    Room Available
                  </th>
                  <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white text-center min-w-[220px]">
                    Description
                  </th>
                  <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white text-center min-w-[120px]">
                    Action
                  </th>
                  <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white text-right min-w-[120px]">
                    Inventory
                  </th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <tr>
                    <td colSpan={6}>
                      <Loading />
                    </td>
                  </tr>
                ) : (
                  <>
                    {data &&
                      data.data &&
                      data.data.map((room) => {
                        return (
                          <tr
                            key={room._id}
                            className="even:bg-primary/10 odd:bg-theme-black dark:even:bg-primary/10 dark:odd:bg-theme-black hover:bg-primary/30 dark:hover:bg-primary/30 group [&:not(:last-child)]:border-b  dark:[&:not(:last-child)]:border-theme-gray [&:not(:last-child)]:border-theme-gray"
                          >
                            <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                              <p className="text-white dark:text-white text-sm ps-3">
                                {room?.title}
                              </p>
                            </td>
                            <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                              <p className="text-white dark:text-white text-sm capitalize text-center">
                                {room?.roomType}
                              </p>
                            </td>
                            <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                              <p className="text-white dark:text-white text-sm text-center">
                                {room?.availability}
                              </p>
                            </td>
                            <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                              <p className="text-white dark:text-white text-sm line-clamp-3 text-center">
                                {room?.description}
                              </p>
                            </td>
                            <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                              <div className="flex gap-2">
                                <Button.Hotel.Edit
                                  name="Edit"
                                  svg={<SVG.Edit />}
                                  onClick={() => {
                                    const selectedAmenities = amenities?.length
                                      ? amenities
                                          .filter((a) =>
                                            Array.isArray(room?.amenities)
                                              ? room.amenities
                                                  .flat()
                                                  .includes(a._id.toString())
                                              : false
                                          )
                                          .map((a) => ({
                                            value: a._id.toString(),
                                            label: a.name,
                                          }))
                                      : [];

                                    setEditMode(true);
                                    setModal(true);
                                    setExistingImages(room?.roomImagesRef ?? []);
                                    setRemovedExistingImageIds([]);
                                    setFormInputs({
                                      ...initialFormInputs,
                                      _id: room?._id,
                                      title: room?.title,
                                      description: room?.description,
                                      roomType: room?.roomType,
                                      mealPlan: room?.mealPlan,
                                      children: room?.children,
                                      adults: room?.adults,
                                      price: room?.pricePerNight,
                                      bedType: room?.bedType,
                                      totalRooms: room?.totalRooms,
                                      amenities: selectedAmenities,
                                    });
                                    // Fallback: list endpoint may not include roomImagesRef (or may omit images),
                                    // so fetch room details.
                                    if (
                                      !room?.roomImagesRef ||
                                      room.roomImagesRef.length === 0
                                    ) {
                                      fetchRoom(room._id)
                                        .then((roomDetails) => {
                                          setExistingImages(
                                            roomDetails?.roomImagesRef ?? []
                                          );
                                        })
                                        .catch(() => {
                                          // ignore
                                        });
                                    }
                                  }}
                                />
                                <Button.Hotel.Delete
                                  name="Delete"
                                  svg={<SVG.Delete />}
                                  onClick={() => handleDelete(room?._id)}
                                />
                              </div>
                            </td>
                            <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                              <div className="inline-flex p-2 gap-2 items-center bg-primary/50 bg-blur-[35px] rounded-[24px]">
                                <button
                                  disabled={
                                    room?.totalRooms && room.totalRooms <= 1
                                      ? true
                                      : false
                                  }
                                  type="button"
                                  className={`${
                                    room?.totalRooms && room.totalRooms <= 1
                                      ? "opacity-60"
                                      : ""
                                  } bg-primary flex gap-1 p-1 justify-center items-center rounded-3xl`}
                                  onClick={() =>
                                    changeInventory(
                                      room._id,
                                      room?.totalRooms - 1
                                    )
                                  }
                                >
                                  <div className="w-5 h-5 rounded-full flex justify-center items-center">
                                    <span>
                                      <svg
                                        width="14"
                                        height="4"
                                        viewBox="0 0 14 4"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          x="13.5459"
                                          y="0.691406"
                                          width="2.61818"
                                          height="13.0909"
                                          rx="1.30909"
                                          transform="rotate(90 13.5459 0.691406)"
                                          fill="white"
                                        />
                                      </svg>
                                    </span>
                                  </div>
                                  <span className="sr-only">Minus</span>
                                </button>
                                <span className="text-sm font-normal font-comic-sans">
                                  {room?.totalRooms}
                                </span>
                                <button
                                  type="button"
                                  className="bg-primary flex gap-1 p-1 justify-center items-center rounded-3xl"
                                  onClick={() =>
                                    changeInventory(
                                      room._id,
                                      room?.totalRooms + 1
                                    )
                                  }
                                >
                                  <div className="w-5 h-5 rounded-full flex justify-center items-center">
                                    <span>
                                      <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          x="5.68945"
                                          y="0.455078"
                                          width="2.61818"
                                          height="13.0909"
                                          rx="1.30909"
                                          fill="white"
                                        />
                                        <rect
                                          x="13.5449"
                                          y="5.69141"
                                          width="2.61818"
                                          height="13.0909"
                                          rx="1.30909"
                                          transform="rotate(90 13.5449 5.69141)"
                                          fill="white"
                                        />
                                      </svg>
                                    </span>
                                  </div>
                                  <span className="sr-only">Minus</span>
                                </button>
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
          <Paginator
            pageNo={pageNo}
            totalPages={totalPages}
            totalResources={totalResources}
            onPageChange={(e, pageNo) => setPageNo(pageNo)}
          />
        </div>
      </PageContent>
    </>
  );
}
