const Label: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
    return (
        <label htmlFor={id} className="mb-1.5 block text-sm font-normal text-white/60 dark:text-white/60 font-quicksand">
            {children}
        </label>
    )
}

export default Label;