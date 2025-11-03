const Input: React.FC<{ type?: "email" | "time" | "number" | "date"; disabled?: boolean; placeholder?: string; name: string; id: string, required?: boolean, value?: string; step?: string | number; onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined }> = ({ type, disabled, name, id, required, value, placeholder, step, onChange }) => {
    return (
        <input id={id} disabled={disabled ?? false}
            step={type === "number" && step ? step : undefined}
            placeholder={placeholder} required={required ?? false} className="w-full rounded-theme-xl border border-theme-gray-1 bg-white px-4.5 py-3 text-white focus:border-primary focus-visible:outline-none dark:border-theme-gray-1 dark:bg-boxdark dark:text-white dark:focus:border-primary text-sm font-normal placeholder-white/60 " type={type ?? "text"} name={name} value={value} onChange={onChange} />
    )
}
export default Input;