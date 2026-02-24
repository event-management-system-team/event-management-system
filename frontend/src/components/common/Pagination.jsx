import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (!totalPages || totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        // flex justify-center để luôn căn giữa màn hình
        <nav className="mt-16 flex justify-center gap-2 items-center w-full pb-8">

            {/* Nút Previous */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 transition-all ${currentPage === 1
                        ? 'opacity-50 cursor-not-allowed text-gray-400 bg-gray-50'
                        : 'hover:bg-primary hover:text-white cursor-pointer'
                    }`}
            >
                <ChevronLeft size={20} strokeWidth={2.5} />
            </button>

            {/* Các nút Số Trang */}
            {getPageNumbers().map((page, index) => {
                // Render dấu 3 chấm
                if (page === '...') {
                    return (
                        <span key={index} className="w-10 h-10 flex items-center justify-center text-gray-400">
                            <MoreHorizontal size={20} />
                        </span>
                    );
                }

                // Render nút số
                const isActive = page === currentPage;
                return (
                    <button
                        key={index}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all cursor-pointer ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/30 border border-primary'
                                : 'border border-gray-200 text-gray-600 hover:bg-primary/10 hover:border-primary hover:text-primary'
                            }`}
                    >
                        {page}
                    </button>
                );
            })}

            {/* Nút Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 transition-all ${currentPage === totalPages
                        ? 'opacity-50 cursor-not-allowed text-gray-400 bg-gray-50'
                        : 'hover:bg-primary hover:text-white cursor-pointer'
                    }`}
            >
                <ChevronRight size={20} strokeWidth={2.5} />
            </button>
        </nav>
    );
};

export default Pagination;