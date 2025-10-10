"use client"
import { PageContent, PageTitle } from "@/components/Hotel/Layouts/AdminLayout";
import Link from "next/link";
import { useState, useEffect, EventHandler } from "react";
import StatusButton from "@/components/Hotel/Common/Booking/StatusButton";
import { useQuery } from "@tanstack/react-query";
import { fetchBooking } from "@/api-services/booking";
import { keepPreviousData } from "@tanstack/react-query";
import Image from "next/image";
import { DefaultProfilePic } from "@/components/Hotel/Profile";
import { DefaultPlaceholderImage } from "@/components/Hotel/Layouts/Placeholder";
import moment from "moment";
import StatusDropDown from "@/components/Hotel/Common/Booking/StatusButton/dropdown";
import { changeBookingStatus } from "@/api-services/booking";
const CheckInIcon = () => {
    return (
        <div className="flex justify-center items-center w-10 h-10 border-[1.5px] rounded-full border-[#505050]">
            <div className="flex justify-center items-center w-8 h-8 bg-[#3B88C3] rounded-full">
                <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.78125 0.878906V15.1228L11.2188 13.7916V2.21012L6.78125 0.878906ZM3.71875 1.71959V6.71959H4.28125V2.28209H6.21875V1.71959H3.71875ZM11.7806 1.72053L11.7812 1.79162V2.71959H12.2812V1.71959L11.7806 1.72053ZM11.7812 3.28209V3.78209H12.2812V3.28209H11.7812ZM11.7812 4.34459V11.7196H12.2812V4.34459H11.7812ZM7.625 7.25084C7.83209 7.25084 8 7.58662 8 8.00084C8 8.41506 7.83209 8.75084 7.625 8.75084C7.41791 8.75084 7.25 8.41506 7.25 8.00084C7.25 7.58662 7.41791 7.25084 7.625 7.25084ZM3.71875 9.28209V14.0008H4.28125V9.28209H3.71875ZM11.7812 12.2821V12.7196H12.2812V12.2821H11.7812ZM11.7812 13.2821V14.0008H12.2812V13.2821H11.7812ZM1 14.7196V15.2821H6.21875V14.7196H1ZM10.0829 14.7196L8.20788 15.2821H15V14.7196H10.0829Z" fill="white" />
                    <path d="M5.73633 8L4.73631 7V7.60531H3.08889V8.39469H4.73631V9L5.73633 8Z" fill="white" />
                </svg>
            </div>
        </div>
    )
}
export default function BookingDetails({ bookingID, edit }: { bookingID: string, edit: boolean }) {
    const [toggleIndex, setToggleIndex] = useState("");
    const { isPending, isError, error, data, isFetching, isPlaceholderData, refetch } = useQuery({
        queryKey: ['booking-details'],
        queryFn: () => fetchBooking(bookingID),
        placeholderData: keepPreviousData,
    });
    const loading = isPending || isFetching;
    const bookingStatus = data?.status ?? "";
    const handleStatusChange = async (status: string, bookingID: string) => {
        try {
            setToggleIndex("");
            await changeBookingStatus(bookingID, status)
            refetch();
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        refetch();
    }, [bookingID]);
    return (
        <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between items-center">
                <PageTitle>
                    <Link href={`/hotels/booking-management`} className="flex items-center gap-2">
                        <svg width="21" height="17" viewBox="0 0 21 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.34404 6.83337L1.96054 7.21687L1.57812 6.83337L1.96054 6.44987L2.34404 6.83337ZM20.219 15.5C20.219 15.6437 20.162 15.7815 20.0604 15.8831C19.9588 15.9846 19.821 16.0417 19.6774 16.0417C19.5337 16.0417 19.3959 15.9846 19.2944 15.8831C19.1928 15.7815 19.1357 15.6437 19.1357 15.5H20.219ZM7.37721 12.6335L1.96054 7.21687L2.72754 6.44987L8.14421 11.8665L7.37721 12.6335ZM1.96054 6.44987L7.37721 1.0332L8.14421 1.8002L2.72754 7.21687L1.96054 6.44987ZM2.34404 6.2917H13.1774V7.37504H2.34404V6.2917ZM20.219 13.3334V15.5H19.1357V13.3334H20.219ZM13.1774 6.2917C15.0449 6.2917 16.836 7.03359 18.1566 8.35416C19.4772 9.67473 20.219 11.4658 20.219 13.3334H19.1357C19.1357 11.7531 18.508 10.2376 17.3906 9.12019C16.2731 8.00279 14.7576 7.37504 13.1774 7.37504V6.2917Z" fill="white" />
                            <path d="M1.96054 7.21687L2.34404 6.83337L1.96054 6.44987M1.96054 7.21687L1.57812 6.83337L1.96054 6.44987M1.96054 7.21687L7.37721 12.6335L8.14421 11.8665L2.72754 6.44987L1.96054 7.21687ZM1.96054 6.44987L7.37721 1.0332L8.14421 1.8002L2.72754 7.21687L1.96054 6.44987ZM20.219 15.5C20.219 15.6437 20.162 15.7815 20.0604 15.8831C19.9588 15.9846 19.821 16.0417 19.6774 16.0417C19.5337 16.0417 19.3959 15.9846 19.2944 15.8831C19.1928 15.7815 19.1357 15.6437 19.1357 15.5M20.219 15.5H19.1357M20.219 15.5V13.3334M19.1357 15.5V13.3334M13.1774 6.2917H2.34404V7.37504H13.1774M13.1774 6.2917V7.37504M13.1774 6.2917C15.0449 6.2917 16.836 7.03359 18.1566 8.35416C19.4772 9.67473 20.219 11.4658 20.219 13.3334M13.1774 7.37504C14.7576 7.37504 16.2731 8.00279 17.3906 9.12019C18.508 10.2376 19.1357 11.7531 19.1357 13.3334M20.219 13.3334H19.1357" stroke="white" strokeWidth="1.08333" />
                        </svg>
                        <span>Booking Details</span>
                    </Link>

                </PageTitle>
                <div className="w-40 relative ">
                    {
                        ['created', 'pending',].includes(bookingStatus) ? <>
                            <div className="flex justify-end">
                                <StatusButton status={bookingStatus ?? ''} isToggled={toggleIndex === bookingID} onClick={() => toggleIndex === bookingID ? setToggleIndex("") : setToggleIndex(bookingID)} />
                            </div>
                            <StatusDropDown open={bookingID === toggleIndex} onStatusChange={(status) => handleStatusChange(status, bookingID)} />
                        </> :
                            <div className="flex justify-end">
                                <StatusButton status={bookingStatus} disabled={true} />
                            </div>
                    }
                </div>
            </div >
            <PageContent>
                <div className="flex flex-col gap-3">
                    <div className="grid  grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        <div className={`rounded-xl border border-theme-gray bg-theme-black px-5  py-6 shadow-default dark:border-theme-gray dark:bg-theme-black sm:px-7.5 ${loading ? 'animate-pulse' : ''}`}>
                            <div className="flex flex-col gap-2.5 justify-between">
                                <div className="flex flex-col gap-3">
                                    <div className="flex bg-primary/60 p-2.5 gap-2 rounded-[14px]">
                                        {/* <div className="min-h-40  rounded-[14px] relative flex justify-center" > */}
                                        <Image src={data?.usersRef?.profilePic?.small ?? DefaultProfilePic} width={330} height={160} alt="Default cover image" className="w-10 h-10 rounded-full  object-cover border-2 border-[#1C1C1C99]" />
                                        {/* </div> */}
                                        <div className="flex flex-col gap">
                                            <h2 className="text-sm font-normal">{data?.bookingID}</h2>
                                            <p className="text-sm font-bold">{data?.usersRef?.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 dark:border-strokedark border border-stroke p-2.5 rounded-[14px] bg-[#1C1C1C99] dark:bg-[#1C1C1C99]">
                                        <div className="flex justify-between">
                                            <p className="text-sm font-normal text-white/60 dark:text-white/60">
                                                Room type :
                                            </p>
                                            <div className="flex items-center gap-1">
                                                <div className="flex justify-center items-center border border-[#505050] w-7.5 h-7.5 rounded-full">
                                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g clip-path="url(#clip0_3397_81583)">
                                                            <path opacity="0.948" fill-rule="evenodd" clip-rule="evenodd" d="M12.3005 1.41747C12.428 1.40619 12.5507 1.42293 12.6688 1.46769C12.7993 1.65423 12.9165 1.84954 13.0203 2.05363C13.2017 2.16388 13.3859 2.26991 13.5728 2.37171C13.7609 2.59581 13.7498 2.80786 13.5393 3.00787C13.3884 3.1001 13.2321 3.1838 13.0705 3.25898C12.9587 3.41552 12.8639 3.58293 12.786 3.76122C12.5728 4.01267 12.3496 4.02382 12.1163 3.7947C12.0172 3.62439 11.9223 3.4514 11.8317 3.27573C11.6112 3.16834 11.4047 3.03999 11.2123 2.89068C11.1383 2.72806 11.1494 2.57181 11.2458 2.42193C11.4272 2.31167 11.6113 2.20565 11.7982 2.10385C11.928 1.91686 12.0452 1.72155 12.1498 1.51791C12.2051 1.4878 12.2553 1.45432 12.3005 1.41747Z" fill="#3D50DF" fill-opacity="0.3" />
                                                            <path opacity="0.921" fill-rule="evenodd" clip-rule="evenodd" d="M7.6811 1.54688C8.03082 1.55628 8.1536 1.73485 8.0494 2.08259C8.17268 2.07705 8.29543 2.08264 8.4177 2.09933C8.61053 2.22964 8.63286 2.38589 8.48467 2.56808C8.34304 2.61127 8.19793 2.62801 8.0494 2.6183C8.05493 2.74157 8.04937 2.86434 8.03266 2.98661C7.88788 3.18218 7.73166 3.19335 7.56391 3.02009C7.51858 2.89075 7.50183 2.75683 7.51369 2.6183C7.37517 2.63015 7.24124 2.61341 7.1119 2.56808C6.99063 2.43409 6.97945 2.289 7.07842 2.13281C7.21904 2.08703 7.36412 2.07029 7.51369 2.08259C7.50816 1.97043 7.51375 1.85882 7.53043 1.74777C7.55048 1.65555 7.60071 1.58859 7.6811 1.54688Z" fill="#3D50DF" fill-opacity="0.3" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.737 2.51925C12.5096 2.61294 12.3645 2.78035 12.3018 3.02148C12.1714 2.87503 12.0152 2.75784 11.833 2.66992C11.9611 2.61146 12.0839 2.5445 12.2013 2.46903C12.2836 2.34347 12.3618 2.21512 12.4357 2.08398C12.525 2.23968 12.6255 2.38477 12.737 2.51925Z" fill="#F7DA73" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.737 2.51758C12.8357 2.56691 12.9361 2.61713 13.0384 2.66825C12.9268 2.73521 12.8151 2.80218 12.7035 2.86914C12.6101 2.99457 12.5208 3.12292 12.4357 3.25419C12.3818 3.17967 12.3371 3.10155 12.3018 3.01981C12.3645 2.77868 12.5096 2.61126 12.737 2.51758Z" fill="#F7CB58" />
                                                            <path opacity="0.98" fill-rule="evenodd" clip-rule="evenodd" d="M17.5618 12.1938C17.5618 12.9192 17.5618 13.6447 17.5618 14.3701C17.4675 14.6429 17.2778 14.8103 16.9926 14.8724C16.9926 15.2518 16.9926 15.6313 16.9926 16.0108C17.2048 15.9797 17.3946 16.0244 17.5618 16.1447C17.5618 16.234 17.5618 16.3232 17.5618 16.4125C17.5345 16.4676 17.4898 16.5066 17.4279 16.5297C11.8029 16.5521 6.17787 16.5521 0.552874 16.5297C0.490924 16.5066 0.446281 16.4676 0.418945 16.4125C0.418945 16.3232 0.418945 16.234 0.418945 16.1447C0.586193 16.0244 0.775925 15.9797 0.988142 16.0108C0.988142 15.6313 0.988142 15.2518 0.988142 14.8724C0.702977 14.8103 0.513245 14.6429 0.418945 14.3701C0.418945 13.6447 0.418945 12.9192 0.418945 12.1938C0.52075 11.947 0.699322 11.7795 0.95466 11.6916C0.887079 11.0168 1.08797 10.442 1.55734 9.96723C1.70244 9.84458 1.86427 9.74973 2.04283 9.68263C2.05399 9.07995 2.06515 8.47727 2.07631 7.87459C2.12083 7.75717 2.20453 7.70139 2.32743 7.70718C2.44671 7.71137 2.53042 7.76718 2.57854 7.87459C2.59528 8.45484 2.60086 9.03518 2.59528 9.61566C2.79618 9.61566 2.99707 9.61566 3.19796 9.61566C3.19238 8.94592 3.19796 8.27628 3.2147 7.60674C3.3316 7.17733 3.60504 6.90391 4.03502 6.78642C5.25152 6.76409 6.46806 6.76409 7.68457 6.78642C8.13695 6.87043 8.43273 7.1327 8.57185 7.57325C8.58859 8.25398 8.59418 8.93477 8.58859 9.61566C8.85645 9.61566 9.1243 9.61566 9.39216 9.61566C9.38657 8.93477 9.39216 8.25398 9.4089 7.57325C9.54079 7.16233 9.81423 6.90006 10.2292 6.78642C11.4457 6.76409 12.6623 6.76409 13.8788 6.78642C13.9901 6.818 14.1017 6.84589 14.2136 6.87013C14.5024 7.03392 14.6866 7.27945 14.766 7.60674C14.7828 8.27628 14.7884 8.94592 14.7828 9.61566C14.9837 9.61566 15.1846 9.61566 15.3855 9.61566C15.3911 8.28749 15.3855 6.95936 15.3687 5.63129C15.2458 5.26289 14.9947 5.03407 14.6154 4.94491C11.8196 4.91705 9.02941 4.92261 6.24484 4.96165C6.12008 5.15494 6.0029 5.35583 5.89328 5.56432C5.67896 5.75293 5.47806 5.74175 5.2906 5.53084C5.18456 5.33554 5.07855 5.14021 4.97252 4.94491C4.42565 4.92257 3.87876 4.92257 3.33189 4.94491C2.97151 5.0486 2.73156 5.27742 2.61203 5.63129C2.60087 6.03307 2.5897 6.43486 2.57854 6.83665C2.55009 6.97101 2.46638 7.03797 2.32743 7.03754C2.20453 7.04333 2.12083 6.98755 2.07631 6.87013C2.0476 6.42244 2.05876 5.97602 2.10979 5.53084C2.25808 4.99195 2.59848 4.64039 3.131 4.47616C3.46362 4.42945 3.79843 4.41271 4.13546 4.42593C4.07844 4.2615 4.09518 4.10527 4.18569 3.95718C4.41742 3.80501 4.65738 3.66549 4.90555 3.53866C5.03814 3.31257 5.16648 3.08377 5.2906 2.85227C5.48031 2.68621 5.6812 2.67505 5.89328 2.81879C6.02011 3.06698 6.15963 3.30693 6.3118 3.53866C6.55997 3.66549 6.79994 3.80501 7.03167 3.95718C7.13094 4.10628 7.13653 4.25695 7.04841 4.40919C9.6042 4.42034 12.16 4.43152 14.7158 4.44267C15.317 4.57506 15.702 4.93781 15.871 5.53084C15.9142 6.91382 15.9366 8.29774 15.9379 9.68263C16.5151 9.93254 16.8611 10.3678 16.9759 10.9884C16.9815 11.2236 16.9983 11.458 17.0261 11.6916C17.2704 11.7909 17.449 11.9583 17.5618 12.1938ZM5.27386 14.6715C5.4859 14.6715 5.69797 14.6715 5.91002 14.6715C5.9214 14.7778 5.97722 14.8503 6.07743 14.8891C9.01267 14.9058 11.948 14.9114 14.8832 14.9058C14.8832 15.2741 14.8832 15.6424 14.8832 16.0108C10.9547 16.0108 7.02608 16.0108 3.09752 16.0108C3.09752 15.6424 3.09752 15.2741 3.09752 14.9058C3.76725 14.9114 4.4369 14.9058 5.10645 14.8891C5.20666 14.8503 5.26247 14.7778 5.27386 14.6715Z" fill="#3D50DF" fill-opacity="0.3" />
                                                            <path opacity="0.915" fill-rule="evenodd" clip-rule="evenodd" d="M9.82411 2.85574C10.0937 2.83513 10.2165 2.95789 10.1924 3.22404C10.4075 3.1917 10.5303 3.28099 10.5607 3.4919C10.53 3.70027 10.4072 3.78955 10.1924 3.75976C10.2256 3.97263 10.1363 4.09541 9.92455 4.12806C9.73197 4.08055 9.6427 3.9578 9.6567 3.75976C9.32067 3.73766 9.23137 3.57583 9.38884 3.27426C9.47301 3.23233 9.56228 3.21559 9.6567 3.22404C9.6425 3.06432 9.69832 2.94156 9.82411 2.85574Z" fill="#3D50DF" fill-opacity="0.3" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.00935 3.9894C5.88871 4.06105 5.76593 4.1336 5.64104 4.20703C5.54314 4.3434 5.45384 4.48289 5.37319 4.62556C5.33552 4.57102 5.29085 4.52079 5.23926 4.47489C5.083 4.38559 4.92677 4.29633 4.77051 4.20703C4.9859 4.10782 5.1812 3.97945 5.35645 3.82199C5.43345 3.67257 5.51716 3.52748 5.60756 3.38672C5.70242 3.55413 5.7973 3.72154 5.89216 3.88895C5.9305 3.92699 5.96957 3.96047 6.00935 3.9894Z" fill="#F9DB74" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.0014 3.99219C6.14945 4.056 6.29456 4.12853 6.43666 4.20982C6.2804 4.29912 6.12417 4.38838 5.96791 4.47768C5.82545 4.64817 5.70267 4.83232 5.59961 5.03013C5.50419 4.90628 5.42607 4.77235 5.36523 4.62835C5.44589 4.48568 5.53519 4.34619 5.63309 4.20982C5.75798 4.1364 5.88076 4.06384 6.0014 3.99219Z" fill="#F7CB58" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.23577 4.96318C8.76926 4.95759 11.3028 4.96318 13.8362 4.97992C14.0289 5.15871 14.1572 5.37635 14.2213 5.63282C14.249 6.05158 14.2434 6.46452 14.2045 6.87166C14.0926 6.84742 13.981 6.81953 13.8697 6.78796C12.6532 6.76562 11.4367 6.76562 10.2201 6.78796C9.80517 6.90159 9.53172 7.16386 9.39983 7.57479C9.38309 8.25551 9.3775 8.9363 9.38309 9.6172C9.11523 9.6172 8.84738 9.6172 8.57952 9.6172C8.58511 8.9363 8.57952 8.25551 8.56278 7.57479C8.42366 7.13423 8.12788 6.87196 7.6755 6.78796C6.459 6.76562 5.24246 6.76562 4.02595 6.78796C3.59597 6.90544 3.32253 7.17886 3.20564 7.60827C3.1889 8.27781 3.18332 8.94745 3.1889 9.6172C2.988 9.6172 2.78711 9.6172 2.58622 9.6172C2.59179 9.03672 2.58621 8.45637 2.56948 7.87612C2.52135 7.76871 2.43765 7.7129 2.31836 7.70871C2.31836 7.48549 2.31836 7.2623 2.31836 7.03907C2.45731 7.03951 2.54102 6.97254 2.56948 6.83818C2.58064 6.43639 2.5918 6.03461 2.60296 5.63282C2.72249 5.27895 2.96245 5.05013 3.32282 4.94644C3.86969 4.9241 4.41658 4.9241 4.96345 4.94644C5.06949 5.14174 5.17549 5.33707 5.28153 5.53237C5.469 5.74328 5.66989 5.75446 5.88421 5.56586C5.99383 5.35736 6.11102 5.15647 6.23577 4.96318Z" fill="#F5A86B" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.24414 4.96384C9.02872 4.9248 11.8189 4.91924 14.6147 4.9471C14.994 5.03626 15.2451 5.26508 15.368 5.63348C15.3848 6.96155 15.3904 8.28969 15.3848 9.61786C15.1839 9.61786 14.983 9.61786 14.7821 9.61786C14.7877 8.94812 14.7821 8.27847 14.7653 7.60893C14.6859 7.28164 14.5017 7.03612 14.2129 6.87232C14.2517 6.46518 14.2573 6.05225 14.2296 5.63348C14.1656 5.37701 14.0373 5.15938 13.8446 4.98058C11.3111 4.96384 8.77763 4.95825 6.24414 4.96384Z" fill="#E69957" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.09877 7.30874C5.1033 7.30315 6.10777 7.30874 7.11216 7.32548C7.18422 7.40815 7.23444 7.503 7.26283 7.61008C7.27958 8.26847 7.28517 8.92696 7.27958 9.58552C6.09655 9.58552 4.91349 9.58552 3.73047 9.58552C3.73047 8.94936 3.73047 8.3132 3.73047 7.67704C3.77511 7.47615 3.89788 7.35337 4.09877 7.30874Z" fill="#FEFEFE" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.09473 7.30771C4.68056 7.28538 5.27206 7.27423 5.86928 7.27423C6.50708 7.26947 7.14324 7.28621 7.77776 7.32445C7.90794 7.39885 8.0028 7.50485 8.06236 7.64253C8.0791 8.28974 8.08469 8.93708 8.0791 9.58449C7.81124 9.58449 7.54339 9.58449 7.27553 9.58449C7.28112 8.92593 7.27553 8.26744 7.25879 7.60905C7.2304 7.50197 7.18017 7.40712 7.10812 7.32445C6.10372 7.30771 5.09926 7.30212 4.09473 7.30771Z" fill="#EFECEF" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.2886 7.30874C11.2932 7.30315 12.2976 7.30874 13.302 7.32548C13.3711 7.40955 13.4213 7.50441 13.4527 7.61008C13.4695 8.26847 13.475 8.92696 13.4695 9.58552C13.2288 9.57464 12.9944 9.58582 12.7663 9.61901C12.677 9.64134 12.6212 9.69712 12.5989 9.78642C12.4905 9.8282 12.3733 9.85053 12.2474 9.85338C12.1214 9.85053 12.0042 9.8282 11.8958 9.78642C11.8819 9.71101 11.8372 9.66079 11.7619 9.63575C11.137 9.61901 10.512 9.61341 9.88686 9.61901C9.88127 8.96045 9.88686 8.30195 9.9036 7.64356C9.9766 7.46433 10.1049 7.3527 10.2886 7.30874Z" fill="#FEFEFE" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.293 7.30756C11.4815 7.26858 12.6757 7.26299 13.8756 7.29082C14.0749 7.35051 14.1976 7.47885 14.2439 7.67586C14.2439 8.31202 14.2439 8.94818 14.2439 9.58434C13.9872 9.58434 13.7305 9.58434 13.4738 9.58434C13.4794 8.92578 13.4738 8.26729 13.457 7.6089C13.4257 7.50323 13.3754 7.40837 13.3064 7.3243C12.302 7.30756 11.2975 7.30197 10.293 7.30756Z" fill="#EEECEE" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.72609 7.67383C3.72609 8.30999 3.72609 8.94615 3.72609 9.58231C4.90911 9.58231 6.09217 9.58231 7.27519 9.58231C7.54305 9.58231 7.81091 9.58231 8.07876 9.58231C6.62239 9.61576 5.16036 9.62691 3.6926 9.61579C3.68155 8.96266 3.69271 8.31531 3.72609 7.67383Z" fill="#A1A1A1" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2437 7.67383C14.2771 8.31531 14.2883 8.96266 14.2772 9.61579C13.775 9.61579 13.2727 9.61579 12.7705 9.61579C12.9986 9.58261 13.233 9.57143 13.4736 9.58231C13.7303 9.58231 13.987 9.58231 14.2437 9.58231C14.2437 8.94615 14.2437 8.30999 14.2437 7.67383Z" fill="#A19FA1" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.8961 9.7832C12.0045 9.82499 12.1217 9.84732 12.2476 9.85017C12.3736 9.84732 12.4908 9.82499 12.5992 9.7832C12.5643 9.93833 12.6201 10.0443 12.7666 10.1013C13.3915 10.118 14.0165 10.1236 14.6416 10.118C15.0923 10.5324 15.2709 11.0458 15.1773 11.6582C10.6237 11.6582 6.07017 11.6582 1.5166 11.6582C1.5166 11.4685 1.5166 11.2787 1.5166 11.089C1.5836 10.6043 1.85146 10.2862 2.32017 10.1348C5.45634 10.1236 8.59248 10.1124 11.7287 10.1013C11.8751 10.0443 11.931 9.93833 11.8961 9.7832Z" fill="#FEE4C1" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6455 10.1193C14.9582 10.1137 15.2707 10.1193 15.583 10.136C16.0899 10.2578 16.3801 10.5759 16.4535 11.0903C16.4535 11.28 16.4535 11.4697 16.4535 11.6594C16.0294 11.6594 15.6053 11.6594 15.1812 11.6594C15.2748 11.0471 15.0962 10.5336 14.6455 10.1193Z" fill="#FDD1A3" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M1.51599 11.0879C1.51599 11.2776 1.51599 11.4673 1.51599 11.6571C6.06956 11.6571 10.6231 11.6571 15.1767 11.6571C15.6008 11.6571 16.0249 11.6571 16.449 11.6571C16.449 11.4673 16.449 11.2776 16.449 11.0879C16.4822 11.2824 16.4933 11.4833 16.4825 11.6906C11.4825 11.6906 6.4825 11.6906 1.48251 11.6906C1.47169 11.4833 1.48285 11.2824 1.51599 11.0879Z" fill="#B4A087" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5459 12.1974C15.5622 12.23 15.5789 12.2635 15.5961 12.2979C15.6129 12.5655 15.6184 12.8333 15.6129 13.1014C10.7133 13.1014 5.81374 13.1014 0.914197 13.1014C0.908625 12.8445 0.914207 12.5878 0.930938 12.3313C0.970002 12.2923 1.00906 12.2532 1.04813 12.2142C5.8807 12.1974 10.7133 12.1918 15.5459 12.1974Z" fill="#F5A86B" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5497 12.1974C16.0074 12.1918 16.465 12.1974 16.9224 12.2142C16.9615 12.2532 17.0005 12.2923 17.0396 12.3313C17.0564 12.599 17.0619 12.8668 17.0564 13.1349C11.6713 13.1461 6.29182 13.1349 0.917969 13.1014C5.81751 13.1014 10.7171 13.1014 15.6166 13.1014C15.6222 12.8333 15.6166 12.5655 15.5999 12.2979C15.5827 12.2635 15.566 12.23 15.5497 12.1974Z" fill="#CD884E" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.914193 13.6348C5.81373 13.6348 10.7133 13.6348 15.6129 13.6348C15.6204 13.8817 15.6092 14.1273 15.5794 14.3714C12.4153 14.3602 9.25677 14.3714 6.10392 14.4049C5.97438 14.4453 5.90742 14.5346 5.90303 14.6727C5.69099 14.6727 5.47891 14.6727 5.26687 14.6727C5.26128 14.5547 5.2055 14.471 5.09946 14.4216C3.76017 14.4104 2.42089 14.3993 1.0816 14.3881C1.01229 14.3564 0.962069 14.3061 0.930934 14.2374C0.91421 14.0369 0.908628 13.836 0.914193 13.6348Z" fill="#B4ACB4" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.917969 13.6392C6.29182 13.6057 11.6713 13.5946 17.0564 13.6057C17.0619 13.8181 17.0564 14.0301 17.0396 14.2419C17.0025 14.3194 16.9411 14.3696 16.8555 14.3926C13.2729 14.4093 9.69032 14.4149 6.1077 14.4093C9.26054 14.3759 12.419 14.3647 15.5831 14.3758C15.613 14.1317 15.6242 13.8862 15.6166 13.6392C10.7171 13.6392 5.81751 13.6392 0.917969 13.6392Z" fill="#8D848D" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.12319 14.9062C2.12319 15.2746 2.12319 15.6429 2.12319 16.0112C1.92229 16.0112 1.7214 16.0112 1.52051 16.0112C1.52051 15.6429 1.52051 15.2746 1.52051 14.9062C1.7214 14.9062 1.92229 14.9062 2.12319 14.9062Z" fill="#E1DDE1" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.12319 14.9062C2.26827 14.9062 2.41337 14.9062 2.55845 14.9062C2.55845 15.2857 2.55845 15.6652 2.55845 16.0446C2.20644 16.0556 1.86046 16.0444 1.52051 16.0112C1.7214 16.0112 1.92229 16.0112 2.12319 16.0112C2.12319 15.6429 2.12319 15.2746 2.12319 14.9062Z" fill="#C9C2CA" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.0216 14.9062C16.0216 15.2746 16.0216 15.6429 16.0216 16.0112C15.8207 16.0112 15.6198 16.0112 15.4189 16.0112C15.4189 15.6429 15.4189 15.2746 15.4189 14.9062C15.6198 14.9062 15.8207 14.9062 16.0216 14.9062Z" fill="#E1DEE1" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.0216 14.9062C16.1667 14.9062 16.3118 14.9062 16.4569 14.9062C16.4569 15.2857 16.4569 15.6652 16.4569 16.0446C16.1049 16.0556 15.7589 16.0444 15.4189 16.0112C15.6198 16.0112 15.8207 16.0112 16.0216 16.0112C16.0216 15.6429 16.0216 15.2746 16.0216 14.9062Z" fill="#C9C2CA" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_3397_81583">
                                                                <rect width="17.1429" height="17.1429" fill="white" transform="translate(0.428711 0.427734)" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </div>
                                                <p className="text-base font-normal capitalize text-white dark:text-white">
                                                    {(data && data.roomsRef && data.roomsRef.roomType) || 0} Room
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="text-sm font-normal text-white/60 dark:text-white/60">
                                                Guests :
                                            </p>
                                            <p className="text-base font-normal capitalize text-white dark:text-white">
                                                {(data && data.adults) || 0}
                                            </p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="text-sm font-normal text-white/60 dark:text-white/60">
                                                Child :
                                            </p>
                                            <p className="text-base font-normal capitalize text-white dark:text-white">
                                                {(data && data.children) || 0} ({data && data.childrenAge.map((data) => (`${data} years`)).join(", ")})
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between gap-2 dark:border-strokedark border border-stroke p-2.5 rounded-[14px] bg-[#1C1C1C99] dark:bg-[#1C1C1C99]">
                                        <div className="flex gap-2">
                                            <CheckInIcon />
                                            <div>
                                                <p className="text-sm font-normal text-white/60 dark:text-white/60">
                                                    Check-in
                                                </p>
                                                <p className="text-sm font-normal text-primary">
                                                    {moment(data && data.checkIn).format("DD MMM, YYYY")}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <CheckInIcon />
                                            <div>
                                                <p className="text-sm font-normal text-white/60 dark:text-white/60">
                                                    Check-out
                                                </p>
                                                <p className="text-sm font-normal text-primary">
                                                    {moment(data && data.checkOut).format("DD MMM, YYYY")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`rounded-xl border border-theme-gray bg-theme-black px-5  py-6 shadow-default dark:border-theme-gray dark:bg-theme-black sm:px-7.5 ${loading ? 'animate-pulse' : ''}`} >
                            <h5 className="mb-4 text-base font-bold text-white dark:text-white">User Details</h5>
                            <div className="flex flex-col gap-4">
                                {
                                    data && data.guestDetails.map((guestDetail, index) => {
                                        return (
                                            <div key={index} className="flex justify-between">
                                                <p className="text-sm font-normal text-white/60 dark:text-white/60">
                                                    Guest {++index}:
                                                </p>
                                                <p className="text-base font-normal capitalize text-white dark:text-white">
                                                    {guestDetail && guestDetail.fullName}
                                                </p>
                                            </div>
                                        )
                                    })
                                }
                                <div className="flex justify-between">
                                    <p className="text-sm font-normal text-white/60 dark:text-white/60">
                                        Phone Number :
                                    </p>
                                    <p className="text-base font-normal  text-white dark:text-white">
                                        {data && data.guestDetails && data.guestDetails.length !== 0 ?

                                            data && data.guestDetails && data.guestDetails[0].mobileNumber : ""
                                        }
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-normal text-white/60 dark:text-white/60">
                                        Email :
                                    </p>
                                    <p className="text-base font-normal text-white dark:text-white">
                                        {data && data.guestDetails && data.guestDetails.length !== 0 ?
                                            data && data.guestDetails && data.guestDetails[0].email : ""
                                        }
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm font-normal text-white/60 dark:text-white/60">
                                        Address :
                                    </p>
                                    <p className="text-base font-normal capitalize text-white dark:text-white w-70">
                                        {`${data?.usersRef?.userAddressesRef?.street}, ${data?.usersRef?.userAddressesRef?.city}, ${data?.usersRef?.userAddressesRef?.state} ${data?.usersRef?.userAddressesRef?.zipCode}, ${data?.usersRef?.userAddressesRef?.country}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={`rounded-xl border border-theme-gray bg-theme-black px-5  py-6 shadow-default dark:border-theme-gray dark:bg-theme-black sm:px-7.5 ${loading ? 'animate-pulse' : ''} md:col-span-2 xl:col-span-1`}>
                            <h5 className="mb-4 text-base font-bold text-white dark:text-white">Bill Summary</h5>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-end">
                                    <p className="text-sm font-normal text-white/60 dark:text-white/60">
                                        {(data && data.roomsRef.title) || ""}<br />
                                        <small>{((data && data.bookedRoom.nights) ? `${data.bookedRoom.nights} Nights` : '')}</small>
                                    </p>
                                    <p className="text-base font-normal capitalize text-white dark:text-white">
                                        ₹ {(data && data.subTotal) || 0}
                                    </p>
                                </div>
                                {
                                    (data && data.discount > 0) &&
                                    <div className="flex justify-between items-end">
                                        <p className="text-sm font-normal text-white/60 dark:text-white/60">
                                            Promo Code <span className="font-bold ms-1 text-xs">{data && data.promoCode}</span><br />
                                            <small>{data && data.promoCodesRef && data.promoCodesRef.name} </small>
                                        </p>
                                        <p className="text-base font-normal capitalize text-white dark:text-white">
                                            -  ₹ {data.discount}
                                        </p>
                                    </div>
                                }
                                <div className="flex justify-between items-end">
                                    <p className="text-sm font-normal text-white/60 dark:text-white/60">
                                        Convince charges
                                    </p>
                                    <p className="text-base font-normal capitalize text-white dark:text-white">
                                        ₹ {(data && data.convinceCharge) || 0}
                                    </p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <p className="text-sm font-normal text-white/60 dark:text-white/60">
                                        GST(18%)
                                    </p>
                                    <p className="text-base font-normal capitalize text-white dark:text-white">
                                        ₹ {(data && data.tax) || 0}
                                    </p>
                                </div>
                                <div className="border border-dashed border-white/40 dark:border-white/40"></div>
                                <div className="flex justify-between items-end">
                                    <p className="text-sm font-normal text-white/60 dark:text-white/60">
                                        Total
                                    </p>
                                    <p className="text-base font-normal capitalize text-white dark:text-white">
                                        ₹ {(data && data.grandTotal) || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`rounded-xl border border-theme-gray bg-theme-black px-5  py-6 shadow-default dark:border-theme-gray dark:bg-theme-black sm:px-7.5 ${loading ? 'animate-pulse' : ''}`}>
                        <div className="flex flex-col justify-between gap-3.5">
                            <h5 className="text-base font-bold text-white dark:text-white">General Information</h5>
                            <p className="text-xs font-medium tracking-wide text-white dark:text-white">
                                {(data && data.roomsRef && data.roomsRef.description) || ""}
                            </p>
                            <div className="flex gap-4">
                                {
                                    data && data.roomsRef && data.roomsRef.amenitiesRef && data.roomsRef.amenitiesRef.map((data) => {
                                        return (
                                            <div className="flex items-center gap-1">
                                                <div className="flex items-center justify-center w-5 h-5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <rect x="0.333333" y="0.333333" width="15.3333" height="15.3333" rx="7.66667" stroke="#4169E1" strokeOpacity="0.666667" />
                                                        <path d="M11.5984 5L6.55844 11L4.39844 8.6" stroke="#4169E1" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-medium tracking-wide text-white/60 dark:text-white/60">
                                                    {(data && data.name) || ""}
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 xl:col-span-7">
                        <div className={`rounded-xl border border-theme-gray bg-theme-black px-5  py-6 shadow-default dark:border-theme-gray dark:bg-theme-black sm:px-7.5 ${loading ? 'animate-pulse' : ''}`}>
                            <div className="flex flex-col justify-between gap-3.5">
                                <h5 className="text-base font-bold text-white dark:text-white">Property Images</h5>
                                <div className="flex gap-3 mb-3.5">
                                    {data && data.roomsRef && data.roomsRef.roomImagesRef && data.roomsRef.roomImagesRef.map((roomImage, index) => {
                                        return (
                                            <Image key={index} src={roomImage.thumbnailUrl || DefaultPlaceholderImage} width={120} height={120} alt="Room Image" className="w-30 h-auto object-cover rounded-[14px]" />
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PageContent >
        </>
    )
}