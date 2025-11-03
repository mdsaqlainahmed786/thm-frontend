interface PaginationProps {
    pageNo: number,
    totalPages: number,
    totalResources?: number,
    alignment?: "left" | "right" | "center",
    onPageChange: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, page: number) => void,
}

function Paginator({ pageNo, totalPages, totalResources, alignment, onPageChange }: PaginationProps) {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }
    let nextPages: any[] = [];
    let prevPages: any[] = [];

    if (pageNo >= 4) {
        nextPages = pages.slice(pageNo, pageNo + 3);
        prevPages = pages.slice(pageNo - 3, pageNo);
    } else {
        nextPages = pages.slice(0, 3);
        prevPages = pages.slice(3, 6);
    }

    if (nextPages.length >= 3 && nextPages.length >= 3) {
        pages = prevPages.concat(nextPages).sort(function (a, b) {
            return a - b;
        });
    } else {
        nextPages = pages.slice(totalPages - 6, totalPages - 3);
        prevPages = pages.slice(totalPages - 3, totalPages);
        pages = prevPages.concat(nextPages).sort(function (a, b) {
            return a - b;
        });
    }
    let className;
    switch (alignment) {
        case "left":
            className = "flex items-center justify-end my-5 gap-1";
            break;
        case "right":
            className = "flex items-center justify-end my-5 gap-1";
            break;
        case "center":
            className = "flex items-center justify-end my-5 gap-1";
            break;
        default:
            className = "flex items-center justify-end my-5 gap-1";
    }
    return (

        <div className="flex justify-between items-center px-8 py-5 ">
            <p className="font-medium">Showing {pageNo} 0f {totalPages} pages</p>
            {
                totalPages > 1 ?
                    <div className={className}>
                        <button type="button" disabled={pageNo <= 1} className={`${pageNo <= 1 ? "" : ""} px-2.5 py-1.5 h-8 text-sm font-normal font-quicksand flex cursor-pointer items-center justify-center rounded-lg hover:bg-primary hover:text-whiter`} onClick={(event) => onPageChange(event, pageNo - 1)}  >
                            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.1777 16.1156C12.009 16.1156 11.8402 16.0593 11.7277 15.9187L5.37148 9.44995C5.11836 9.19683 5.11836 8.80308 5.37148 8.54995L11.7277 2.0812C11.9809 1.82808 12.3746 1.82808 12.6277 2.0812C12.8809 2.33433 12.8809 2.72808 12.6277 2.9812L6.72148 8.99995L12.6559 15.0187C12.909 15.2718 12.909 15.6656 12.6559 15.9187C12.4871 16.0312 12.3465 16.1156 12.1777 16.1156Z" fill=""></path></svg>
                        </button>
                        {pages && pages.map((page, index) => {
                            return (
                                <button type="button" key={index} className={`${pageNo === page ? "border-primary bg-primary text-white" : "border-stroke text-black"} px-2.5 py-1.5 h-8 text-sm font-normal font-quicksand dark:text-white flex cursor-pointer items-center justify-center rounded-lg hover:bg-primary hover:text-white`} onClick={(event) => onPageChange(event, page)}>
                                    <span className="px-1.5 text-center">{page}</span>
                                </button>
                            )
                        })}
                        <button disabled={totalPages <= pageNo} type="button" className="px-2.5 py-1.5 h-8 text-sm font-normal font-quicksand flex cursor-pointer items-center justify-center rounded-lg hover:bg-primary hover:text-white" onClick={(event) => onPageChange(event, pageNo + 1)}>
                            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.82148 16.1156C5.65273 16.1156 5.51211 16.0593 5.37148 15.9468C5.11836 15.6937 5.11836 15.3 5.37148 15.0468L11.2777 8.99995L5.37148 2.9812C5.11836 2.72808 5.11836 2.33433 5.37148 2.0812C5.62461 1.82808 6.01836 1.82808 6.27148 2.0812L12.6277 8.54995C12.8809 8.80308 12.8809 9.19683 12.6277 9.44995L6.27148 15.9187C6.15898 16.0312 5.99023 16.1156 5.82148 16.1156Z" fill=""></path></svg>
                        </button>
                    </div>
                    :
                    null
            }
        </div>
    );
}

export default Paginator;