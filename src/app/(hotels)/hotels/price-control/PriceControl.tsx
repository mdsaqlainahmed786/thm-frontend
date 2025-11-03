"use client"
import { PageContent, PageTitle } from "@/components/Hotel/Layouts/AdminLayout";
import Button from "@/components/Button";
import SVG from "@/components/SVG";
import { deletePricePreset, fetchPricePreset, updatePricePreset } from "@/api-services/booking";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import { useState, useEffect } from "react";
import Paginator from "@/components/Paginator";
import Label from "@/components/Hotel/Common/UI/Label";
import Input from "@/components/Hotel/Common/UI/Input";
import toast from "react-hot-toast";
import moment from "moment";
import { createPricePreset } from "@/api-services/booking";
import SwitcherThree from "@/components/Switchers/SwitcherThree";
export default function PriceControl() {
    const types = ['monthly', 'quarterly', 'custom'];
    const [pageNo, setPageNo] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResources, setTotalResources] = useState(0);
    const [modal, setModal] = useState(false);
    const emptyArray: {
        value: string;
        label: string;
    }[] = [];
    const emptyNumber: number[] = [];
    const initialFormInputs = {
        _id: "",
        type: types[0],
        weekendPrice: 0,
        price: 0,
        months: emptyNumber,
        weeks: emptyNumber,
        startDate: "",
        endDate: ""
    }
    const [formInputs, setFormInputs] = useState(initialFormInputs);
    const [editMode, setEditMode] = useState(false);
    const { isPending, isError, error, data, isFetching, isPlaceholderData, refetch } = useQuery({
        queryKey: ['price-preset', pageNo],
        queryFn: () => fetchPricePreset({ pageNumber: pageNo }),
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
            if (!formInputs.type) {
                toast.error("Please select period");
                return false;
            }
            if (formInputs.type === types[0] && formInputs.months.length === 0) {
                toast.error("Please select at least one month");
                return false;
            }
            if (formInputs.type === types[1] && formInputs.months.length === 0) {
                toast.error("Please select at least quarter");
                return false;
            }
            if (formInputs.type === types[2] && (formInputs.startDate === "" || formInputs.endDate === "")) {
                toast.error("Please select start and end date");
                return false;
            }
            // if (formInputs.price == null || isNaN(formInputs.price) || formInputs.price <= 0) {
            //     toast.error("Price per night should be greater than 0");
            //     return false;
            // }
            const formData: any = {
                ...formInputs,
                weekendPrice: parseFloat(`${formInputs.weekendPrice}`).toFixed(2),
                price: parseFloat(`${formInputs.price}`).toFixed(2),
                method: "PUT"//Don't change this, it is used in the API to determine the type of request 
            }
            if (editMode) {
                const data = await updatePricePreset(formData, formInputs._id);
                if (data.status) {
                    setFormInputs(initialFormInputs);
                    setModal(false);
                    refetch();
                }
            } else {
                const data = await createPricePreset(formData);
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
    const activatePricePreset = async (formData: { isActive: boolean, ID: string }) => {
        try {
            console.log(formData)
            const data = await updatePricePreset(formData, formData.ID);
            if (data.status) {
                setFormInputs(initialFormInputs);
                setModal(false);
                refetch();
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleDelete = async (ID: string) => {
        if (confirm("Are you sure you want to delete this room?")) {
            const data = await deletePricePreset(ID);
            if (data.status) {
                refetch();
            }
        }
    }

    return (
        <>
            <div className={`overflow-hidden rounded-xl  bg-boxdark shadow-default  dark:bg-boxdark ${loading ? "animate-pulse" : null} `}>
                <div className={`${modal ? '' : 'hidden'} fixed left-0 top-6 z-999999 flex h-screen w-full justify-center overflow-y-scroll bg-theme-black dark:bg-theme-black px-4 py-5`}>
                    <div className=" m-auto w-full max-w-5xl rounded-xl border border-stroke bg-theme-black-full p-4 shadow-default dark:border-strokedark dark:bg-theme-black-full sm:p-6 xl:p-8">
                        <div className="flex justify-between">
                            <h4>{editMode ? 'Update Price Control' : 'Add Price Control'}</h4>
                            <button className="bg-primary/50 border-radius h-6 w-6 rounded-full flex justify-center items-center" type="button" onClick={() => setModal(false)}>
                                <svg className="fill-current" width="8" height="8" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M11.8913 9.99599L19.5043 2.38635C20.032 1.85888 20.032 1.02306 19.5043 0.495589C18.9768 -0.0317329 18.141 -0.0317329 17.6135 0.495589L10.0001 8.10559L2.38673 0.495589C1.85917 -0.0317329 1.02343 -0.0317329 0.495873 0.495589C-0.0318274 1.02306 -0.0318274 1.85888 0.495873 2.38635L8.10887 9.99599L0.495873 17.6056C-0.0318274 18.1331 -0.0318274 18.9689 0.495873 19.4964C0.717307 19.7177 1.05898 19.9001 1.4413 19.9001C1.75372 19.9001 2.13282 19.7971 2.40606 19.4771L10.0001 11.8864L17.6135 19.4964C17.8349 19.7177 18.1766 19.9001 18.5589 19.9001C18.8724 19.9001 19.2531 19.7964 19.5265 19.4737C20.0319 18.9452 20.0245 18.1256 19.5043 17.6056L11.8913 9.99599Z" fill=""></path>
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className="my-8">
                                <div className="flex flex-col mb-3">
                                    <Label id="title" >Select Period</Label>
                                    <div className="flex gap-6">
                                        {
                                            types && types.map((type) => {
                                                return (
                                                    <button type="button" key={type} className="w-full rounded-theme-xl border border-theme-gray-1 bg-white px-4.5 py-3 text-white focus:border-primary focus-visible:outline-none dark:border-theme-gray-1 dark:bg-boxdark dark:text-white dark:focus:border-primary text-sm font-normal capitalize flex items-center cursor-pointer" onClick={(e) => {
                                                        setFormInputs({ ...formInputs, type: type })
                                                    }}>
                                                        <div className="h-4.5 w-4.5 border-2 border-primary rounded-md">
                                                            {
                                                                type === formInputs.type && <svg className="w-3.5 h-3.5" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect x="2" y="2" width="18" height="18" rx="6.75" fill="#4169E1" />
                                                                    <rect x="2" y="2" width="18" height="18" rx="6.75" stroke="#4169E1" strokeWidth="2.25" />
                                                                    <path d="M7 12L10 14L15.5 8" stroke="white" strokeWidth="2.26137" />
                                                                </svg>
                                                            }
                                                        </div>
                                                        <label htmlFor={type} className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                                            {type}
                                                        </label>
                                                    </button>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                {
                                    formInputs.type === "custom" && <>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="mb-3">
                                                <Label id="startDate" >Start Date</Label>
                                                <Input type="date" id="startDate" name="startDate" value={formInputs.startDate} onChange={(e) => setFormInputs({ ...formInputs, startDate: e.target.value })} />
                                            </div>
                                            <div className="mb-3">
                                                <Label id="endDate" >End Date</Label>
                                                <Input type="date" id="endDate" name="endDate" value={formInputs.endDate} onChange={(e) => setFormInputs({ ...formInputs, endDate: e.target.value })} />
                                            </div>
                                        </div>
                                    </>
                                }
                                {
                                    formInputs.type === "quarterly" && <>
                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="mb-3">
                                                <Label id="quarter" >Select Quarter</Label>
                                                <div className="grid grid-cols-4 gap-1.5">
                                                    {
                                                        [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]].map((data, index) => {
                                                            const i = index;
                                                            return (
                                                                <button type="button" className={`${data.every(item => formInputs.months.includes(item)) ? 'bg-primary/50 dark:bg-primary/50 border border-primary/50' : 'border border-[#50505099]'} flex gap-3 py-2 px-2.5 rounded-[32px] items-center justify-center flex-wrap`} key={index} onClick={() => {
                                                                    const allExist = data.every(item => formInputs.months.includes(item));
                                                                    !allExist ?
                                                                        setFormInputs({
                                                                            ...formInputs,
                                                                            months: [...data]

                                                                        }) :
                                                                        setFormInputs({
                                                                            ...formInputs,
                                                                            months: formInputs.weeks.filter(m => !data.includes(m))
                                                                        });
                                                                }} style={{ boxShadow: " -1.61px 1.46px 2.92px 0px rgba(0, 0, 0, 0.3) inset" }}>
                                                                    <span className="text-sm font-normal font-comic-sans tracking-wider p-1">
                                                                        {moment.months(data[0])} - {moment.months(data[2])}
                                                                    </span>

                                                                </button>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }
                                {
                                    formInputs.type === "monthly" &&
                                    <>
                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="mb-3">
                                                <Label id="months" >Select Month</Label>
                                                <div className="flex gap-1.5 flex-wrap">
                                                    {
                                                        Array(12).fill(0).map((data, index) => {
                                                            const i = index;
                                                            return (
                                                                <button type="button" className={`${formInputs.months.includes(i) ? 'bg-primary/50 dark:bg-primary/50 border border-primary/50' : 'border border-[#50505099]'} flex gap-1 py-2 px-2.5 rounded-[32px] items-center justify-center flex-wrap`} key={index} onClick={() => {
                                                                    const isExist = formInputs.months.includes(i)
                                                                    console.log(isExist);
                                                                    !isExist ?
                                                                        setFormInputs({
                                                                            ...formInputs,
                                                                            months: [...formInputs.months, i]

                                                                        }) :
                                                                        setFormInputs({
                                                                            ...formInputs,
                                                                            months: formInputs.months.filter(m => m !== i),
                                                                        });
                                                                }} style={{ boxShadow: " -1.61px 1.46px 2.92px 0px rgba(0, 0, 0, 0.3) inset" }}>
                                                                    <span className="text-[10px] font-normal leading-[12px] tracking-wider font-comic-sans">
                                                                        {moment().month(i).format('MMM').toUpperCase()}
                                                                    </span>
                                                                    <span className={`${formInputs.months.includes(i) ? 'bg-white dark:bg-white border border-white text-primary dark:text-primary' : 'border border-white/50'} text-[10px] font-normal leading-[12px] tracking-wider font-comic-sans w-5.5 h-5.5 inline-flex justify-center items-center  rounded-full`} style={{ boxShadow: " -1.61px 1.46px 2.92px 0px rgba(0, 0, 0, 0.3) inset" }}>
                                                                        {String(++index).padStart(2, '0')}
                                                                    </span>
                                                                </button>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="grid grid-cols-1 gap-6">
                                            <div className="mb-3">
                                                <Label id="weeks" >Select Week (Optional)</Label>
                                                <div className="grid grid-cols-4 gap-1.5">
                                                    {
                                                        Array(4).fill(0).map((data, index) => {
                                                            const i = index;
                                                            return (
                                                                <button type="button" className={`${formInputs.weeks.includes(i) ? 'bg-primary/50 dark:bg-primary/50 border border-primary/50' : 'border border-[#50505099]'} flex gap-3 py-2 px-2.5 rounded-[32px] items-center justify-center flex-wrap`} key={index} onClick={() => {
                                                                    const isExist = formInputs.weeks.includes(i)
                                                                    console.log(isExist);
                                                                    const answer = !isExist ?
                                                                        setFormInputs({
                                                                            ...formInputs,
                                                                            weeks: [...formInputs.weeks, i]

                                                                        }) :
                                                                        setFormInputs({
                                                                            ...formInputs,
                                                                            weeks: formInputs.weeks.filter(m => m !== i),
                                                                        });
                                                                }} style={{ boxShadow: " -1.61px 1.46px 2.92px 0px rgba(0, 0, 0, 0.3) inset" }}>
                                                                    <span className="text-[10px] font-normal leading-[12px] tracking-wider font-comic-sans">
                                                                        Week {++index}
                                                                    </span>
                                                                    <span className={`${formInputs.weeks.includes(i) ? 'bg-white dark:bg-white border border-white text-primary dark:text-primary' : 'border border-white/50'} text-[10px] font-normal leading-[12px] tracking-wider font-comic-sans h-5.5 inline-flex justify-center items-center  rounded-full px-2`} style={{ boxShadow: " -1.61px 1.46px 2.92px 0px rgba(0, 0, 0, 0.3) inset" }}>
                                                                        01 - 07
                                                                    </span>
                                                                </button>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div> */}
                                    </>
                                }
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="mb-3">
                                        <Label id="price" >Weekly hike in %</Label>
                                        <Input id="price" type="number" name="price" required={true} value={formInputs.price.toString()} onChange={(e) => setFormInputs({ ...formInputs, price: parseFloat(e.target.value) })} placeholder="Weekly hike" step={0.01} />
                                        <span className="ms-2 text-[10px] font-normal font-comic-sans text-white/60 dark:text-white/60">*On Base Price</span>
                                    </div>
                                    <div className="mb-3">
                                        <Label id="weekendPrice" >Weekend hike in %</Label>
                                        <Input id="weekendPrice" type="number" name="website" value={formInputs.weekendPrice.toString()} onChange={(e) => setFormInputs({ ...formInputs, weekendPrice: parseFloat(e.target.value) })} placeholder="Weekend hike" step={0.01} />
                                        <span className="ms-2 text-[10px] font-normal font-comic-sans text-white/60 dark:text-white/60">*On Base Price</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-end items-center gap-4">
                                <button type="button" className="flex items-center justify-center gap-2 px-4 py-2 text-white hover:bg-opacity-90 rounded-[25px] bg-theme-gray-1 dark:bg-theme-gray-1" onClick={() => setModal(false)}>
                                    <span className="text-sm font-normal font-quicksand">Cancel</span>
                                </button>
                                <button type="submit" className="flex items-center justify-center gap-2 px-4 py-2 text-white hover:bg-opacity-90 rounded-[25px] bg-primary/50 dark:bg-primary/50">
                                    <span className="text-sm font-normal font-quicksand">
                                        {editMode ? 'Update' : 'Add'}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            </div>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between items-center">
                <PageTitle>Price Control</PageTitle>
                <div>
                    <Button.Hotel.Button name="Add Price Control" onClick={() => {
                        setModal(!modal);
                        setFormInputs(initialFormInputs);
                        setEditMode(false);
                    }} svg={<SVG.Plus />}></Button.Hotel.Button>
                </div>
            </div >
            <PageContent>
                <div className="max-w-full overflow-x-auto">
                    <div className="border dark:border-theme-gray border-theme-gray rounded-xl">
                        <table className="w-full table-auto font-quicksand">
                            <thead>
                                <tr className="bg-primary/50 text-left dark:bg-primary/50 text-sm">
                                    <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white text-left xl:pl-11  min-w-[120px]">
                                        Period
                                    </th>
                                    {/* <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white text-center min-w-[120px]">
                                        Week
                                    </th>
                                    <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white text-center min-w-[120px]">
                                        Base Amount
                                    </th> */}
                                    <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white text-center min-w-[220px]">
                                        Every Day Hike
                                    </th>
                                    <th className="first:rounded-tl-xl last:rounded-tr-xl px-4 py-2 font-medium text-black dark:text-white text-center min-w-[120px]">
                                        Weekend Hike
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
                                                data && data.data && data.data.map((pricePreset) => {
                                                    return (
                                                        <tr key={pricePreset._id} className="even:bg-primary/10 odd:bg-theme-black dark:even:bg-primary/10 dark:odd:bg-theme-black hover:bg-primary/30 dark:hover:bg-primary/30 group [&:not(:last-child)]:border-b  dark:[&:not(:last-child)]:border-theme-gray [&:not(:last-child)]:border-theme-gray" >
                                                            <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                                                                <div className="flex flex-col ps-3 ">
                                                                    <p className="text-white/60 dark:text-white//60 text-sm capitalize">
                                                                        {pricePreset.type}
                                                                    </p>
                                                                    <p className="text-white dark:text-white text-base">

                                                                        {
                                                                            pricePreset.type === "custom" && <>
                                                                                {moment(pricePreset.startDate).format("YYYY-MM-DD")} - {moment(pricePreset.endDate).format("YYYY-MM-DD")}
                                                                            </>
                                                                        }
                                                                        {
                                                                            pricePreset.type === "quarterly" && <>
                                                                                {pricePreset.months && pricePreset.months.map(month => (moment.months(month))).join(", ")}
                                                                            </>
                                                                        }
                                                                        {
                                                                            pricePreset.type === "monthly" && <>
                                                                                {pricePreset.months && pricePreset.months.map(month => (moment.months(month))).join(", ")}
                                                                            </>
                                                                        }
                                                                    </p>
                                                                </div>

                                                            </td>
                                                            {/* <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                                                                <p className="text-white dark:text-white text-sm capitalize text-center">
                                                                    {pricePreset.weeks && pricePreset.weeks.map(week => (`Week ${++week}`)).join(", ")}
                                                                </p>
                                                            </td>
                                                           <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                                                                <p className="text-white dark:text-white text-sm text-center">
                                                                 {room?.availability} 
                                                                </p>
                                                            </td> */}
                                                            <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                                                                <p className="text-white dark:text-white text-sm line-clamp-3 text-center">
                                                                    {pricePreset.price}
                                                                </p>
                                                            </td>
                                                            <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                                                                <p className="text-white dark:text-white text-sm line-clamp-3 text-center">
                                                                    {pricePreset.weekendPrice}
                                                                </p>
                                                            </td>
                                                            <td className="px-1 py-2 group-last:first:rounded-bl-xl group-last:last:rounded-br-xl">
                                                                <div className="flex gap-2 justify-end pe-2">
                                                                    <Button.Hotel.Edit name="View" svg={<SVG.Edit />} onClick={() => {
                                                                        setEditMode(true);
                                                                        setModal(true);
                                                                        setFormInputs({
                                                                            ...formInputs,
                                                                            _id: pricePreset._id,
                                                                            type: pricePreset.type,
                                                                            weeks: pricePreset.weeks,
                                                                            months: pricePreset.months,
                                                                            price: pricePreset.price,
                                                                            weekendPrice: pricePreset.weekendPrice,
                                                                            startDate: moment(pricePreset.startDate).format("YYYY-MM-DD"),
                                                                            endDate: moment(pricePreset.endDate).format("YYYY-MM-DD")
                                                                        })
                                                                    }} />
                                                                    <Button.Hotel.Delete name="Delete" svg={<SVG.Delete />} onClick={() => handleDelete(pricePreset._id)} />
                                                                    <SwitcherThree enabled={pricePreset?.isActive} id={pricePreset._id} setEnabled={() => activatePricePreset({
                                                                        ID: pricePreset._id,
                                                                        isActive: !(pricePreset?.isActive)
                                                                    })} />
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