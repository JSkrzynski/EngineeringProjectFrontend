import React from "react";

export default function PageChooser({markers, page, setPage}) {

    const handlePageButtonClick = (n) => {
        const maxPage = Math.ceil(markers.length / 10);
        setPage((page + n) < 1 ? 1 : (page + n > maxPage) ? maxPage : page + n);
    }

    return (
        <div className="PageChooser">
            <button onClick={() => handlePageButtonClick(-1)} className="PaginationButtonLeft">&#8592;</button>
            <button onClick={() => handlePageButtonClick(1)} className="PaginationButtonRight">&#8594;</button>
        </div>
    )
}