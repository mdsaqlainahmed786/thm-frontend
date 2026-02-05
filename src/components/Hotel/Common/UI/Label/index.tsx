const Label: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
    return (
        <label htmlFor={id} className="mb-1.5 block text-sm font-normal text-theme-secondary font-quicksand">
            {children}
        </label>
    )
}

export default Label;