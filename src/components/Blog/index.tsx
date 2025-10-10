const Blog = () => {
    return (
        <div className="flex my-13">
            <div className="basis-1/4">
                <h3 className="text-[52px] leading-tight font-bold font-quicksand tracking-wider text-black dark:text-white mb-10">
                    Our Resent<br />
                    <span className="text-[#565656]">Blogs</span>
                </h3>
                <button className="text-base font-normal text-white leading-5 px-5 py-4 bg-[#242424] rounded-[80px] group relative after:content[''] after:w-45 after:h-0 after:rounded-none after:bg-primary  after:absolute after:-bottom-[70px] after:-left-0.5 after:hover:w-45 after:hover:h-45 after:hover:rounded-full z-10 after:transition-all after:duration-[1.2s] overflow-hidden" style={{
                    boxShadow: "rgba(0, 0, 0, 0.5) -2.24px 2.13px 5px 0px inset, rgba(0, 0, 0, 0.5) 2.13px -2.13px 5px 0px inset"
                }}>
                    <span className="relative z-20">Read More</span>
                </button>
            </div>
            <div className="basis-3/4">
                <div className="flex gap-9">
                    <div className="rounded-2xl bg-[#FFFFFF1F] p-5">
                        <h3 className="text-white text-[26px] font-bold font-quicksand mb-5">Rate Your Stay</h3>
                        <p className="text-base text-[#9C9C9C] font-quicksand font-medium tracking-wide">
                            Share honest reviews and rate your accommodations. Your feedback matters and helps others make informed decisions.
                        </p>
                        <div className="my-5">
                            <img src={'/images/review-mockup.png'} />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-1">
                                <span>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.752 0.994187V3.24419M15.252 0.992188V3.24219M1 16.7422V5.49219C0.999869 5.19663 1.05797 4.90394 1.17098 4.63084C1.284 4.35774 1.44971 4.10959 1.65866 3.90055C1.8676 3.69151 2.11568 3.52569 2.38873 3.41255C2.66178 3.29942 2.95444 3.24119 3.25 3.24119H16.75C17.3467 3.24119 17.919 3.47824 18.341 3.9002C18.7629 4.32215 19 4.89445 19 5.49119V16.7422M1 16.7422C1 17.3389 1.23705 17.9112 1.65901 18.3332C2.08097 18.7551 2.65326 18.9922 3.25 18.9922H16.75C17.3467 18.9922 17.919 18.7551 18.341 18.3332C18.7629 17.9112 19 17.3389 19 16.7422M1 16.7422V9.24219C1 8.64545 1.23705 8.07315 1.65901 7.6512C2.08097 7.22924 2.65326 6.99219 3.25 6.99219H16.75C17.3467 6.99219 17.919 7.22924 18.341 7.6512C18.7629 8.07315 19 8.64545 19 9.24219V16.7422M12.25 10.7422H14.5M5.5 12.9922H10M10.002 10.7422H10.007V10.7482H10.002V10.7422ZM10.001 15.2422H10.007V15.2482H10.001V15.2422ZM7.751 15.2432H7.756V15.2492H7.752L7.751 15.2432ZM5.501 15.2432H5.506V15.2482H5.5L5.501 15.2432ZM12.251 12.9962H12.256V13.0012H12.251V12.9962ZM12.251 15.2432H12.257V15.2492H12.251V15.2432ZM14.501 12.9952H14.507V12.9992H14.502L14.501 12.9952Z" stroke="#9C9C9C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className="text-base text-[#9C9C9C] font-quicksand font-medium tracking-wide">27 sep 2024</span>
                            </div>
                            <div className="flex gap-1">
                                <span>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 3C7.03125 3 3 7.03125 3 12C3 16.9688 7.03125 21 12 21C16.9688 21 21 16.9688 21 12C21 7.03125 16.9688 3 12 3Z" stroke="#9C9C9C" strokeWidth="1.5" strokeMiterlimit="10" />
                                        <path d="M12 6V12.75H16.5" stroke="#9C9C9C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className="text-base text-[#9C9C9C] font-quicksand font-medium tracking-wide">1 hour</span>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl bg-[#FFFFFF1F] p-5">
                        <h3 className="text-white text-[26px] font-bold font-quicksand mb-5">One App Solution</h3>
                        <p className="text-base text-[#9C9C9C] font-quicksand font-medium tracking-wide">Share honest reviews and rate your accommodations. Your feedback matters and helps others make informed decisions.</p>
                        <div className="my-5">
                            <img src={'/images/mockup-natural-titanium.png'} />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-1">
                                <span>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.752 0.994187V3.24419M15.252 0.992188V3.24219M1 16.7422V5.49219C0.999869 5.19663 1.05797 4.90394 1.17098 4.63084C1.284 4.35774 1.44971 4.10959 1.65866 3.90055C1.8676 3.69151 2.11568 3.52569 2.38873 3.41255C2.66178 3.29942 2.95444 3.24119 3.25 3.24119H16.75C17.3467 3.24119 17.919 3.47824 18.341 3.9002C18.7629 4.32215 19 4.89445 19 5.49119V16.7422M1 16.7422C1 17.3389 1.23705 17.9112 1.65901 18.3332C2.08097 18.7551 2.65326 18.9922 3.25 18.9922H16.75C17.3467 18.9922 17.919 18.7551 18.341 18.3332C18.7629 17.9112 19 17.3389 19 16.7422M1 16.7422V9.24219C1 8.64545 1.23705 8.07315 1.65901 7.6512C2.08097 7.22924 2.65326 6.99219 3.25 6.99219H16.75C17.3467 6.99219 17.919 7.22924 18.341 7.6512C18.7629 8.07315 19 8.64545 19 9.24219V16.7422M12.25 10.7422H14.5M5.5 12.9922H10M10.002 10.7422H10.007V10.7482H10.002V10.7422ZM10.001 15.2422H10.007V15.2482H10.001V15.2422ZM7.751 15.2432H7.756V15.2492H7.752L7.751 15.2432ZM5.501 15.2432H5.506V15.2482H5.5L5.501 15.2432ZM12.251 12.9962H12.256V13.0012H12.251V12.9962ZM12.251 15.2432H12.257V15.2492H12.251V15.2432ZM14.501 12.9952H14.507V12.9992H14.502L14.501 12.9952Z" stroke="#9C9C9C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className="text-base text-[#9C9C9C] font-quicksand font-medium tracking-wide">27 sep 2024</span>
                            </div>
                            <div className="flex gap-1">
                                <span>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 3C7.03125 3 3 7.03125 3 12C3 16.9688 7.03125 21 12 21C16.9688 21 21 16.9688 21 12C21 7.03125 16.9688 3 12 3Z" stroke="#9C9C9C" strokeWidth="1.5" strokeMiterlimit="10" />
                                        <path d="M12 6V12.75H16.5" stroke="#9C9C9C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className="text-base text-[#9C9C9C] font-quicksand font-medium tracking-wide">1 hour</span>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl bg-[#FFFFFF1F] p-5">
                        <h3 className="text-white text-[26px] font-bold font-quicksand mb-5">No Fake Profiles</h3>
                        <p className="text-base text-[#9C9C9C] font-quicksand font-medium tracking-wide">
                            Hotel Media ensures an authentic community by eliminating fake accounts. Engage with real travelers and venues.
                        </p>
                        <div className="my-5">
                            <img src={'/images/portrait-mockup-2.png'} />
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-1">
                                <span>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.752 0.994187V3.24419M15.252 0.992188V3.24219M1 16.7422V5.49219C0.999869 5.19663 1.05797 4.90394 1.17098 4.63084C1.284 4.35774 1.44971 4.10959 1.65866 3.90055C1.8676 3.69151 2.11568 3.52569 2.38873 3.41255C2.66178 3.29942 2.95444 3.24119 3.25 3.24119H16.75C17.3467 3.24119 17.919 3.47824 18.341 3.9002C18.7629 4.32215 19 4.89445 19 5.49119V16.7422M1 16.7422C1 17.3389 1.23705 17.9112 1.65901 18.3332C2.08097 18.7551 2.65326 18.9922 3.25 18.9922H16.75C17.3467 18.9922 17.919 18.7551 18.341 18.3332C18.7629 17.9112 19 17.3389 19 16.7422M1 16.7422V9.24219C1 8.64545 1.23705 8.07315 1.65901 7.6512C2.08097 7.22924 2.65326 6.99219 3.25 6.99219H16.75C17.3467 6.99219 17.919 7.22924 18.341 7.6512C18.7629 8.07315 19 8.64545 19 9.24219V16.7422M12.25 10.7422H14.5M5.5 12.9922H10M10.002 10.7422H10.007V10.7482H10.002V10.7422ZM10.001 15.2422H10.007V15.2482H10.001V15.2422ZM7.751 15.2432H7.756V15.2492H7.752L7.751 15.2432ZM5.501 15.2432H5.506V15.2482H5.5L5.501 15.2432ZM12.251 12.9962H12.256V13.0012H12.251V12.9962ZM12.251 15.2432H12.257V15.2492H12.251V15.2432ZM14.501 12.9952H14.507V12.9992H14.502L14.501 12.9952Z" stroke="#9C9C9C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className="text-base text-[#9C9C9C] font-quicksand font-medium tracking-wide">27 sep 2024</span>
                            </div>
                            <div className="flex gap-1">
                                <span>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 3C7.03125 3 3 7.03125 3 12C3 16.9688 7.03125 21 12 21C16.9688 21 21 16.9688 21 12C21 7.03125 16.9688 3 12 3Z" stroke="#9C9C9C" strokeWidth="1.5" strokeMiterlimit="10" />
                                        <path d="M12 6V12.75H16.5" stroke="#9C9C9C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <span className="text-base text-[#9C9C9C] font-quicksand font-medium tracking-wide">1 hour</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Blog;