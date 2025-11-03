import StatusButton from ".";
const StatusDropDown: React.FC<{ onStatusChange: (status: string) => void, open: boolean }> = ({ onStatusChange, open }) => {


    return (
        <div id="dropdown" className={`${open ? '' : 'hidden'} mt-1.5 absolute z-10 bg-[#1C1C1C50] divide-y divide-gray-100 rounded-[14px] shadow-sm w-44 dark:bg-[#1C1C1C50] backdrop-blur-[40px]`}>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" >
                <li className="block px-2 py-1">
                    <StatusButton status={'confirmed'} text="Booking Confirm" onClick={() => onStatusChange('confirmed')} />
                </li>
                <li className="block px-2 py-1">
                    <StatusButton status={'pending'} onClick={() => onStatusChange('pending')} />
                </li>
                <li className="block px-2 py-1">
                    <StatusButton status={'canceled by business'} text="Rejected" onClick={() => onStatusChange('canceled by business')} />
                </li>
                <li className="block px-2 py-1">
                    {/* <StatusButton status={'confirmed'} text="Booking Confirm" onClick={onClick('confirmed', booking._id)} /> */}
                </li>
            </ul>
        </div>
    )
}
export default StatusDropDown;