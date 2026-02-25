import {Button} from "./Button.jsx";

export const AccountsPagination = ({handleNext, handlePrev, handlePageChange, page, totalPages, isSearching}) => {

    const generatePages = () => {
        const pages = [];

        if (totalPages <= 4) {
            // view all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }

        } else {
            if (page <= 2) {
                pages.push(1, 2, 3, '...', totalPages);
            } else if (page >= totalPages - 1) {
                pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', page, '...', totalPages);
            }
        }

        return pages;
    }

    const pagesToShow = generatePages();

    return (
        <div className="flex gap-2 items-center">
            {/* Previous Page */}
            <Button
                variant="outline"
                size="sm"
                disabled={isSearching || page === 1}
                onClick={page === 1 ? undefined : handlePrev}
            >
                Previous
            </Button>

            {/* Page Numbers */}
            {pagesToShow.map((p, index) => {
                if (p === "...") {
                    return (
                        <span key={index} className="px-2 text-muted-foreground">
            ...
          </span>
                    )
                }

                return (
                    <Button
                        key={index}
                        variant={p === page ? "default" : "outline"}
                        size="sm"
                        disabled={isSearching}
                        onClick={() => {
                            if (p !== page) handlePageChange(p)
                        }}
                    >
                        {p}
                    </Button>
                )
            })}

            {/* Next Page */}
            <Button
                variant="outline"
                size="sm"
                disabled={isSearching || page === totalPages}
                onClick={page === totalPages ? undefined : handleNext}
            >
                Next
            </Button>
        </div>
    )
}