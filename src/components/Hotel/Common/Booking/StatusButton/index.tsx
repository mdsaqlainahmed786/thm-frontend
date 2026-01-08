const StatusButton: React.FC<{ onClick?: React.MouseEventHandler<HTMLButtonElement>; status: string; isToggled?: boolean, text?: string, disabled?: boolean }> = ({ onClick, status, isToggled, text, disabled }) => {

    // CREATED = "created",
    // PENDING = "pending",       // Booking is created but not yet confirmed
    // CONFIRMED = "confirmed",   // Booking is confirmed
    // CHECKED_IN = "checked in", // Customer has checked into the hotel
    // COMPLETED = "completed",   // Stay has been completed and booking is finished
    // CANCELED = "canceled",     // Booking has been canceled
    // NO_SHOW = "no show"        // Customer did not show up for the booking
    let className = "text-white focus:ring-1 focus:outline-none font-medium rounded-[32px] text-xs px-3.5 py-1.5 text-center flex items-center";
    switch (status) {
        case "pending":
            className += " bg-[#C29500] hover:bg-[#C29500] focus:[#C29500] dark:focus:ring-[#C29500] dark:bg-[#C29500] dark:hover:bg-[#C29500] relative"
            break;
        case "canceled by business":
            className += " bg-[#C10808] hover:bg-[#C10808] focus:[#C10808] dark:focus:ring-[#C10808] dark:bg-[#C10808] dark:hover:bg-[#C10808] relative"
            break;
        case "canceled by user":
            className += " bg-[#C10808] hover:bg-[#C10808] focus:[#C10808] dark:focus:ring-[#C10808] dark:bg-[#C10808] dark:hover:bg-[#C10808] relative"
            break;
        case "canceled":
            className += " bg-[#C10808] hover:bg-[#C10808] focus:[#C10808] dark:focus:ring-[#C10808] dark:bg-[#C10808] dark:hover:bg-[#C10808] relative"
            break;
        case "confirmed":
            className += " bg-[#6F42C1] hover:bg-[#6F42C1] focus:[#6F42C1] dark:focus:ring-[#6F42C1] dark:bg-[#6F42C1] dark:hover:bg-[#6F42C1] relative"
            break;
        case "created":
            className += " bg-[#009300] hover:bg-[#009300] focus:[#009300] dark:focus:ring-[#009300] dark:bg-[#009300] dark:hover:bg-[#009300] relative"
            break;
        default:
            break;
    }
    return (
        <button onClick={onClick} className={`${className} ${disabled && 'opacity-80'}`} type="button" disabled={disabled ?? false}>
            <span className={`${isToggled !== undefined && 'pe-3'} capitalize`}>{text ?? status}</span>
            {
                isToggled !== undefined &&
                <svg className={`${isToggled ? 'rotate-180' : ''} w-2 h-2 ms-1 absolute right-3 top-2.5`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
            }
        </button>
    )
}
export default StatusButton;