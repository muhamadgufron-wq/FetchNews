"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  // Pastikan QueryClient diinisialisasi sekali per lifecycle client-side
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data dianggap fresh selama 5 menit (pindah tab tidak akan hit server/API lagi)
            staleTime: 1000 * 60 * 5,
            // Data disimpan dalam memory cache selama 30 menit
            gcTime: 1000 * 60 * 30,
            // Jangan refetch otomatis saat pengguna berpindah tab browser
            refetchOnWindowFocus: false,
            // Coba 1 kali pengulangan jika request gagal
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
