"use client"
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
import { createRoom, fetchAmenities, deleteRoom, updateAmenity, updateRoom } from "@/api-services/hotel";
import Select, { ActionMeta, MultiValue, SingleValue } from 'react-select';
import toast from "react-hot-toast";
export default function Transaction() {
    const [pageNo, setPageNo] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResources, setTotalResources] = useState(0);
    const [modal, setModal] = useState(false);
    const files: File[] = []
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
        currency: "INR"
    }
    const [formInputs, setFormInputs] = useState(initialFormInputs);
    const [editMode, setEditMode] = useState(false);
    const { isPending, isError, error, data, isFetching, isPlaceholderData, refetch } = useQuery({
        queryKey: ['rooms', pageNo],
        queryFn: () => fetchRooms({ pageNumber: pageNo }),
        placeholderData: keepPreviousData,
    });
    const { data: amenities, refetch: refetchBusinessTypes } = useQuery({
        queryKey: ['amenities'],
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
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            if (formInputs.price == null || isNaN(formInputs.price) || formInputs.price <= 0) {
                toast.error("Price per night should be greater than 0");
                return false;
            }
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
            if (formInputs.images && formInputs.images.length !== 0) {
                formInputs.images.map((image) => {
                    fromData.append("images", image);
                })
            }
            if (formInputs.amenities && formInputs.amenities.length !== 0) {
                formInputs.amenities.map((amenity) => {
                    fromData.append("amenities", amenity.value);
                })
            }
            if (editMode) {
                const data = await updateRoom(fromData, formInputs._id);
                if (data.status) {
                    setFormInputs(initialFormInputs);
                    setModal(false);
                    refetch();
                }
            } else {
                const data = await createRoom(fromData);
                if (data.status) {
                    setFormInputs(initialFormInputs);
                    setModal(false);
                    refetch();
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const files = e.target.files;
        let filesData: File[] = [];
        if (files && files.length !== 0) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                filesData.push(file);
            }
        }
        setFormInputs({ ...formInputs, images: [...formInputs.images, ...filesData] });
    }
    const removeFileFromArray = (fileIndex: number) => {
        setFormInputs({
            ...formInputs,
            images: formInputs.images.filter((_, index) => index !== fileIndex),
        });
    }
    const changeAminity = async (newValue: MultiValue<{ value: string; label: string; }> |
        SingleValue<{ value: string; label: string; }>,
        actionMeta: ActionMeta<{ value: string; label: string; }>) => {
        setFormInputs({
            ...formInputs,
            amenities: newValue as {
                value: string;
                label: string;
            }[]
        });
    }
    const handleDelete = async (ID: string) => {
        if (confirm("Are you sure you want to delete this room?")) {
            const data = await deleteRoom(ID);
            if (data.status) {
                refetch();
            }
        }
    }
    const roomTypes = [
        {
            name: 'Single',
            value: 'single'
        },
        {
            name: 'Double',
            value: 'double'
        },
        {
            name: 'Suite',
            value: 'suite'
        },
        {
            name: 'Family',
            value: 'family'
        },
        {
            name: 'Super Deluxe',
            value: 'super-deluxe'
        },
        {
            name: 'Deluxe',
            value: 'deluxe'
        }
    ];
    const mealTypes = [
        {
            name: 'Breakfast',
            value: 'breakfast'
        },
        {
            name: 'Lunch',
            value: 'lunch'
        },
        {
            name: 'Dinner',
            value: 'dinner'
        },
        {
            name: 'Full Board',
            value: 'full board'
        },
        {
            name: 'Breakfast or Lunch',
            value: 'breakfast or lunch'
        },
        {
            name: 'Lunch or Dinner',
            value: 'lunch or dinner'
        },
        {
            name: 'Breakfast or Dinner',
            value: 'breakfast or dinner'
        },
        {
            name: 'Not Included',
            value: 'not included'
        },
        {
            name: 'All Inclusive',
            value: 'all inclusive'
        }
    ];
    const bedTypes = [
        {
            name: 'King',
            value: 'king'
        },
        {
            name: 'Queen',
            value: 'queen'
        },
        {
            name: 'Single',
            value: 'single'
        },
        {
            name: 'Double',
            value: 'double'
        }
    ];

    return (
        <>
            <div className={`overflow-hidden rounded-xl  bg-boxdark shadow-default  dark:bg-boxdark ${loading ? "animate-pulse" : null} `}>
                {/* Edit User Model */}
                <div className={`${modal ? '' : 'hidden'} fixed left-0 top-6 z-999999 flex h-screen w-full justify-center overflow-y-scroll bg-theme-black dark:bg-theme-black px-4 py-5`}>
                    <div className=" m-auto w-full max-w-5xl rounded-xl border border-stroke bg-theme-black-full p-4 shadow-default dark:border-strokedark dark:bg-theme-black-full sm:p-6 xl:p-8">
                        <div className="flex justify-between">
                            <h4>{editMode ? 'Update Bank' : 'Add Bank'}</h4>
                            <button className="bg-primary/50 border-radius h-6 w-6 rounded-full flex justify-center items-center" type="button" onClick={() => setModal(false)}>
                                <svg className="fill-current" width="8" height="8" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M11.8913 9.99599L19.5043 2.38635C20.032 1.85888 20.032 1.02306 19.5043 0.495589C18.9768 -0.0317329 18.141 -0.0317329 17.6135 0.495589L10.0001 8.10559L2.38673 0.495589C1.85917 -0.0317329 1.02343 -0.0317329 0.495873 0.495589C-0.0318274 1.02306 -0.0318274 1.85888 0.495873 2.38635L8.10887 9.99599L0.495873 17.6056C-0.0318274 18.1331 -0.0318274 18.9689 0.495873 19.4964C0.717307 19.7177 1.05898 19.9001 1.4413 19.9001C1.75372 19.9001 2.13282 19.7971 2.40606 19.4771L10.0001 11.8864L17.6135 19.4964C17.8349 19.7177 18.1766 19.9001 18.5589 19.9001C18.8724 19.9001 19.2531 19.7964 19.5265 19.4737C20.0319 18.9452 20.0245 18.1256 19.5043 17.6056L11.8913 9.99599Z" fill=""></path>
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className="my-8">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="mb-3">
                                        <Label id="title" >Bank Name</Label>
                                        <Input id="title" name="title" required={true} value={formInputs.title} onChange={(e) => setFormInputs({ ...formInputs, title: e.target.value })} placeholder="Enter bank name" />
                                    </div>
                                    {/* <div className="mb-3">
                                        <Label id="name" >Room Type</Label>
                                        <div className="relative z-20 ">
                                            <span className="absolute left-5 top-1/2 z-30 -translate-y-1/2">
                                                <ListIcon width={16} height={16} />
                                            </span>
                                            <select className="relative z-20 w-full appearance-none rounded-theme-xl border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-theme-gray-1 dark:bg-form-input text-white dark:text-white text-sm" required={true} onChange={(e) => setFormInputs({ ...formInputs, roomType: e.target.value })} value={formInputs.roomType}>
                                                <option value="" disabled={false} className="text-black dark:text-black">Select Room Type</option>
                                                {
                                                    roomTypes && roomTypes.map((data, index) => (
                                                        <option key={index} value={data.value} className="text-black dark:text-black">{data.name}</option>
                                                    ))
                                                }
                                            </select>
                                            <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                                                <DownArrowIcon />
                                            </span>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="mb-3">
                                        <Label id="email" >Account Number</Label>
                                        <Input type="email" id="email" name="email" required={true} value={formInputs.title} onChange={(e) => setFormInputs({ ...formInputs, title: e.target.value })} placeholder="Enter account number" />
                                    </div>
                                    <div className="mb-3">
                                        <Label id="website" >IFSC</Label>
                                        <Input id="website" name="website" value={formInputs.title} onChange={(e) => setFormInputs({ ...formInputs, title: e.target.value })} placeholder="Enter IFSC" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="mb-3">
                                        <Label id="email" >Account Holder</Label>
                                        <Input type="email" id="email" name="email" required={true} value={formInputs.title} onChange={(e) => setFormInputs({ ...formInputs, title: e.target.value })} placeholder="Enter Account holder name" />
                                    </div>
                                    <div className="mb-3">
                                        <Label id="website" >Type of Account</Label>
                                        <Input id="website" name="website" value={formInputs.title} onChange={(e) => setFormInputs({ ...formInputs, title: e.target.value })} placeholder="For e.g Own, Business, Vendor" />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <Label id="description" >Description</Label>
                                    <textarea id="description" placeholder="" required={false} className="w-full rounded-2xl border border-theme-gray-1 bg-white px-4.5 py-3 text-white focus:border-primary focus-visible:outline-none dark:border-theme-gray-1 dark:bg-boxdark dark:text-white dark:focus:border-primary text-sm font-normal" name="description" value={formInputs.description} onChange={(e) => setFormInputs({ ...formInputs, description: e.target.value })} rows={4} ></textarea>
                                </div>
                                <label htmlFor="room-images" className="w-full rounded-theme-xl border border-theme-gray-1 bg-white px-3 py-2 text-white focus:border-primary focus-visible:outline-none dark:border-theme-gray-1 dark:bg-boxdark dark:text-white dark:focus:border-primary text-sm font-normal flex justify-between items-center mb-3">
                                    <span>Room Images</span>
                                    <input hidden={true} type="file" accept="images/*" className="hidden" id="room-images" multiple={true} onChange={handleImages} />
                                    <label htmlFor="room-images" className="px-3 py-2 text-xs font-medium text-center text-white bg-primary/50  rounded-2xl hover:bg-primary/80 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-primary/50  dark:hover:bg-primary/80 dark:focus:ring-blue-800">
                                        Browse
                                    </label>
                                </label>
                                <div className="flex flex-wrap justify-start gap-2 w-full">
                                    {
                                        formInputs.images && formInputs.images.map((file, index) => {
                                            return (
                                                <div key={index} className="flex justify-center items-center flex-col w-14 h-14 dark:bg-form-input dark:text-white relative rounded-xl">
                                                    <button type="button" className="top-1 right-1 w-4 h-4 bg-primary absolute rounded-full text-white text-[10px] leading-[10px] flex justify-center items-center" onClick={() => removeFileFromArray(index)}>
                                                        <svg className="h-3.5 w-3.5" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M15.5 5.5L5.5 15.5M15.5 15.5L10.5 10.5L5.5 5.5" className="stroke-white" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                    <img src={URL.createObjectURL(file)} alt="file" className="w-full h-full object-fit rounded-xl" />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-end items-center gap-4">
                                <button type="button" className="flex items-center justify-center gap-2 px-4 py-2 text-white hover:bg-opacity-90 rounded-[25px] bg-theme-gray-1 dark:bg-theme-gray-1" onClick={() => setModal(false)}>
                                    <span className="text-sm font-normal font-quicksand">Cancel</span>
                                </button>
                                <button type="submit" className="flex items-center justify-center gap-2 px-4 py-2 text-white hover:bg-opacity-90 rounded-[25px] bg-primary/50 dark:bg-primary/50">
                                    <span className="text-sm font-normal font-quicksand">
                                        {editMode ? 'Update Room' : 'Add Room'}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
                {/* Edit User Model */}

            </div >
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between items-center">
                <PageTitle>Transaction Detail</PageTitle>
                <div>
                    <Button.Hotel.Button name="Export" onClick={() => {
                        setModal(!modal);
                        setFormInputs(initialFormInputs);
                        setEditMode(false);
                    }} svg={<SVG.Museum />}></Button.Hotel.Button>
                </div>
            </div >
            <PageContent>
                <div className="max-w-full overflow-x-auto">
                    <div className="border dark:border-theme-gray border-theme-gray rounded-xl">
                        <table className="w-full table-auto font-quicksand">
                            <thead>
                                <tr className="bg-primary/50 text-left dark:bg-primary/50 text-sm">
                                    <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white text-left xl:pl-11  min-w-[120px]">
                                        Guest Name
                                    </th>
                                    <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white text-center min-w-[120px]">
                                        Booking Date
                                    </th>
                                    <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white text-center min-w-[120px]">
                                        Check In / Check Out
                                    </th>
                                    <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white text-center min-w-[220px]">
                                        Room Type
                                    </th>
                                    <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white text-center min-w-[120px]">
                                        Base Amount
                                    </th>
                                    <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white text-right min-w-[120px]">
                                        Platform Fee
                                    </th>
                                    <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white text-right min-w-[120px]">
                                        Received amount
                                    </th>
                                    <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white text-right min-w-[120px]">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    isFetching ?
                                        <tr >
                                            <td colSpan={6} >
                                                <Loading />
                                            </td>
                                        </tr> : <>
                                            {
                                                data && data.data && data.data.map((room) => {
                                                    return (
                                                        <tr key={room._id} className="even:bg-primary/10 odd:bg-theme-black dark:even:bg-primary/10 dark:odd:bg-theme-black hover:bg-primary/30 dark:hover:bg-primary/30 group [&:not(:last-child)]:border-b  dark:[&:not(:last-child)]:border-theme-gray [&:not(:last-child)]:border-theme-gray" >
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
                                                                    Queen Size
                                                                </p>
                                                            </td>
                                                            <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">

                                                            </td>
                                                            <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                                                            </td>
                                                            <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                                                            </td>
                                                            <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                                                                <div className="flex gap-2 justify-end pe-2">
                                                                    <Button.Hotel.View name="View" svg={<SVG.Eye />} onClick={() => { }} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </>

                                }
                            </tbody>
                        </table>
                    </div>
                    <Paginator pageNo={pageNo} totalPages={totalPages} totalResources={totalResources} onPageChange={(e, pageNo) => setPageNo(pageNo)} />
                </div>
            </PageContent>
        </>
    )
}