import { QueryClient } from '"@tanstack/react-query';
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1, // Thử lại một lần nếu thất bại
            refetchOnWindowFocus: false, // Không tự động refetch khi cửa sổ được focus lại
            staleTime: 1000 * 60 * 5 // Dữ liệu được coi là "tươi" trong 5 phút
        },
    },
});