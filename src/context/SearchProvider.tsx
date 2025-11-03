import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchInputContext {
    value: string;
    setValue: (value: string) => void;
}

const InputContext = createContext<SearchInputContext | undefined>(undefined);

interface InputProviderProps {
    children: ReactNode;
}

export const InputProvider: React.FC<InputProviderProps> = ({ children }) => {
    const [value, setValue] = useState<string>('');
    return (
        <InputContext.Provider value={{ value, setValue }}>
            {children}
        </InputContext.Provider>
    );
};

// Custom hook to use the InputContext
export const useSearchInput = (): SearchInputContext => {
    const context = useContext(InputContext);
    if (!context) {
        throw new Error('useInput must be used within an InputProvider');
    }
    return context;
};