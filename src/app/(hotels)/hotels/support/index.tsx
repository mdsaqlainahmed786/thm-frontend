"use client";
import { PageContent, PageTitle } from "@/components/Hotel/Layouts/AdminLayout"
import { useState } from "react";
import { contactUs, fetchFAQs } from "@/api-services/common";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Paginator from "@/components/Paginator";
import { useEffect } from "react";
import toast from "react-hot-toast";
const Support: React.FC<{}> = () => {
    const [currentTab, setCurrentTab] = useState<'faqs' | 'contact-us'>('contact-us');
    const initialInputs = {
        name: '',
        email: '',
        message: ''
    };
    const [formInputs, setFormInputs] = useState(initialInputs);
    const [openIndex, setOpenIndex] = useState<null | number>(null);
    const [pageNo, setPageNo] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResources, setTotalResources] = useState(0);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        contactUs(formInputs).then((data) => {
            setFormInputs(initialInputs);
            toast.success("Contact form submit successfully");
        }).catch((error) => console.log(error));
        console.log(formInputs)
    }
    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const { isPending, isError, error, data, isFetching, isPlaceholderData, refetch } = useQuery({
        queryKey: ['faqs', pageNo],
        queryFn: () => fetchFAQs('', pageNo),
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
            <div className="mb-4 flex flex-row  gap-3 justify-between items-center">
                <PageTitle>Support</PageTitle>
            </div>
            <PageContent>
                <div className="flex w-full">
                    <button className={`w-full relative font-comic-sans ${currentTab === 'contact-us' ? "after:content-[''] after:absolute after:border after:border-white after:w-full after:left-0 after:-bottom-3" : ""}`} onClick={() => setCurrentTab('contact-us')}>
                        <span className="text-sm font-normal text-white dark:text-white">
                            Contact us
                        </span>
                    </button>
                    <button className={`w-full relative font-comic-sans ${currentTab === 'faqs' ? "after:content-[''] after:absolute after:border after:border-white after:w-full after:left-0 after:-bottom-3" : ""}`} onClick={() => setCurrentTab('faqs')}>
                        <span className="text-sm font-normal text-white dark:text-white">
                            FAQS
                        </span>
                    </button>
                </div>
                {
                    currentTab === "contact-us" ?
                        <form className="flex flex-col gap-3 pt-6" onSubmit={handleSubmit}>
                            <div className={`rounded-xl border border-theme-gray bg-theme-black px-4 py-3 shadow-default dark:border-theme-gray dark:bg-theme-black`}>
                                <div className="flex gap-2 items-center">
                                    <div>
                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.954" fillRule="evenodd" clipRule="evenodd" d="M10.498 1.47852C10.9186 1.47852 11.3392 1.47852 11.7598 1.47852C14.8739 1.73934 17.2798 3.17424 18.9775 5.7832C19.5051 6.69001 19.8886 7.65485 20.1279 8.67773C20.272 9.39625 20.3895 10.1137 20.4805 10.8301C20.4805 11.3496 20.4805 11.8691 20.4805 12.3887C20.3462 13.5519 19.9442 14.6157 19.2744 15.5801C19.1393 15.7659 18.9599 15.8463 18.7363 15.8213C18.5325 15.7047 18.4769 15.5377 18.5693 15.3203C19.2772 14.4468 19.673 13.4448 19.7568 12.3145C19.819 10.5105 19.4974 8.77867 18.792 7.11914C17.2901 4.12393 14.8533 2.59008 11.4814 2.51758C8.68095 2.58825 6.36781 3.67679 4.54199 5.7832C3.31556 7.35887 2.65996 9.15247 2.5752 11.1641C2.47884 13.3424 2.36133 15.5195 2.22266 17.6953C2.22761 18.1389 2.29565 18.5718 2.42676 18.9941C2.54162 19.3513 2.78283 19.5059 3.15039 19.458C3.61726 19.2493 4.06257 19.0019 4.48633 18.7158C4.99123 18.3949 5.4865 18.3826 6.08252 18.3447C6.27719 18.3576 6.4689 18.3885 6.65771 18.4375C8.25583 19.247 10.2088 19.6415 12 19.5C13.5219 19.372 14.7784 18.7734 16.1758 18.1592C16.5866 18.0999 16.7289 18.2669 16.6025 18.6602C16.2854 18.9705 15.9205 19.2117 15.5078 19.3838C14.2334 19.993 12.8975 20.3579 11.5 20.4785C11.0918 20.4785 10.6836 20.4785 10.2754 20.4785C8.88898 20.3731 7.59016 19.9711 6.37891 19.2725C6.02852 19.1475 5.68218 19.1599 5.33984 19.3096C5.0061 19.4764 4.68449 19.6619 4.375 19.8662C2 21 1.73911 20.3048 1.48047 18.4375C1.48047 17.9427 1.48047 17.4479 1.48047 16.9531C1.55591 16.4784 1.61158 15.996 1.64746 15.5059C1.70989 14.2933 1.77792 13.0811 1.85156 11.8691C1.49561 8.64968 2.49757 5.94689 4.85742 3.76074C6.49595 2.40833 8.37617 1.64759 10.498 1.47852Z" fill="white" fillOpacity="0.6" />
                                            <path opacity="0.951" fillRule="evenodd" clipRule="evenodd" d="M6.62897 7.09083C7.16761 6.66045 7.88005 6.39412 8.54468 6.57748C9.05736 6.71892 9.29613 7.08221 9.5049 7.91877C9.55752 8.3875 9.50805 8.84517 9.35646 9.29182C9.2353 9.62439 9.11777 9.95838 9.00392 10.2938C9.26977 11.0054 9.65322 11.6424 10.1543 12.2049C10.5767 12.5493 11.0591 12.673 11.6016 12.576C12.1189 12.4977 12.9858 12.2379 13.5076 12.2049C14.5663 12.2484 15.3271 12.7431 15.7898 13.6893C16.0024 14.4369 15.7983 15.0492 15.1775 15.5262C14.5818 15.9598 14.2344 16.133 13.4942 16.1942C11.8648 16.3312 10.3804 15.9353 9.04103 15.0067C7.43227 13.8735 6.32518 12.3706 5.71974 10.4979C5.3525 8.81742 5.56852 7.93815 6.62897 7.09083ZM9.04103 8.0858C8.98998 7.01321 7.44625 7.12286 6.9085 8.05231C6.7895 8.258 6.69012 8.47945 6.61037 8.71666C6.41395 9.60398 6.51292 10.4575 6.90724 11.2772C7.64212 12.7667 8.72449 13.9356 10.1543 14.784C11.1727 15.4005 12.2736 15.6478 13.457 15.5262C14.2532 15.4776 14.9026 15.1498 15.4053 14.5428C15.5178 14.3719 15.555 14.1864 15.5166 13.9862C15.2308 13.3174 14.7236 12.9463 13.9951 12.8729C13.269 12.9879 12.5453 13.1178 11.8242 13.2626C11.2687 13.3083 10.7616 13.1723 10.3028 12.8544C9.65734 12.3287 9.15591 11.6994 8.79843 10.9666C8.60344 10.5668 8.49092 10.1235 8.54005 9.6815C8.61969 9.35592 8.72271 9.0388 8.8491 8.73012C8.93404 8.52264 8.98608 8.30315 9.04103 8.0858Z" fill="white" fillOpacity="0.6" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-normal text-white/60 dark:text-white/60 font-comic-sans">WhatsApp</p>
                                </div>
                            </div>
                            <p className="text-sm font-normal text-white/60 dark:text-white/60 font-comic-sans">
                                Or
                            </p>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="name" className="text-sm font-normal text-white/60 dark:text-white/60 font-comic-sans">
                                    Name
                                </label>
                                <input id="name" className="text-sm font-normal text-white/60 dark:text-white/60 w-full h-full rounded-xl border border-theme-gray bg-theme-black px-4 py-3.5 shadow-default dark:border-theme-gray dark:bg-theme-black outline-0 focus:border-primary/50 font-comic-sans" placeholder="" value={formInputs.name} onChange={(e) => setFormInputs({ ...formInputs, name: e.target.value })} required={true} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="email" className="text-sm font-normal text-white/60 dark:text-white/60 font-comic-sans">
                                    Email
                                </label>
                                <input id="email" type="email" className="text-sm font-normal text-white/60 dark:text-white/60 w-full h-full rounded-xl border border-theme-gray bg-theme-black px-4 py-3.5 shadow-default dark:border-theme-gray dark:bg-theme-black outline-0 focus:border-primary/50 font-comic-sans" value={formInputs.email} placeholder="" onChange={(e) => setFormInputs({ ...formInputs, email: e.target.value })} required={true} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="message" className="text-sm font-normal text-white/60 dark:text-white/60 font-comic-sans">
                                    Message
                                </label>
                                <textarea rows={3} id="message" className="text-sm font-normal text-white/60 dark:text-white/60 w-full h-full rounded-xl border border-theme-gray bg-theme-black px-4 py-3.5 shadow-default dark:border-theme-gray dark:bg-theme-black outline-0 focus:border-primary/50 font-comic-sans" placeholder="" value={formInputs.message} onChange={(e) => setFormInputs({ ...formInputs, message: e.target.value })} required={true} ></textarea>
                            </div>
                            <div className="text-right">
                                <button className="text-sm font-normal px-5 py-2 bg-primary/50 text-white dark:text-white rounded-3xl" >
                                    Send
                                </button>
                            </div>
                        </form> :
                        <>

                            {data && data.data && data.data.length !== 0 ?
                                <div className="flex flex-col gap-3  pt-6">
                                    {data.data.map((faq, index) => {
                                        return (
                                            <div key={index} className="rounded-xl border border-theme-gray bg-theme-black px-4 py-3 shadow-default dark:border-theme-gray dark:bg-theme-black outline-0 focus:border-primary/50 font-comic-sans cursor-pointer" onClick={() => toggleFAQ(index)}>
                                                <div className="flex justify-between"  >
                                                    <span className="text-sm font-bold font-comic-sans tracking-wide text-white/60 dark:text-white/60 leading-loose">{faq.question}</span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className={`w-6 h-6 transform transition-transform duration-500 ${openIndex === index ? "rotate-180" : "rotate-0"
                                                            }`}
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 9l-7 7-7-7"
                                                        />
                                                    </svg>
                                                </div>
                                                {openIndex === index && (
                                                    <div className="flex flex-col">
                                                        <div className="border-b border-white/20 my-2.5">
                                                        </div>
                                                        <div className="text-sm font-normal font-comic-sans tracking-normal text-white/60 dark:text-white/60">
                                                            {faq.answer}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>)

                                    })}
                                    <div>
                                        <Paginator pageNo={pageNo} totalPages={totalPages} totalResources={totalResources} onPageChange={(e, pageNo) => setPageNo(pageNo)} />
                                    </div>
                                </div>

                                : null
                            }
                        </>
                }
            </PageContent ></>
    )
}

export default Support;
