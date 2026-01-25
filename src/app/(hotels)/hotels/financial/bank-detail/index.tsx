"use client"
import { PageContent, PageTitle } from "@/components/Hotel/Layouts/AdminLayout";
import Button from "@/components/Button";
import SVG from "@/components/SVG";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "@/components/Loading";
import { useState, useEffect } from "react";
import Label from "@/components/Hotel/Common/UI/Label";
import Input from "@/components/Hotel/Common/UI/Input";
import { ListIcon, DownArrowIcon } from "@/components/Icons";
import { deleteAccount, fetchBanks, fetchAccounts, createBankAccount } from "@/api-services/hotel";
import toast from "react-hot-toast";
import Image from "next/image";
import { setPrimaryAccount } from "@/api-services/hotel";
export default function BankDetail() {
    const queryClient = useQueryClient();
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
        bankName: "",
        ifsc: "",
        accountNumber: "",
        accountHolder: "",
        type: "",

    }
    const [formInputs, setFormInputs] = useState(initialFormInputs);
    const [editMode, setEditMode] = useState(false);
    const { isPending, isError, error, data, isFetching, isPlaceholderData, refetch } = useQuery({
        queryKey: ['accounts', pageNo],
        queryFn: () => fetchAccounts(),
        placeholderData: keepPreviousData,
    });
    const { data: banks, refetch: refetchBanks } = useQuery({
        queryKey: ['banks'],
        queryFn: () => fetchBanks(),
        placeholderData: keepPreviousData,
    });
    const loading = isPending || isFetching;
    useEffect(() => {
        // if (data) {
        // setTotalResources(data?.totalResources ?? 0);
        // setTotalPages(data?.totalPages ?? 0);
        // }
    }, [data]);
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            const fromData = new FormData();
            fromData.append("bankName", formInputs.bankName);
            fromData.append("ifsc", formInputs.ifsc);
            fromData.append("accountNumber", formInputs.accountNumber);
            fromData.append("accountHolder", formInputs.accountHolder);
            fromData.append("type", formInputs.type);
            // if (formInputs.images && formInputs.images.length !== 0) {
            //     formInputs.images.map((image) => {
            //         fromData.append("images", image);
            //     })
            // }
            // if (formInputs.amenities && formInputs.amenities.length !== 0) {
            //     formInputs.amenities.map((amenity) => {
            //         fromData.append("amenities", amenity.value);
            //     })
            // }
            if (editMode) {
                // const data = await updateRoom(fromData, formInputs._id);
                // if (data.status) {
                //     setFormInputs(initialFormInputs);
                //     setModal(false);
                //     refetch();
                // }
            } else {
                const data = await createBankAccount(formInputs);
                if (data.status) {
                    setFormInputs(initialFormInputs);
                    setModal(false);
                    refetch();
                    // Invalidate the accounts query cache so other pages get fresh data
                    queryClient.invalidateQueries({ queryKey: ["accounts"] });
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleDelete = async (ID: string) => {
        if (confirm("Are you sure you want to delete this account?")) {
            const data = await deleteAccount(ID);
            if (data.status) {
                toast.success(data.message);
                refetch();
                // Invalidate the accounts query cache so other pages get fresh data
                queryClient.invalidateQueries({ queryKey: ["accounts"] });
            } else {
                toast.error(data.message);
            }
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
        // setFormInputs({ ...formInputs, images: [...formInputs.images, ...filesData] });
    }
    const removeFileFromArray = (fileIndex: number) => {
        // setFormInputs({
        //     ...formInputs,
        //     images: formInputs.images.filter((_, index) => index !== fileIndex),
        // });
    }
    const changePrimaryAccount = async (ID: string) => {
        if (confirm("Are you sure you want to set this account as the primary account?")) {
            const data = await setPrimaryAccount(ID);
            console.log(data);
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
                                        <Label id="name" >Bank Name</Label>
                                        <div className="relative z-20 ">
                                            <span className="absolute left-5 top-1/2 z-30 -translate-y-1/2">
                                                <ListIcon width={16} height={16} />
                                            </span>
                                            <select className="relative z-20 w-full appearance-none rounded-theme-xl border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-theme-gray-1 dark:bg-form-input text-white dark:text-white text-sm" required={true} onChange={(e) => setFormInputs({ ...formInputs, bankName: e.target.value })} value={formInputs.bankName}>
                                                <option value="" disabled={false} className="text-black dark:text-black">Select Bank Type</option>
                                                {
                                                    banks && banks.map((data, index) => (
                                                        <option key={index} value={data.name} className="text-black dark:text-black">{data.name}</option>
                                                    ))
                                                }
                                            </select>
                                            <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                                                <DownArrowIcon />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="mb-3">
                                        <Label id="accountNumber" >Account Number</Label>
                                        <Input id="accountNumber" name="accountNumber" required={true} value={formInputs.accountNumber} onChange={(e) => setFormInputs({ ...formInputs, accountNumber: e.target.value })} placeholder="Enter account number" />
                                    </div>
                                    <div className="mb-3">
                                        <Label id="ifsc" >IFSC</Label>
                                        <Input id="ifsc" name="ifsc" value={formInputs.ifsc} onChange={(e) => setFormInputs({ ...formInputs, ifsc: e.target.value })} placeholder="Enter IFSC" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="mb-3">
                                        <Label id="accountHolder" >Account Holder</Label>
                                        <Input id="accountHolder" name="accountHolder" required={true} value={formInputs.accountHolder} onChange={(e) => setFormInputs({ ...formInputs, accountHolder: e.target.value })} placeholder="Enter Account holder name" />
                                    </div>
                                    <div className="mb-3">
                                        <Label id="type" >Type of Account</Label>
                                        <Input id="type" name="type" value={formInputs.type} onChange={(e) => setFormInputs({ ...formInputs, type: e.target.value })} placeholder="For e.g Own, Business, Vendor" />
                                    </div>
                                </div>

                            </div>
                            <div className="flex flex-wrap justify-end items-center gap-4">
                                <button type="button" className="flex items-center justify-center gap-2 px-4 py-2 text-white hover:bg-opacity-90 rounded-[25px] bg-theme-gray-1 dark:bg-theme-gray-1" onClick={() => setModal(false)}>
                                    <span className="text-sm font-normal font-quicksand">Cancel</span>
                                </button>
                                <button type="submit" className="flex items-center justify-center gap-2 px-4 py-2 text-white hover:bg-opacity-90 rounded-[25px] bg-primary/50 dark:bg-primary/50">
                                    <span className="text-sm font-normal font-quicksand">
                                        {editMode ? 'Update Account' : 'Add Account'}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            </div >
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between items-center">
                <PageTitle>Bank Details</PageTitle>
                <div>
                    <Button.Hotel.Button name="Add Bank" onClick={() => {
                        setModal(!modal);
                        setFormInputs(initialFormInputs);
                        setEditMode(false);
                    }} svg={<SVG.Museum />}></Button.Hotel.Button>
                </div>
            </div >
            <PageContent>
                <div className="max-w-full overflow-x-auto">
                    <div className="flex flex-col text-center gap-2">
                        {
                            isFetching ?
                                <>
                                    <Loading />
                                </>
                                :
                                <>
                                    {
                                        data && data.length === 0 ?
                                            <NoBankAccount />
                                            :
                                            data && data.map((account, index) => {
                                                return (
                                                    <div key={index} className="border dark:border-theme-gray border-theme-gray rounded-xl p-3">
                                                        <div className="flex gap-2.5 items-center justify-between">
                                                            <div className="flex gap-2.5 items-center ">
                                                                <div className="w-12 h-12">
                                                                    <Image src={account.bankIcon} width={48} height={48} alt="Bank Icon" className="rounded-[8px]" />
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <h4 className="text-base font-bold font-quicksand leading-none">{account.bankName}</h4>
                                                                    <h5 className="text-sm font-normal font-quicksand leading-none">{account.accountNumber}</h5>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                {
                                                                    account.primaryAccount && <span className="text-sm font-bold font-quicksand">&bull; Primary Account</span>
                                                                }
                                                                <button className="flex items-center bg-primary/50 py-2 px-2.5 gap-1 rounded-[24px]" onClick={() => changePrimaryAccount(account._id)}>
                                                                    <span>
                                                                        <svg className="h-4 w-4" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <rect x="1" y="0.5" width="15" height="15" rx="7.5" stroke="white" />
                                                                            {account.primaryAccount && <circle cx="8.5" cy="8" r="6" fill="white" />}
                                                                        </svg>
                                                                    </span>
                                                                    <span className="text-sm font-quicksand">
                                                                        {(account.primaryAccount) ? "Primary" : "Set as primary"}
                                                                    </span>
                                                                </button>
                                                                <Button.Hotel.Delete svg={<SVG.Delete />} name="Delete" onClick={() => handleDelete(account?._id)} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                    }
                                </>
                        }
                    </div>
                    <div className="flex flex-col gap-1 mt-4">
                        <h3 className="text-sm font-bold font-quicksand">*Note :</h3>
                        <p className="text-sm font-normal font-quicksand">Balance can be added from active validated accounts only. It will take 30-60 mins for funds to reflects in your base account.</p>
                    </div>
                </div >
            </PageContent >
        </>
    )
}

const NoBankAccount = () => {
    return (
        <div className="py-13 flex flex-col justify-center items-center border dark:border-theme-gray border-theme-gray rounded-xl">
            <div className="w-32 h-32 bg-primary/50 flex items-center                                                                                                                                                            justify-center rounded-full mb-8">
                <div className="">
                    <svg width="71" height="71" viewBox="0 0 71 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_3397_80588)">
                            <path d="M54.915 37.0762H63.1176V56.7167H54.915V37.0762Z" fill="white" />
                            <path d="M39.3809 37.0762H47.584V56.7167H39.3809V37.0762Z" fill="white" />
                            <path d="M23.8477 37.0762H32.0508V56.7167H23.8477V37.0762Z" fill="white" />
                            <path d="M8.31445 37.0762H16.517V56.7167H8.31445V37.0762Z" fill="white" />
                            <path d="M65.8522 30.9238V28.873H5.58008V30.9238C5.58008 32.0566 6.49812 32.9746 7.63086 32.9746H63.8014C64.9336 32.9746 65.8522 32.0566 65.8522 30.9238Z" fill="white" />
                            <path d="M68.6638 60.8184H2.76855C1.63582 60.8184 0.717773 61.7364 0.717773 62.8691V68.3379C0.717773 69.4706 1.63582 70.3887 2.76855 70.3887H68.6638C69.7965 70.3887 70.7146 69.4706 70.7146 68.3379V62.8691C70.7146 61.7364 69.7965 60.8184 68.6638 60.8184Z" fill="white" />
                            <path d="M2.76642 24.7716H68.6648C69.5823 24.7716 70.3882 24.1622 70.6381 23.2794C70.8875 22.3967 70.5212 21.4551 69.7399 20.9745L36.7907 0.693085C36.1316 0.287201 35.3001 0.287201 34.6405 0.693085L1.69136 20.9745C0.910034 21.4556 0.543671 22.3967 0.79361 23.2794C1.04355 24.1622 1.84944 24.7716 2.76642 24.7716ZM34.3217 12.4509H37.11C38.2428 12.4509 39.1608 13.3689 39.1608 14.5017C39.1608 15.6344 38.2428 16.5525 37.11 16.5525H34.3217C33.189 16.5525 32.2709 15.6344 32.2709 14.5017C32.2709 13.3689 33.189 12.4509 34.3217 12.4509Z" fill="white" />
                        </g>
                        <defs>
                            <clipPath id="clip0_3397_80588">
                                <rect width="70" height="70" fill="white" transform="translate(0.71582 0.388672)" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </div>
            <p className="max-w-md text-sm font-normal font-quicksand">You don’t have any validated accounts so you won’t be able to add balance in your base account. Please try adding a new account </p>
        </div>
    )
}