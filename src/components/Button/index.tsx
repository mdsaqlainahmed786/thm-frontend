"use client";

import AppConfig from "@/config/constants";
import Link from "next/link";
import React from "react";
import SVG from "../SVG";

interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

interface CustomizableButtonProps extends ButtonProps {
  text?: string;
  variant: "primary" | "danger" | "secondary" | "ghost";
  submit?: boolean;
  loading?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

/**
 * Primary Button Component with variants
 */
const Buttons: React.FC<CustomizableButtonProps> = ({
  submit,
  text,
  variant,
  loading,
  onClick,
  disabled = false,
  size = "md",
  fullWidth = false,
}) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-60 disabled:cursor-not-allowed
    btn-active
  `;

  const sizeClasses = {
    sm: "px-3 py-1.5 text-body-sm min-h-9",
    md: "px-5 py-2.5 text-body-md min-h-11",
    lg: "px-6 py-3 text-body-lg min-h-12",
  };

  const variantClasses = {
    primary: `
      bg-brand-primary text-white
      hover:bg-brand-primary-hover
      focus:ring-brand-primary/30
    `,
    secondary: `
      bg-theme-secondary text-theme-primary
      border border-theme-primary
      hover:bg-theme-hover
      focus:ring-theme-primary/30
    `,
    danger: `
      bg-status-error text-white
      hover:bg-status-error/90
      focus:ring-status-error/30
    `,
    ghost: `
      bg-transparent text-theme-secondary
      hover:bg-theme-hover hover:text-theme-primary
      focus:ring-theme-primary/30
    `,
  };

  return (
    <button
      type={submit ? "submit" : "button"}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? "w-full" : ""}
      `}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        text ?? "Button"
      )}
    </button>
  );
};

/**
 * Icon Button - Small circular button with icon only
 */
const IconButton: React.FC<{
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon: React.ReactNode;
  label: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}> = ({ onClick, icon, label, variant = "ghost", size = "md" }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const variantClasses = {
    primary: "bg-brand-primary text-white hover:bg-brand-primary-hover",
    secondary: "bg-theme-secondary text-theme-primary hover:bg-theme-hover",
    danger: "bg-status-error text-white hover:bg-status-error/90",
    ghost: "bg-transparent text-theme-secondary hover:bg-theme-hover hover:text-theme-primary",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`
        inline-flex items-center justify-center rounded-lg
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-brand-primary/30
        btn-active
        ${sizeClasses[size]}
        ${variantClasses[variant]}
      `}
    >
      {icon}
    </button>
  );
};

const EditButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      label="Edit"
      icon={
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
          <path d="M15.55 2.97499C15.55 2.77499 15.475 2.57499 15.325 2.42499C15.025 2.12499 14.725 1.82499 14.45 1.52499C14.175 1.24999 13.925 0.974987 13.65 0.724987C13.525 0.574987 13.375 0.474986 13.175 0.449986C12.95 0.424986 12.75 0.474986 12.575 0.624987L10.875 2.32499H2.02495C1.17495 2.32499 0.449951 3.02499 0.449951 3.89999V14C0.449951 14.85 1.14995 15.575 2.02495 15.575H12.15C13 15.575 13.725 14.875 13.725 14V5.12499L15.35 3.49999C15.475 3.34999 15.55 3.17499 15.55 2.97499ZM8.19995 8.99999C8.17495 9.02499 8.17495 9.02499 8.14995 9.02499L6.34995 9.62499L6.94995 7.82499C6.94995 7.79999 6.97495 7.79999 6.97495 7.77499L11.475 3.27499L12.725 4.49999L8.19995 8.99999ZM12.575 14C12.575 14.25 12.375 14.45 12.125 14.45H2.02495C1.77495 14.45 1.57495 14.25 1.57495 14V3.87499C1.57495 3.62499 1.77495 3.42499 2.02495 3.42499H9.72495L6.17495 6.99999C6.04995 7.12499 5.92495 7.29999 5.87495 7.49999L4.94995 10.3C4.87495 10.5 4.92495 10.675 5.02495 10.85C5.09995 10.95 5.24995 11.1 5.52495 11.1H5.62495L8.49995 10.15C8.67495 10.1 8.84995 9.97499 8.97495 9.84999L12.575 6.24999V14ZM13.5 3.72499L12.25 2.49999L13.025 1.72499C13.225 1.92499 14.05 2.74999 14.25 2.97499L13.5 3.72499Z" />
        </svg>
      }
    />
  );
};

const DeleteButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      label="Delete"
      variant="danger"
      icon={
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 18 18">
          <path d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z" />
          <path d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z" />
          <path d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z" />
          <path d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z" />
        </svg>
      }
    />
  );
};

const ViewButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      label="View"
      icon={
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 18 18">
          <path d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z" />
          <path d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z" />
        </svg>
      }
    />
  );
};

const DialogConfirm: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <Buttons
      variant="danger"
      text="Yes, Delete"
      onClick={onClick}
    />
  );
};

const DialogCancel: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <Buttons
      variant="secondary"
      text="Cancel"
      onClick={onClick}
    />
  );
};

const AddButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <Buttons
      variant="primary"
      text="Add"
      onClick={onClick}
      size="sm"
    />
  );
};

const ButtonWithIcon: React.FC<CustomizableButtonProps & { icon: any }> = ({
  icon,
  text,
  onClick,
  variant = "primary",
  size = "md",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 rounded-lg
        bg-brand-primary text-white font-medium
        px-4 py-2
        transition-all duration-200 ease-out
        hover:bg-brand-primary-hover
        focus:outline-none focus:ring-2 focus:ring-brand-primary/30
        btn-active
      `}
    >
      {icon}
      {text ?? "Button"}
    </button>
  );
};

const DownloadButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      label="Download"
      icon={
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 18 18">
          <path d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z" />
          <path d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z" />
        </svg>
      }
    />
  );
};

// Hotel Theme Buttons
const HotelThemeButton: React.FC<
  ButtonProps & { name: string; svg: React.ReactNode }
> = ({ svg, name, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        inline-flex items-center gap-1.5 rounded-full
        bg-brand-primary/20 text-brand-primary
        pl-1 pr-3 py-1
        text-body-sm font-medium
        transition-all duration-200
        hover:bg-brand-primary/30
        focus:outline-none focus:ring-2 focus:ring-brand-primary/30
        btn-active
      "
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white">
        {svg}
      </span>
      {name}
    </button>
  );
};

const HotelThemeEditButton: React.FC<
  ButtonProps & { name: string; svg: React.ReactNode }
> = ({ svg, name, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={name}
      className="
        flex h-8 w-8 items-center justify-center rounded-full
        bg-brand-primary text-white
        transition-all duration-200
        hover:bg-brand-primary-hover hover:scale-110
        focus:outline-none focus:ring-2 focus:ring-brand-primary/30
        btn-active
      "
    >
      {svg}
    </button>
  );
};

const HotelThemeDeleteButton: React.FC<
  ButtonProps & { name: string; svg: React.ReactNode }
> = ({ svg, name, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={name}
      className="
        flex h-8 w-8 items-center justify-center rounded-full
        bg-status-error text-white
        transition-all duration-200
        hover:bg-status-error/90 hover:scale-110
        focus:outline-none focus:ring-2 focus:ring-status-error/30
        btn-active
      "
    >
      {svg}
    </button>
  );
};

const HotelThemeViewButton: React.FC<
  ButtonProps & { name: string; svg: React.ReactNode }
> = ({ svg, name, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={name}
      className="
        flex h-8 w-8 items-center justify-center rounded-full
        bg-brand-primary text-white
        transition-all duration-200
        hover:bg-brand-primary-hover hover:scale-110
        focus:outline-none focus:ring-2 focus:ring-brand-primary/30
        btn-active
      "
    >
      {svg}
    </button>
  );
};

const PlayStoreButton: React.FC = () => {
  return (
    <Link href={AppConfig.PLAY_STORE_LINK} className="transition-transform hover:scale-105">
      <SVG.GooglePlay />
    </Link>
  );
};

const AppStoreButton: React.FC = () => {
  return (
    <Link href={AppConfig.APP_STORE_LINK} className="transition-transform hover:scale-105">
      <SVG.AppStore />
    </Link>
  );
};

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
  Icon: IconButton,
  Hotel: {
    Button: HotelThemeButton,
    Edit: HotelThemeEditButton,
    Delete: HotelThemeDeleteButton,
    View: HotelThemeViewButton,
  },
});
