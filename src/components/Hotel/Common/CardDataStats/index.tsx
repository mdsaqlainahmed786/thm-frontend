import React from "react";

interface CardDataStatsProps {
    loading: boolean;
    title: string;
    count: number;
    children?: React.ReactNode;
    themeColor?: string;
}
const CardDataStats: React.FC<CardDataStatsProps> = ({
    loading,
    title,
    count,
    children,
    themeColor
}) => {
    return (
        <div className={`rounded-xl border border-theme-gray bg-theme-black p-4 shadow-default dark:border-theme-gray dark:bg-theme-black ${loading ? 'animate-pulse opacity-90' : ''}`}>
            <div className="flex  gap-3">
                <div className="flex justify-center items-center p-1 border  rounded-full" style={{ borderColor: themeColor ?? '#1E4EAE' }}>
                    <div className={`flex h-13.5 w-13.5 items-center justify-center rounded-full`} style={{ backgroundColor: themeColor ?? '#1E4EAE' }}>
                        {children}
                    </div>
                </div>
                <div className="flex gap-1.5 flex-col justify-center">
                    {loading ?
                        <div className="w-40 h-7 bg-gray-200 dark:bg-gray-700 mx-auto mb-3 rounded-md"></div>
                        :
                        <h4 className="text-title-md font-medium text-white dark:text-white font-quicksand">
                            {count}
                        </h4>
                    }
                    <span className="text-sm font-normal font-quicksand text-white/70 dark:text-white/70">{title}</span>
                </div>
            </div>
        </div >
    )
}

export default CardDataStats;