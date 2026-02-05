const Input: React.FC<{ type?: "email" | "time" | "number" | "date"; disabled?: boolean; placeholder?: string; name: string; id: string, required?: boolean, value?: string; step?: string | number; onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined }> = ({ type, disabled, name, id, required, value, placeholder, step, onChange }) => {
    return (
        <input id={id} disabled={disabled ?? false}
            step={type === "number" && step ? step : undefined}
            placeholder={placeholder} required={required ?? false} className="w-full rounded-theme-xl border border-theme-primary bg-theme-secondary px-4.5 py-3 text-theme-primary focus:border-primary focus-visible:outline-none text-sm font-normal placeholder-theme-tertiary disabled:bg-theme-tertiary disabled:cursor-not-allowed" type={type ?? "text"} name={name} value={value} onChange={onChange} />
    )
}
export default Input;