import AppConfig from "@/config/constants";
import Link from "next/link";
import React from "react"
import SVG from "../SVG";
interface ButtonProps {

    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}
interface CustomizableButtonProps extends ButtonProps {

    text?: string;
    variant: 'primary' | 'danger';
    submit?: boolean;
    loading?: boolean;
}
const Buttons: React.FC<CustomizableButtonProps> = ({ submit, text, variant, loading, onClick }) => {
    return (
        <button type={submit ? 'submit' : 'button'} onClick={submit ? onClick : () => { }} className={`inline-flex items-center justify-center gap-2.5 bg-${variant} px-6 py-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-6 relative rounded-full`}>
            {
                loading ? <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                    <span className="sr-only">Loading...</span>
                </div>
                    : text ?? 'Button'
            }
        </button>
    )
}
const EditButton: React.FC<ButtonProps> = ({ onClick }) => {
    return (
        <button className="hover:text-primary" onClick={onClick}>
            <svg
                className="fill-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g clipPath="url(#clip0_62_9787)">
                    <path
                        d="M15.55 2.97499C15.55 2.77499 15.475 2.57499 15.325 2.42499C15.025 2.12499 14.725 1.82499 14.45 1.52499C14.175 1.24999 13.925 0.974987 13.65 0.724987C13.525 0.574987 13.375 0.474986 13.175 0.449986C12.95 0.424986 12.75 0.474986 12.575 0.624987L10.875 2.32499H2.02495C1.17495 2.32499 0.449951 3.02499 0.449951 3.89999V14C0.449951 14.85 1.14995 15.575 2.02495 15.575H12.15C13 15.575 13.725 14.875 13.725 14V5.12499L15.35 3.49999C15.475 3.34999 15.55 3.17499 15.55 2.97499ZM8.19995 8.99999C8.17495 9.02499 8.17495 9.02499 8.14995 9.02499L6.34995 9.62499L6.94995 7.82499C6.94995 7.79999 6.97495 7.79999 6.97495 7.77499L11.475 3.27499L12.725 4.49999L8.19995 8.99999ZM12.575 14C12.575 14.25 12.375 14.45 12.125 14.45H2.02495C1.77495 14.45 1.57495 14.25 1.57495 14V3.87499C1.57495 3.62499 1.77495 3.42499 2.02495 3.42499H9.72495L6.17495 6.99999C6.04995 7.12499 5.92495 7.29999 5.87495 7.49999L4.94995 10.3C4.87495 10.5 4.92495 10.675 5.02495 10.85C5.09995 10.95 5.24995 11.1 5.52495 11.1H5.62495L8.49995 10.15C8.67495 10.1 8.84995 9.97499 8.97495 9.84999L12.575 6.24999V14ZM13.5 3.72499L12.25 2.49999L13.025 1.72499C13.225 1.92499 14.05 2.74999 14.25 2.97499L13.5 3.72499Z"
                        fill=""
                    />
                </g>
                <defs>
                    <clipPath id="clip0_62_9787">
                        <rect width="16" height="16" fill="white" />
                    </clipPath>
                </defs>
            </svg>
        </button>
    );
}
const DeleteButton: React.FC<ButtonProps> = ({ onClick }) => {
    return (
        <button className="hover:text-primary" onClick={onClick}>
            <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                    fill=""
                />
                <path
                    d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                    fill=""
                />
                <path
                    d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                    fill=""
                />
                <path
                    d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                    fill=""
                />
            </svg>
        </button>
    );
}
const ViewButton: React.FC<ButtonProps> = ({ onClick }) => {
    return (
        <button className="hover:text-primary" onClick={onClick}>
            <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                    fill=""
                />
                <path
                    d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                    fill=""
                />
            </svg>
        </button>
    );
}

const DialogConfirm: React.FC<ButtonProps> = ({ onClick }) => {
    return (
        <button onClick={onClick} className="inline-flex items-center justify-center gap-2.5 bg-danger px-6 py-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-6 rounded-full">
            <span>
                <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M17.8125 16.6656H2.1875C1.69022 16.6656 1.21331 16.4681 0.861675 16.1164C0.510044 15.7648 0.3125 15.2879 0.3125 14.7906V5.20935C0.3125 4.71207 0.510044 4.23516 0.861675 3.88353C1.21331 3.53189 1.69022 3.33435 2.1875 3.33435H17.8125C18.3098 3.33435 18.7867 3.53189 19.1383 3.88353C19.49 4.23516 19.6875 4.71207 19.6875 5.20935V14.7906C19.6875 15.2879 19.49 15.7648 19.1383 16.1164C18.7867 16.4681 18.3098 16.6656 17.8125 16.6656ZM2.1875 4.58435C2.02174 4.58435 1.86277 4.6502 1.74556 4.76741C1.62835 4.88462 1.5625 5.04359 1.5625 5.20935V14.7906C1.5625 14.9564 1.62835 15.1153 1.74556 15.2325C1.86277 15.3498 2.02174 15.4156 2.1875 15.4156H17.8125C17.9783 15.4156 18.1372 15.3498 18.2544 15.2325C18.3717 15.1153 18.4375 14.9564 18.4375 14.7906V5.20935C18.4375 5.04359 18.3717 4.88462 18.2544 4.76741C18.1372 4.6502 17.9783 4.58435 17.8125 4.58435H2.1875Z"
                        fill=""
                    />
                    <path
                        d="M9.9996 10.6438C9.63227 10.6437 9.2721 10.5421 8.95898 10.35L0.887102 5.45001C0.744548 5.36381 0.642073 5.22452 0.602222 5.06277C0.58249 4.98268 0.578725 4.89948 0.591144 4.81794C0.603563 4.73639 0.631922 4.65809 0.674602 4.58751C0.717281 4.51692 0.773446 4.45543 0.839888 4.40655C0.906331 4.35767 0.981751 4.32236 1.06184 4.30263C1.22359 4.26277 1.39455 4.28881 1.5371 4.37501L9.60898 9.28126C9.7271 9.35331 9.8628 9.39143 10.0012 9.39143C10.1395 9.39143 10.2752 9.35331 10.3934 9.28126L18.4621 4.37501C18.5323 4.33233 18.6102 4.30389 18.6913 4.29131C18.7725 4.27873 18.8554 4.28227 18.9352 4.30171C19.015 4.32115 19.0901 4.35612 19.1564 4.40462C19.2227 4.45312 19.2788 4.51421 19.3215 4.58438C19.3642 4.65456 19.3926 4.73245 19.4052 4.81362C19.4177 4.89478 19.4142 4.97763 19.3948 5.05743C19.3753 5.13723 19.3404 5.21242 19.2919 5.27871C19.2434 5.34499 19.1823 5.40108 19.1121 5.44376L11.0402 10.35C10.7271 10.5421 10.3669 10.6437 9.9996 10.6438Z"
                        fill=""
                    />
                </svg>
            </span>
            Yes Delete
        </button>
    );
}
const DialogCancel: React.FC<ButtonProps> = ({ onClick }) => {
    return (
        <button onClick={onClick} className="inline-flex items-center justify-center gap-2.5  bg-gray-2 dark:bg-meta-4 px-6 py-3 text-center font-medium dark:text-white hover:bg-opacity-90 lg:px-8 xl:px-10 rounded-full">
            Cancel
        </button>
    );
}
const AddButton: React.FC<ButtonProps> = ({ onClick }) => {
    return (
        <button className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90" onClick={onClick}>
            Add
        </button>
    );
}
const ButtonWithIcon: React.FC<CustomizableButtonProps & { icon: any }> = ({ icon, text, onClick }) => {
    return (
        <button className="flex items-center gap-2  bg-primary px-4.5 py-2 font-medium text-white hover:bg-opacity-80 rounded-full" onClick={onClick}>
            {icon}
            {text ?? "Button"}
        </button>
    )
}
const DownloadButton: React.FC<ButtonProps> = ({ onClick }) => {
    return (
        <button className="hover:text-primary" onClick={onClick}>
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
                />
                <path
                    d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                    fill=""
                />
            </svg>
        </button>
    );
}

const HotelThemeButton: React.FC<ButtonProps & { name: string, svg: React.ReactNode }> = ({ svg, name, onClick }) => {
    return (
        <button type="button" className="bg-primary/60 flex gap-1 p-1 justify-center items-center rounded-3xl" onClick={onClick}>
            <div className="bg-primary w-6 h-6 rounded-full flex justify-center items-center">
                <span>
                    {svg}
                </span>
            </div>
            <span className="text-sm font-normal pr-0.5 tracking-wide">
                {name}
            </span>
        </button>
    )
}
const HotelThemeEditButton: React.FC<ButtonProps & { name: string, svg: React.ReactNode }> = ({ svg, name, onClick }) => {
    return (
        <button type="button" className="bg-primary flex gap-1 p-1 justify-center items-center rounded-3xl" onClick={onClick}>
            <div className="w-6 h-6 rounded-full flex justify-center items-center">
                <span>
                    {svg}
                </span>
            </div>
            <span className="sr-only">
                {name}
            </span>
        </button>
    )
}
const HotelThemeDeleteButton: React.FC<ButtonProps & { name: string, svg: React.ReactNode }> = ({ svg, name, onClick }) => {
    return (
        <button type="button" className="bg-[#E14141] flex gap-1 p-1 justify-center items-center rounded-3xl" onClick={onClick}>
            <div className="w-6 h-6 rounded-full flex justify-center items-center">
                <span>
                    {svg}
                </span>
            </div>
            <span className="sr-only">
                {name}
            </span>
        </button>
    )
}


const HotelThemeViewButton: React.FC<ButtonProps & { name: string, svg: React.ReactNode }> = ({ svg, name, onClick }) => {
    return (
        <button type="button" className="bg-primary flex gap-1 p-1 justify-center items-center rounded-3xl" onClick={onClick}>
            <div className="w-6 h-6 rounded-full flex justify-center items-center">
                <span>
                    {svg}
                </span>
            </div>
            <span className="sr-only">
                {name}
            </span>
        </button>
    )
}

const PlayStoreButton: React.FC<{}> = () => {
    return <Link href={AppConfig.PLAY_STORE_LINK}>
        <SVG.GooglePlay />
    </Link>
}
const AppStoreButton: React.FC<{}> = () => {
    return <Link href={AppConfig.APP_STORE_LINK}>
        <SVG.AppStore />
    </Link>
}


export default Object.assign(Buttons, {
    Add: AddButton,
    Edit: EditButton,
    Delete: DeleteButton,
    View: ViewButton,
    DialogConfirm: DialogConfirm,
    DialogCancel: DialogCancel,
    IconButton: ButtonWithIcon,
    Download: DownloadButton,
    PlayStore: PlayStoreButton,
    AppStore: AppStoreButton,
    Hotel: {
        Button: HotelThemeButton,
        Edit: HotelThemeEditButton,
        Delete: HotelThemeDeleteButton,
        View: HotelThemeViewButton
    }
});
