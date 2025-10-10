"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
export default function TanstackQueryProvider({ children }: any) {
    const [queryClient] = React.useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnMount: false,
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
                retry: false,
            },
        },
    }))
    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
}
